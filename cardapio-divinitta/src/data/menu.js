// Menu do Divinitta Pizza (prévia premium para demonstração)
// Estrutura preparada para opcionais/acréscimos (estilo Neemo)
// Você pode editar os grupos de opções em src/data/menu.js

export const WHATSAPP_NUMBER = "5516997135732"; // Carlos - Divinitta Pizza

export const menu = [
  {
    "category": "Promoção",
    "items": [
      {
        "id": "2747621",
        "name": "Stranger Pizza",
        "desc": "Mussarela, molho especial e toque de orégano.",
        "price": 35.0,
        "image": "/images/divinitta/stranger-pizza.webp",
        "optionGroups": [
          {
            "id": "size",
            "name": "Tamanho",
            "type": "single",
            "required": true,
            "min": 1,
            "max": 1,
            "options": [
              {
                "id": "broto",
                "name": "Broto (20cm)",
                "price": 35.0
              },
              {
                "id": "grande",
                "name": "Grande (30cm)",
                "price": 47.0
              }
            ]
          },
          {
            "id": "extras",
            "name": "Adicionais",
            "type": "multi",
            "required": false,
            "min": 0,
            "max": 3,
            "options": [
              {
                "id": "bacon",
                "name": "Bacon",
                "price": 6.0
              },
              {
                "id": "catupiry",
                "name": "Catupiry",
                "price": 7.0
              },
              {
                "id": "cheddar",
                "name": "Cheddar",
                "price": 6.0
              },
              {
                "id": "azeitona",
                "name": "Azeitona",
                "price": 3.0
              }
            ]
          },
          {
            "id": "borda",
            "name": "Borda Recheada",
            "type": "single",
            "required": false,
            "min": 0,
            "max": 1,
            "options": [
              {
                "id": "sem",
                "name": "Sem borda",
                "price": 0.0
              },
              {
                "id": "catupiry",
                "name": "Catupiry",
                "price": 8.0
              },
              {
                "id": "cheddar",
                "name": "Cheddar",
                "price": 8.0
              }
            ]
          }
        ]
      },
      {
        "id": "915034",
        "name": "Pizza Calabresa",
        "desc": "Molho de tomate, mussarela e calabresa.",
        "price": 35.0,
        "image": "/images/divinitta/calabresa.webp",
        "optionGroups": [
          {
            "id": "size",
            "name": "Tamanho",
            "type": "single",
            "required": true,
            "min": 1,
            "max": 1,
            "options": [
              {
                "id": "broto",
                "name": "Broto (20cm)",
                "price": 35.0
              },
              {
                "id": "grande",
                "name": "Grande (30cm)",
                "price": 47.0
              }
            ]
          },
          {
            "id": "extras",
            "name": "Adicionais",
            "type": "multi",
            "required": false,
            "min": 0,
            "max": 3,
            "options": [
              {
                "id": "cebola",
                "name": "Cebola extra",
                "price": 2.0
              },
              {
                "id": "bacon",
                "name": "Bacon",
                "price": 6.0
              },
              {
                "id": "catupiry",
                "name": "Catupiry",
                "price": 7.0
              }
            ]
          }
        ]
      },
      {
        "id": "673750",
        "name": "Pizza Chocolate Preto",
        "desc": "Chocolate ao leite e finalização especial.",
        "price": 35.0,
        "image": "/images/divinitta/chocolate-preto.webp",
        "optionGroups": [
          {
            "id": "size",
            "name": "Tamanho",
            "type": "single",
            "required": true,
            "min": 1,
            "max": 1,
            "options": [
              {
                "id": "broto",
                "name": "Broto (20cm)",
                "price": 35.0
              },
              {
                "id": "grande",
                "name": "Grande (30cm)",
                "price": 47.0
              }
            ]
          },
          {
            "id": "extras",
            "name": "Adicionais",
            "type": "multi",
            "required": false,
            "min": 0,
            "max": 2,
            "options": [
              {
                "id": "morango",
                "name": "Morango",
                "price": 6.0
              },
              {
                "id": "granulado",
                "name": "Granulado",
                "price": 3.0
              },
              {
                "id": "leite_ninho",
                "name": "Leite Ninho",
                "price": 6.0
              }
            ]
          }
        ]
      },
      {
        "id": "1012399",
        "name": "Pizza Veg Caipira",
        "desc": "Base veg, legumes e temperos.",
        "price": 50.0,
        "image": "/images/divinitta/veg-caipira.webp",
        "optionGroups": [
          {
            "id": "size",
            "name": "Tamanho",
            "type": "single",
            "required": true,
            "min": 1,
            "max": 1,
            "options": [
              {
                "id": "broto",
                "name": "Broto (20cm)",
                "price": 50.0
              },
              {
                "id": "grande",
                "name": "Grande (30cm)",
                "price": 62.0
              }
            ]
          },
          {
            "id": "extras",
            "name": "Adicionais",
            "type": "multi",
            "required": false,
            "min": 0,
            "max": 3,
            "options": [
              {
                "id": "azeitona",
                "name": "Azeitona",
                "price": 3.0
              },
              {
                "id": "milho",
                "name": "Milho",
                "price": 3.0
              },
              {
                "id": "pimenta",
                "name": "Pimenta",
                "price": 0.0
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "category": "Massas",
    "items": [
      {
        "id": "2456428",
        "name": "Molhos",
        "desc": "Escolha seu molho para acompanhar.",
        "price": 12.0,
        "image": "/images/divinitta/molhos.webp",
        "optionGroups": [
          {
            "id": "molho",
            "name": "Tipo de molho",
            "type": "single",
            "required": true,
            "min": 1,
            "max": 1,
            "options": [
              {
                "id": "sugo",
                "name": "Sugo",
                "price": 12.0
              },
              {
                "id": "bolonhesa",
                "name": "Bolonhesa",
                "price": 14.0
              },
              {
                "id": "branco",
                "name": "Molho Branco",
                "price": 14.0
              }
            ]
          }
        ]
      },
      {
        "id": "2053605",
        "name": "Massas Sem Molho",
        "desc": "Massa artesanal (sem molho).",
        "price": 24.0,
        "image": "/images/divinitta/massa-sem-molho.webp",
        "optionGroups": [
          {
            "id": "massa",
            "name": "Tipo de massa",
            "type": "single",
            "required": true,
            "min": 1,
            "max": 1,
            "options": [
              {
                "id": "penne",
                "name": "Penne",
                "price": 24.0
              },
              {
                "id": "espaguete",
                "name": "Espaguete",
                "price": 24.0
              },
              {
                "id": "fettuccine",
                "name": "Fettuccine",
                "price": 26.0
              }
            ]
          },
          {
            "id": "extras",
            "name": "Adicionais",
            "type": "multi",
            "required": false,
            "min": 0,
            "max": 2,
            "options": [
              {
                "id": "queijo",
                "name": "Queijo extra",
                "price": 4.0
              },
              {
                "id": "bacon",
                "name": "Bacon",
                "price": 6.0
              }
            ]
          }
        ]
      },
      {
        "id": "1601798",
        "name": "Rondele / Canelone / Nhoque",
        "desc": "Massas recheadas e especiais.",
        "price": 32.0,
        "image": "/images/divinitta/massa-sem-molho.webp",
        "optionGroups": [
          {
            "id": "tipo",
            "name": "Escolha 1 opção",
            "type": "single",
            "required": true,
            "min": 1,
            "max": 1,
            "options": [
              {
                "id": "rondele",
                "name": "Rondele",
                "price": 32.0
              },
              {
                "id": "canelone",
                "name": "Canelone",
                "price": 34.0
              },
              {
                "id": "nhoque",
                "name": "Nhoque",
                "price": 32.0
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "category": "Caldos",
    "items": [
      {
        "id": "2749982",
        "name": "CALDO VERDE 600g",
        "desc": "Caldo verde cremoso, servido quente.",
        "price": 27.0,
        "image": "/images/divinitta/caldo-verde.webp",
        "optionGroups": [
          {
            "id": "extras",
            "name": "Acréscimos",
            "type": "multi",
            "required": false,
            "min": 0,
            "max": 3,
            "options": [
              {
                "id": "queijo",
                "name": "Queijo ralado",
                "price": 3.0
              },
              {
                "id": "bacon",
                "name": "Bacon",
                "price": 5.0
              },
              {
                "id": "pao",
                "name": "Pão",
                "price": 2.0
              }
            ]
          }
        ]
      },
      {
        "id": "1962388",
        "name": "CALDO DE CAMARÃO 600g",
        "desc": "Caldo cremoso com camarão.",
        "price": 34.0,
        "image": "/images/divinitta/caldo-camarao.webp",
        "optionGroups": [
          {
            "id": "extras",
            "name": "Acréscimos",
            "type": "multi",
            "required": false,
            "min": 0,
            "max": 2,
            "options": [
              {
                "id": "pao",
                "name": "Pão",
                "price": 2.0
              },
              {
                "id": "pimenta",
                "name": "Pimenta",
                "price": 0.0
              }
            ]
          }
        ]
      },
      {
        "id": "1962387",
        "name": "CALDO DE ERVILHA 600g",
        "desc": "Caldo de ervilha encorpado.",
        "price": 27.0,
        "image": "/images/divinitta/caldo-ervilha.webp",
        "optionGroups": [
          {
            "id": "extras",
            "name": "Acréscimos",
            "type": "multi",
            "required": false,
            "min": 0,
            "max": 3,
            "options": [
              {
                "id": "bacon",
                "name": "Bacon",
                "price": 5.0
              },
              {
                "id": "pao",
                "name": "Pão",
                "price": 2.0
              },
              {
                "id": "cheiro",
                "name": "Cheiro-verde",
                "price": 0.0
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "category": "Bebidas",
    "items": [
      {
        "id": "379801",
        "name": "Refrigerantes",
        "desc": "Lata 350ml (sabores disponíveis).",
        "price": 6.0,
        "image": "/images/divinitta/refri-350ml.webp",
        "optionGroups": [
          {
            "id": "sabor",
            "name": "Escolha o sabor",
            "type": "single",
            "required": true,
            "min": 1,
            "max": 1,
            "options": [
              {
                "id": "coca",
                "name": "Coca-Cola",
                "price": 6.0
              },
              {
                "id": "guarana",
                "name": "Guaraná",
                "price": 6.0
              },
              {
                "id": "fanta",
                "name": "Fanta",
                "price": 6.0
              }
            ]
          }
        ]
      },
      {
        "id": "379798",
        "name": "Água",
        "desc": "Com ou sem gás.",
        "price": 4.0,
        "image": "/images/divinitta/agua.webp",
        "optionGroups": [
          {
            "id": "tipo",
            "name": "Tipo",
            "type": "single",
            "required": true,
            "min": 1,
            "max": 1,
            "options": [
              {
                "id": "sem_gas",
                "name": "Sem gás",
                "price": 4.0
              },
              {
                "id": "com_gas",
                "name": "Com gás",
                "price": 4.5
              }
            ]
          }
        ]
      },
      {
        "id": "379799",
        "name": "Refrigerantes Pet",
        "desc": "Garrafa PET (consultar tamanho).",
        "price": 10.0,
        "image": "/images/divinitta/refri-2litros.webp"
      }
    ]
  },
  {
    "category": "Tamanhos de Pizza",
    "items": [
      {
        "id": "10546",
        "name": "Broto (20cm)",
        "desc": "Tamanho broto.",
        "price": 32.0,
        "image": "/images/divinitta/pizza-broto.webp"
      },
      {
        "id": "10550",
        "name": "Grande (30cm)",
        "desc": "Tamanho grande.",
        "price": 44.0,
        "image": "/images/divinitta/pizza-grande.webp"
      }
    ]
  }
];
