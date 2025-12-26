# Lanchonete Petra — Site

Site estático em **HTML + CSS + JavaScript**, nas cores **vermelho e amarelo**.

## Como usar
1. Abra o arquivo `index.html` no navegador (duplo clique).
2. Para publicar, faça upload de toda a pasta em qualquer hospedagem (ex.: Netlify, Vercel, GitHub Pages).

## Configurar WhatsApp
No arquivo `script.js`, altere:

```js
const WHATSAPP_NUMBER = "5500000000000";
```

Para o seu número no formato **DDI + DDD + número**, sem espaços.
Exemplo (SP): `5511999999999`

## Estrutura
- `index.html` — Página principal
- `style.css` — Estilos
- `script.js` — Lógica do cardápio e botões
- `assets/img/` — Logo e imagens dos produtos


## Carrinho + Checkout
O site possui carrinho. O cliente adiciona itens e finaliza no WhatsApp com o pedido + endereço.
Os campos obrigatórios são: **Nome, WhatsApp, Rua, Número e Bairro**.


## Entrega / Retirada
No carrinho, o cliente escolhe **Entrega** ou **Retirada no balcão**. Se for entrega, o endereço é obrigatório.
É possível informar **Taxa de entrega** (opcional), **Complemento** e **Observações do pedido**.
