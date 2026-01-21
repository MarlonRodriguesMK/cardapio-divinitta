
import logo from "./assets/logo-divinitta.webp";
import { useEffect, useMemo, useRef, useState } from "react";
import { menu as BASE_MENU, WHATSAPP_NUMBER } from "./data/menu";
import "./styles.css";

const LS_PROMOS_KEY = "divinitta_promos_v1";

function getIsAdmin() {
  try {
    const p = new URLSearchParams(window.location.search);
    return p.get("admin") === "1";
  } catch {
    return false;
  }
}

function applyPromoOverrides(baseMenu) {
  try {
    const raw = localStorage.getItem(LS_PROMOS_KEY);
    if (!raw) return baseMenu;
    const promos = JSON.parse(raw);
    if (!Array.isArray(promos)) return baseMenu;

    return baseMenu.map((cat) => {
      if (cat.category !== "Promoção") return cat;
      return { ...cat, items: promos.map((it) => ({ ...it, category: "Promoção" })) };
    });
  } catch {
    return baseMenu;
  }
}

/**
 * Formata valores em Real (BRL)
 */
function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Gera uma chave única para o item no carrinho (produto + opções + observação)
 * Assim o cliente pode adicionar o mesmo produto com escolhas diferentes.
 */
function buildCartKey({ productId, selected, note }) {
  const opts = selected
    .map((g) => `${g.groupId}:${g.options.map((o) => o.id).sort().join(",")}`)
    .sort()
    .join("|");
  const safeNote = (note || "").trim().toLowerCase();
  return `${productId}__${opts}__${safeNote}`;
}

/**
 * Soma o preço unitário a partir das opções selecionadas:
 * - Se tiver um grupo "single" obrigatório (ex: Tamanho), o preço base normalmente vem dele.
 * - Extras somam ao preço base.
 */
function computeUnitPrice(product, selected) {
  const groupsById = new Map((product.optionGroups || []).map((g) => [g.id, g]));

  // Primeiro: tenta encontrar um "tamanho" (single) selecionado e usar o preço dele como base.
  let base = product.price ?? 0;

  selected.forEach((sel) => {
    const g = groupsById.get(sel.groupId);
    if (!g) return;

    if (g.type === "single" && g.required && sel.options[0]?.price != null) {
      base = sel.options[0].price;
    }
  });

  // Soma extras (multi) e single opcionais (borda etc)
  let extras = 0;
  selected.forEach((sel) => {
    sel.options.forEach((o) => {
      // evita somar novamente o tamanho obrigatório (já virou base)
      const g = groupsById.get(sel.groupId);
      if (g?.type === "single" && g?.required) return;
      extras += o.price || 0;
    });
  });

  return base + extras;
}

/**
 * Monta a mensagem do WhatsApp já organizada (categoria -> itens)
 */
function buildWhatsAppMessage({ cartItems, totals, customer, orderType, address, payment }) {
  const lines = [];
  lines.push("🍕 *Pedido - Divinittà*");
  lines.push("");
  if (customer?.trim()) lines.push(`👤 *Cliente:* ${customer.trim()}`);
  lines.push(`🛍️ *Tipo:* ${orderType === "delivery" ? "Entrega" : "Retirada"}`);
  if (orderType === "delivery" && address?.trim()) lines.push(`📍 *Endereço:* ${address.trim()}`);
  lines.push(`💳 *Pagamento:* ${payment}`);
  lines.push("");

  const byCategory = new Map();
  cartItems.forEach((it) => {
    const key = it.category || "Itens";
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(it);
  });

  lines.push("🍽️ *Itens:*");
  for (const [cat, items] of byCategory.entries()) {
    lines.push(`\n*${cat}*`);
    items.forEach((it) => {
      lines.push(`- ${it.qty}x ${it.name} — ${formatBRL(it.unitPrice * it.qty)}`);
      if (it.selected?.length) {
        it.selected.forEach((g) => {
          const names = g.options.map((o) => o.name).join(", ");
          lines.push(`  • ${g.groupName}: ${names}`);
        });
      }
      if (it.note?.trim()) lines.push(`  • Obs: ${it.note.trim()}`);
    });
  }

  lines.push("");
  lines.push(`🧮 *Total:* ${formatBRL(totals.total)}`);
  lines.push("");
  lines.push("✅ Pode confirmar, por favor?");
  return lines.join("\n");
}

