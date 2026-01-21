// Menu do Divinittà Pizza
// Obs: este arquivo é JS (não JSON). Então precisa respeitar vírgulas/chaves.

export const WHATSAPP_NUMBER = "5516997135732"; // Carlos - Divinittà Pizza

// Helper para evitar repetir "category" em cada item
const withCategory = (category, items) => items.map((it) => ({ ...it, category }));

export const menu = [
  {
    category: "Promoção",
    items: withCategory("Promoção", [
      {
        id: "2747621",
        name: "Stranger Pizza",
        desc: "Mussarela, molho especial e toque de orégano.",
        price: 35.0,
        image: "https://cdn.neemo.com.br/uploads/item/photo/2747621/STRANGER_PIZZA.webp",
        optionGroups: [
          {
            id: "size",
            name: "Tamanho",
            type: "single",
            required: true,
            min: 1,
            max: 1,
            options: [
              { id: "broto", name: "Broto (20cm)", price: 35.0 },
              { id: "grande", name: "Grande (30cm)", price: 47.0 },
            ],
          },
          {
            id: "extras",
            name: "Adicionais",
            type: "multi",
            required: false,
            min: 0,
            max: 3,
            options: [
              { id: "bacon", name: "Bacon", price: 6.0 },
              { id: "catupiry", name: "Catupiry", price: 7.0 },
              { id: "cheddar", name: "Cheddar", price: 6.0 },
              { id: "azeitona", name: "Azeitona", price: 3.0 },
            ],
          },
          {
            id: "borda",
            name: "Borda Recheada",
            type: "single",
            required: false,
            min: 0,
            max: 1,
            options: [
              { id: "sem", name: "Sem borda", price: 0.0 },
              { id: "catupiry", name: "Catupiry", price: 8.0 },
              { id: "cheddar", name: "Cheddar", price: 8.0 },
            ],
          },
        ],
      },
      {
        id: "673750",
        name: "Pizza Chocolate Preto",
        desc: "Chocolate ao leite e finalização especial.",
        price: 35.0,
        image: "https://cdn.neemo.com.br/uploads/item/photo/673750/Choco_Preto.webp",
        optionGroups: [
          {
            id: "size",
            name: "Tamanho",
            type: "single",
            required: true,
            min: 1,
            max: 1,
            options: [
              { id: "broto", name: "Broto (20cm)", price: 35.0 },
              { id: "grande", name: "Grande (30cm)", price: 47.0 },
            ],
          },
          {
            id: "extras",
            name: "Adicionais",
            type: "multi",
            required: false,
            min: 0,
            max: 2,
            options: [
              { id: "morango", name: "Morango", price: 6.0 },
              { id: "granulado", name: "Granulado", price: 3.0 },
              { id: "leite_ninho", name: "Leite Ninho", price: 6.0 },
            ],
          },
        ],
      },
    ]),
  },

  {
    category: "Pizzas",
    items: withCategory("Pizzas", [
      {
        id: "915034",
        name: "Pizza Calabresa",
        desc: "Molho de tomate, mussarela e calabresa.",
        price: 35.0,
        image: "/images/divinitta/calabresa.webp",
        optionGroups: [
          {
            id: "size",
            name: "Tamanho",
            type: "single",
            required: true,
            min: 1,
            max: 1,
            options: [
              { id: "broto", name: "Broto (20cm)", price: 35.0 },
              { id: "grande", name: "Grande (30cm)", price: 47.0 },
            ],
          },
          {
            id: "extras",
            name: "Adicionais",
            type: "multi",
            required: false,
            min: 0,
            max: 3,
            options: [
              { id: "cebola", name: "Cebola cortesia", price: 0.0 },
              { id: "catupiry", name: "Catupiry cortesia", price: 0.0 },
              { id: "bacon", name: "Bacon", price: 6.0 },
            ],
          },
          {
            id: "massa",
            name: "Opcionais (lugar de borda)",
            type: "single",
            required: true,
            min: 1,
            max: 1,
            options: [
              { id: "tradicional", name: "Massa tradicional", price: 0.0 },
              { id: "integral", name: "Massa integral", price: 2.0 },
            ],
          },
        ],
      },

      // Pedido de teste do Carlos: pizza de 1 ou 2 sabores (para ver como fica)
      {
        id: "pizza_2_sabores",
        name: "Pizza (1 ou 2 sabores)",
        desc: "Escolha o tamanho e até 2 sabores.",
        price: 0,
        image: "/images/divinitta/placeholder.webp",
        optionGroups: [
          {
            id: "size",
            name: "Tamanho",
            type: "single",
            required: true,
            min: 1,
            max: 1,
            options: [
              { id: "broto", name: "Broto (20cm)", price: 35.0 },
              { id: "grande", name: "Grande (30cm)", price: 47.0 },
            ],
          },
          {
            id: "flavors",
            name: "Sabores (1 ou 2)",
            type: "multi",
            required: true,
            min: 1,
            max: 2,
            options: [
              { id: "calabresa", name: "Calabresa", price: 0.0 },
              { id: "stranger", name: "Stranger Pizza", price: 0.0 },
              { id: "veg_caipira", name: "Veg Caipira", price: 0.0 },
              { id: "choco_preto", name: "Chocolate Preto", price: 0.0 },
            ],
          },
          {
            id: "extras",
            name: "Adicionais",
            type: "multi",
            required: false,
            min: 0,
            max: 3,
            options: [
              { id: "bacon", name: "Bacon", price: 6.0 },
              { id: "catupiry", name: "Catupiry", price: 7.0 },
              { id: "cheddar", name: "Cheddar", price: 6.0 },
              { id: "azeitona", name: "Azeitona", price: 3.0 },
            ],
          },
        ],
      },

      {
        id: "1012399",
        name: "Pizza Veg Caipira",
        desc: "Base veg, legumes e temperos.",
        price: 50.0,
        image: "https://cdn.neemo.com.br/uploads/item/photo/1012399/caipira.webp",
        optionGroups: [
          {
            id: "size",
            name: "Tamanho",
            type: "single",
            required: true,
            min: 1,
            max: 1,
            options: [
              { id: "broto", name: "Broto (20cm)", price: 50.0 },
              { id: "grande", name: "Grande (30cm)", price: 62.0 },
            ],
          },
          {
            id: "extras",
            name: "Adicionais",
            type: "multi",
            required: false,
            min: 0,
            max: 3,
            options: [
              { id: "azeitona", name: "Azeitona", price: 3.0 },
              { id: "milho", name: "Milho", price: 3.0 },
              { id: "pimenta", name: "Pimenta", price: 0.0 },
            ],
          },
        ],
      },
    ]),
  },

  {
    category: "Tamanhos de Pizza",
    items: withCategory("Tamanhos de Pizza", [
      {
        id: "10546",
        name: "Broto (20cm)",
        desc: "Tamanho broto.",
        price: 32.0,
        image: "https://cdn.neemo.com.br/uploads/item/photo/10546/broto.webp",
      },
      {
        id: "10550",
        name: "Grande (30cm)",
        desc: "Tamanho grande.",
        price: 44.0,
        image: "https://cdn.neemo.com.br/uploads/item/photo/10550/grande.webp",
      },
    ]),
  },
];
