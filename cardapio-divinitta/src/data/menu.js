export const WHATSAPP_NUMBER = "5516997135732";

export const menu = [
  {
    category: "Promoção",
    items: [
      {
        id: "calabresa",
        name: "Pizza Calabresa",
        desc: "Molho de tomate, mussarela e calabresa.",
        price: 35,
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
              { id: "broto", name: "Broto (20cm)", price: 35 },
              { id: "grande", name: "Grande (30cm)", price: 47 }
            ]
          },
          {
            id: "extras",
            name: "Adicionais",
            type: "multi",
            required: false,
            min: 0,
            max: 3,
            options: [
              { id: "cebola", name: "Cebola (cortesia)", price: 0 },
              { id: "catupiry", name: "Catupiry (cortesia)", price: 0 },
              { id: "bacon", name: "Bacon", price: 6 }
            ]
          },
          {
            id: "massa",
            name: "Opcionais (no lugar da borda)",
            type: "single",
            required: true,
            min: 1,
            max: 1,
            options: [
              { id: "tradicional", name: "Massa tradicional", price: 0 },
              { id: "integral", name: "Massa integral", price: 2 }
            ]
          }
        ]
      }
    ]
  },

  {
    category: "Pizzas Especiais",
    items: [
      {
        id: "pizza_2_sabores",
        name: "Pizza 2 Sabores",
        desc: "Escolha o tamanho e até 2 sabores.",
        price: 0,
        image: "/images/divinitta/pizza-2-sabores.webp",
        optionGroups: [
          {
            id: "size",
            name: "Tamanho",
            type: "single",
            required: true,
            min: 1,
            max: 1,
            options: [
              { id: "broto", name: "Broto (20cm)", price: 35 },
              { id: "grande", name: "Grande (30cm)", price: 47 }
            ]
          },
          {
            id: "sabores",
            name: "Escolha até 2 sabores",
            type: "multi",
            required: true,
            min: 1,
            max: 2,
            options: [
              { id: "calabresa", name: "Calabresa", price: 0 },
              { id: "frango", name: "Frango com Catupiry", price: 0 },
              { id: "marguerita", name: "Marguerita", price: 0 },
              { id: "portuguesa", name: "Portuguesa", price: 0 }
            ]
          }
        ]
      }
    ]
  }
];