/**
 * Modal do produto (estilo Neemo):
 * - descrição
 * - grupos de opções (obrigatório/opcional, single/multi)
 * - validações
 * - preço em tempo real
 */
function ProductModal({ open, product, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState([]); // [{groupId, groupName, options:[{id,name,price}]}]
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !product) return;
    setQty(1);
    setNote("");
    setError("");

    // padrão: para grupos single obrigatórios, já selecionar a 1ª opção
    const initial = (product.optionGroups || []).map((g) => {
      if (g.type === "single" && g.required && g.options?.length) {
        return { groupId: g.id, groupName: g.name, options: [g.options[0]] };
      }
      return { groupId: g.id, groupName: g.name, options: [] };
    });
    setSelected(initial);
  }, [open, product?.id]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const groups = product?.optionGroups || [];


  function setSingle(group, option) {
    setSelected((prev) =>
      prev.map((s) =>
        s.groupId === group.id ? { ...s, groupName: group.name, options: [option] } : s
      )
    );
  }

  function toggleMulti(group, option) {
    setSelected((prev) =>
      prev.map((s) => {
        if (s.groupId !== group.id) return s;
        const exists = s.options.some((o) => o.id === option.id);
        let next = exists ? s.options.filter((o) => o.id !== option.id) : [...s.options, option];
        const max = group.max ?? 999;

        // limita seleções
        if (!exists && next.length > max) next = next.slice(0, max);

        return { ...s, groupName: group.name, options: next };
      })
    );
  }

  function validate() {
    for (const g of groups) {
      const s = selected.find((x) => x.groupId === g.id);
      const count = s?.options?.length ?? 0;
      const min = g.required ? (g.min ?? 1) : (g.min ?? 0);
      const max = g.max ?? (g.type === "single" ? 1 : 999);

      if (count < min) {
        return `Selecione ${min === 1 ? "uma opção" : `no mínimo ${min} opções`} em: ${g.name}`;
      }
      if (count > max) {
        return `Você selecionou mais opções do que o permitido em: ${g.name}`;
      }
    }
    return "";
  }

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    return computeUnitPrice(product, selected);
  }, [product, selected]);

  const totalPrice = unitPrice * qty;

  function handleAdd() {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError("");

    const cleanSelected = selected
      .filter((s) => s.options?.length)
      .map((s) => ({ ...s }));

    onAdd?.({
      productId: product.id,
      name: product.name,
      category: product.category,
      qty,
      note,
      selected: cleanSelected,
      unitPrice,
      image: product.image,
    });
    onClose?.();
  }

  if (!open || !product) return null;

  return (
    <div className="modalRoot" role="dialog" aria-modal="true">
      <button className="modalBackdrop" onClick={onClose} aria-label="Fechar fundo" />
      <div className="modalSheet">
        <div className="modalHeader">
          <div className="modalTitleWrap">
            <div className="modalTitle">{product.name}</div>
            {product.desc ? <div className="modalDesc">{product.desc}</div> : null}
          </div>
          <button className="iconBtn" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        {/* grupos de opções */}
        <div className="modalBody">
          {groups.map((g) => {
            const s = selected.find((x) => x.groupId === g.id);
            const picked = new Set((s?.options || []).map((o) => o.id));
            const max = g.max ?? (g.type === "single" ? 1 : 999);

            return (
              <div key={g.id} className="optGroup">
                <div className="optHeader">
                  <div className="optName">
                    {g.name}{" "}
                    {g.required ? <span className="badgeReq">Obrigatório</span> : <span className="badgeOpt">Opcional</span>}
                  </div>
                  {g.type === "multi" ? <div className="optHint">Até {max}</div> : null}
                </div>

                <div className="optGrid">
                  {g.options.map((o) => {
                    const active = picked.has(o.id);
                    const priceTxt = o.price ? `+ ${formatBRL(o.price)}` : "Grátis";
                    return (
                      <button
                        key={o.id}
                        type="button"
                        className={`optBtn ${active ? "optBtnActive" : ""}`}
                        onClick={() => (g.type === "single" ? setSingle(g, o) : toggleMulti(g, o))}
                      >
                        <div className="optLeft">
                          <div className="optLabel">{o.name}</div>
                          <div className="optPrice">{g.type === "single" && g.required ? formatBRL(o.price) : priceTxt}</div>
                        </div>
                        <div className={`optMark hookup ${active ? "optMarkOn" : ""}`}>{active ? "✓" : ""}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="optGroup">
            <div className="optHeader">
              <div className="optName">Observação</div>
              <div className="optHint">Ex: sem cebola</div>
            </div>
            <textarea
              className="textarea"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Escreva aqui..."
            />
          </div>

          <div className="qtyRow">
            <div className="qtyLabel">Quantidade</div>
            <div className="qtyCtrls">
              <button className="qtyBtn" onClick={() => setQty((q) => clamp(q - 1, 1, 99))} type="button">
                −
              </button>
              <div className="qtyVal">{qty}</div>
              <button className="qtyBtn" onClick={() => setQty((q) => clamp(q + 1, 1, 99))} type="button">
                +
              </button>
            </div>
          </div>

          {error ? <div className="errorBox">⚠️ {error}</div> : null}
        </div>

        <div className="modalFooter">
          <div className="totalBox">
            <div className="totalLabel">Total</div>
            <div className="totalValue">{formatBRL(totalPrice)}</div>
          </div>
          <button className="ctaBtn" onClick={handleAdd} type="button">
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const isAdmin = useMemo(() => getIsAdmin(), []);
  const [menuData, setMenuData] = useState(() => applyPromoOverrides(BASE_MENU));

  const categories = useMemo(() => menuData.map((c) => c.category), [menuData]);
  const [activeCategory, setActiveCategory] = useState(categories[0] || "");
  const [query, setQuery] = useState("");

  // Carrinho como Map (chave composta)
  const [cart, setCart] = useState(new Map());

  // Checkout
  const [customer, setCustomer] = useState("");
  const [orderType, setOrderType] = useState("delivery");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Pix");

  // UI carrinho em modal + pulse ao adicionar
  const [cartOpen, setCartOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const pulseTimerRef = useRef(null);

  // Modal do produto
  const [productOpen, setProductOpen] = useState(null);

  const sectionRefs = useRef(new Map());

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, []);

  // Scroll spy: observa seções para marcar a categoria ativa
  useEffect(() => {
    const refs = Array.from(sectionRefs.current.values()).filter(Boolean);
    if (!refs.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // pega a entrada mais visível
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const cat = visible.target.getAttribute("data-category");
        if (cat) setActiveCategory(cat);
      },
      { root: null, threshold: [0.2, 0.4, 0.6] }
    );

    refs.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const flatItems = useMemo(() => {
    const all = [];
    menuData.forEach((c) => c.items.forEach((i) => all.push(i)));
    return all;
  }, [menuData]);

  const filteredByQuery = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return flatItems.filter((i) => (i.name + " " + (i.desc || "")).toLowerCase().includes(q));
  }, [query, flatItems]);

  // Se o menu mudar (admin editou promo), garante categoria ativa válida
  useEffect(() => {
    if (!activeCategory || !categories.includes(activeCategory)) {
      setActiveCategory(categories[0] || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.join("|")]);

  function getStartingPrice(item) {
    const sizeGroup = item.optionGroups?.find((g) => g.id === "size");
    const prices = (sizeGroup?.options || [])
      .map((o) => (typeof o.price === "number" ? o.price : null))
      .filter((n) => n != null);
    if (prices.length) return Math.min(...prices);
    return typeof item.price === "number" ? item.price : 0;
  }

  // Admin modal (editar Promoção)
  const [adminOpen, setAdminOpen] = useState(false);
  const promoCategory = useMemo(() => menuData.find((c) => c.category === "Promoção"), [menuData]);
  const [promoDraft, setPromoDraft] = useState(() => JSON.stringify(promoCategory?.items || [], null, 2));
  useEffect(() => {
    setPromoDraft(JSON.stringify(promoCategory?.items || [], null, 2));
  }, [promoCategory]);

  function savePromos() {
    const parsed = JSON.parse(promoDraft);
    if (!Array.isArray(parsed)) throw new Error("Promoções precisa ser uma lista (array)");
    // normaliza
    const normalized = parsed.map((it, idx) => ({
      id: String(it.id ?? `promo_${idx + 1}`),
      name: String(it.name ?? "(Sem nome)"),
      desc: String(it.desc ?? ""),
      price: Number(it.price ?? 0),
      image: String(it.image ?? "/images/divinitta/placeholder.webp"),
      optionGroups: Array.isArray(it.optionGroups) ? it.optionGroups : [],
    }));
    localStorage.setItem(LS_PROMOS_KEY, JSON.stringify(normalized));
    setMenuData(applyPromoOverrides(BASE_MENU));
    setAdminOpen(false);
  }

  const cartItems = useMemo(() => Array.from(cart.values()), [cart]);

  const totals = useMemo(() => {
    const total = cartItems.reduce((acc, it) => acc + it.unitPrice * it.qty, 0);
    const qty = cartItems.reduce((acc, it) => acc + it.qty, 0);
    return { total, qty };
  }, [cartItems]);

  function addToCart(payload) {
    // payload: {productId, name, category, qty, note, selected, unitPrice}
    const key = buildCartKey({ productId: payload.productId, selected: payload.selected || [], note: payload.note });

    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(key);
      if (existing) next.set(key, { ...existing, qty: existing.qty + payload.qty });
      else next.set(key, { key, ...payload });
      return next;
    });

    setCartPulse(true);
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = setTimeout(() => setCartPulse(false), 650);
  }

  function decFromCart(key) {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(key);
      if (!existing) return next;

      const qty = existing.qty - 1;
      if (qty <= 0) next.delete(key);
      else next.set(key, { ...existing, qty });
      return next;
    });
  }

  function incFromCart(key) {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(key);
      if (!existing) return next;
      next.set(key, { ...existing, qty: existing.qty + 1 });
      return next;
    });
  }

  function removeFromCart(key) {
    setCart((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }

  function clearCart() {
    setCart(new Map());
  }

  function sendToWhatsApp() {
    if (cartItems.length === 0) return;

    const msg = buildWhatsAppMessage({
      cartItems,
      totals,
      customer,
      orderType,
      address,
      payment,
    });

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function scrollToCategory(cat) {
    const el = sectionRefs.current.get(cat);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const cartContent = (
    <>
      <div className="cartHeader">
        <div>
          <div className="cartTitle">Seu carrinho</div>
          <div className="cartSub">{totals.qty} itens • {formatBRL(totals.total)}</div>
        </div>
        <button className="ghostBtn" onClick={clearCart} type="button" disabled={cartItems.length === 0}>
          Limpar
        </button>
      </div>

      <div className="cartList">
        {cartItems.length === 0 ? (
          <div className="empty">Sua cesta ainda está vazia</div>
        ) : (
          cartItems.map((it) => (
            <div key={it.key} className="cartItem">
              <div className="cartItemMain">
                <div className="cartItemName">{it.name}</div>
                {it.selected?.length ? (
                  <div className="cartItemOpts">
                    {it.selected.map((g) => (
                      <div key={g.groupId} className="cartOptLine">
                        <span className="cartOptGroup">{g.groupName}:</span>{" "}
                        <span className="cartOptVal">{g.options.map((o) => o.name).join(", ")}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {it.note?.trim() ? <div className="cartItemNote">Obs: {it.note.trim()}</div> : null}
                <div className="cartItemPrice">{formatBRL(it.unitPrice)} • unitário</div>
              </div>

              <div className="cartItemCtrls">
                <button className="qtyBtnSmall" onClick={() => decFromCart(it.key)} type="button">−</button>
                <div className="qtySmall">{it.qty}</div>
                <button className="qtyBtnSmall" onClick={() => incFromCart(it.key)} type="button">+</button>
                <button className="trashBtn" onClick={() => removeFromCart(it.key)} type="button" aria-label="Remover">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="checkout">
        <div className="label">Seu nome</div>
        <input className="input" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Ex: Carlos" />

        <div className="grid2">
          <div>
            <div className="label">Entrega ou retirada</div>
            <div className="seg">
              <button className={`segBtn ${orderType === "delivery" ? "segActive" : ""}`} onClick={() => setOrderType("delivery")} type="button">
                Entrega
              </button>
              <button className={`segBtn ${orderType === "pickup" ? "segActive" : ""}`} onClick={() => setOrderType("pickup")} type="button">
                Retirada
              </button>
            </div>
          </div>

          {orderType === "delivery" ? (
            <div>
              <div className="label">Endereço</div>
              <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, bairro..." />
            </div>
          ) : (
            <div>
              <div className="label">Pagamento</div>
              <select className="input" value={payment} onChange={(e) => setPayment(e.target.value)}>
                <option>Pix</option>
                <option>Cartão</option>
                <option>Dinheiro</option>
              </select>
            </div>
          )}
        </div>

        {orderType === "delivery" ? (
          <div>
            <div className="label">Pagamento</div>
            <select className="input" value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option>Pix</option>
              <option>Cartão</option>
              <option>Dinheiro</option>
            </select>
          </div>
        ) : null}

        <button className="sendBtn" onClick={sendToWhatsApp} type="button" disabled={cartItems.length === 0}>
          Finalizar no WhatsApp
        </button>
        <div className="fineprint">O pedido vai organizado e pronto para enviar.</div>
      </div>
    </>
  );

  return (
    <div className="app">
      {/* HEADER */}
      <header className="topbar">
        <div className="brand">
          <img className="brandLogo" src={logo} alt="Divinittà Pizza" />
          <div className="brandText">
            <div className="brandName">Divinittà</div>
            <div className="brandTag">Pizza pré-assada • Pedido rápido no WhatsApp</div>
          </div>
        </div>

        <div className="searchRow">
          <input className="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar produto..." />
          {isAdmin ? (
            <button className="ghostBtn" type="button" onClick={() => setAdminOpen(true)} title="Editar promoções">
              ✏️ Editar
            </button>
          ) : null}
          <button className="whatsBadge" type="button" onClick={() => setCartOpen(true)}>
            🛒 {totals.qty}
          </button>
        </div>
      </header>

      {/* CATEGORIAS STICKY */}
      <nav className="catbar" aria-label="Categorias">
        <div className="catScroll">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? "chipActive" : ""}`}
              onClick={() => scrollToCategory(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main className="content">
        {/* BUSCA: mostra resultados sem categorias */}
        {filteredByQuery ? (
          <section className="section">
            <h2 className="sectionTitle">Resultados</h2>
            <div className="gridCards">
              {filteredByQuery.map((item) => (
                <button key={item.id} className="card" type="button" onClick={() => setProductOpen(item)}>
                  <img className="cardImg" src={item.image} alt="" loading="lazy" />
                  <div className="cardBody">
                    <div className="cardTop">
                      <div className="cardName">{item.name}</div>
                      <div className="price">
                        {item.optionGroups?.some((g) => g.id === "size")
                          ? "A partir de " + formatBRL(getStartingPrice(item))
                          : formatBRL(item.price)}
                      </div>
                    </div>
                    {item.desc ? <div className="cardDesc">{item.desc}</div> : <div className="cardDesc muted">Toque para ver opções</div>}
                    <div className="cardCta">Ver opções</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <>
            {menuData.map((cat) => (
              <section
                key={cat.category}
                className="section"
                data-category={cat.category}
                ref={(el) => sectionRefs.current.set(cat.category, el)}
              >
                <h2 className="sectionTitle">{cat.category}</h2>
                <div className="gridCards">
                  {cat.items.map((item) => (
                    <button key={item.id} className="card" type="button" onClick={() => setProductOpen(item)}>
                      <img className="cardImg" src={item.image} alt="" loading="lazy" />
                      <div className="cardBody">
                        <div className="cardTop">
                          <div className="cardName">{item.name}</div>
                          <div className="price">
                            {item.optionGroups?.some((g) => g.id === "size")
                              ? "A partir de " + formatBRL(getStartingPrice(item))
                              : formatBRL(getStartingPrice(item))}
                          </div>
                        </div>
                        {item.desc ? <div className="cardDesc">{item.desc}</div> : <div className="cardDesc muted">Toque para ver opções</div>}
                        <div className="cardCta">Ver opções</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        {/* CARRINHO (desktop) */}
        <aside className="cartDesktop">{cartContent}</aside>
      </main>

      {/* BOTÃO FLUTUANTE (mobile) */}
      <button
        className={`cartFab ${cartPulse ? "cartFabPulse" : ""}`}
        onClick={() => setCartOpen(true)}
        type="button"
        aria-label="Abrir carrinho"
      >
        <span className="cartFabText">
  {totals.qty > 0 ? (
    <>
      <span className="cartFabQty">{totals.qty} itens</span>
      <span className="cartFabTotal">{formatBRL(totals.total)}</span>
    </>
  ) : (
    <span className="cartFabTotal">Ver carrinho</span>
  )}
</span>

      </button>

      {/* MODAL DO CARRINHO (mobile) */}
      {cartOpen && (
        <div className="cartModalRoot">
          <div className="cartModalSheet">
            <div className="cartModalTop">
              <div>
                <div className="cartTitle">Seu carrinho</div>
                <div className="cartSub">{totals.qty} itens • {formatBRL(totals.total)}</div>
              </div>
              <button className="iconBtn" onClick={() => setCartOpen(false)} type="button" aria-label="Fechar">
                ✕
              </button>
            </div>
            <div className="cartModalBody">{cartContent}</div>
          </div>
          <button className="modalBackdrop" onClick={() => setCartOpen(false)} type="button" aria-label="Fechar fundo" />
        </div>
      )}

      {/* MODAL DO PRODUTO */}
      <ProductModal
        open={!!productOpen}
        product={productOpen}
        onClose={() => setProductOpen(null)}
        onAdd={(payload) => addToCart(payload)}
      />

      {/* ADMIN: editar promoções (somente quando abrir com ?admin=1) */}
      {isAdmin && adminOpen ? (
        <div className="cartModalRoot">
          <div className="cartModalSheet">
            <div className="cartModalTop">
              <div>
                <div className="cartTitle">Editar promoções</div>
                <div className="cartSub">Cole/edite a lista em JSON e salve. (Fica salvo neste dispositivo)</div>
              </div>
              <button className="iconBtn" onClick={() => setAdminOpen(false)} type="button" aria-label="Fechar">
                ✕
              </button>
            </div>
            <div className="cartModalBody">
              <div className="label">Promoções (JSON)</div>
              <textarea
                className="textarea"
                rows={16}
                value={promoDraft}
                onChange={(e) => setPromoDraft(e.target.value)}
                spellCheck={false}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button className="ghostBtn" type="button" onClick={() => setPromoDraft(JSON.stringify(promoCategory?.items || [], null, 2))}>
                  Restaurar
                </button>
                <button
                  className="sendBtn"
                  type="button"
                  onClick={() => {
                    try {
                      savePromos();
                    } catch (e) {
                      alert(e?.message || "Erro ao salvar");
                    }
                  }}
                >
                  Salvar
                </button>
              </div>
              <div className="fineprint" style={{ marginTop: 10 }}>
                Dica: para acessar este painel, abra o link com <b>?admin=1</b> no final.
              </div>
            </div>
          </div>
          <button className="modalBackdrop" onClick={() => setAdminOpen(false)} type="button" aria-label="Fechar fundo" />
        </div>
      ) : null}
    </div>
  );
}
