# CakeCup - Loja de Cupcakes

## 📝 Descrição
CakeCup é uma aplicação web moderna para uma loja de cupcakes artesanais, desenvolvida com Nuxt 3 e TypeScript. A plataforma oferece uma experiência de compra intuitiva e agradável para os amantes de doces.

## 🚀 Funcionalidades
- Catálogo de produtos com filtros
- Carrinho de compras interativo
- Sistema de pedidos
- Interface responsiva
- Gerenciamento de estado com Pinia
- Navegação fluida entre páginas

## 🛠 Tecnologias Utilizadas
- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)
- [SCSS](https://sass-lang.com/)
- [Font Awesome](https://fontawesome.com/)

## 📋 Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/cakecup.git
cd cakecup
```

2. Instale as dependências
```bash
npm install
```
ou
```bash
yarn install
```

3. Execute o projeto em modo de desenvolvimento
```bash
npm run dev
```
ou
```bash
yarn dev
```

4. Para build de produção
```bash
npm run build
```
ou
```bash
yarn build
```

## 📁 Estrutura do Projeto
cakecup/
├── assets/
│ ├── css/
│ └── images/
├── components/
│ ├── cart/
│ ├── layout/
│ └── home/
├── composables/
├── layouts/
├── pages/
├── plugins/
├── public/
├── stores/
└── types/

## 🔍 Componentes Principais

### Layouts
- `default.vue` - Layout padrão da aplicação

### Páginas
- `/` - Página inicial
- `/products` - Catálogo de produtos
- `/about` - Sobre nós
- `/contact` - Contato

### Componentes
- `TheHeader.vue` - Cabeçalho da aplicação
- `CartModal.vue` - Modal do carrinho de compras
- `ProductCard.vue` - Card de produto
- `HeroSection.vue` - Seção principal da página inicial

### Stores
- `cart.ts` - Gerenciamento do estado do carrinho
- `products.ts` - Gerenciamento dos produtos

## 🔐 Variáveis de Ambiente
```bash
env
NUXT_PUBLIC_API_BASE=http://localhost:3000
```

## 📱 Responsividade
A aplicação é totalmente responsiva e se adapta aos seguintes breakpoints:
- Mobile: até 768px
- Tablet: até 1024px
- Desktop: 1024px ou superior

## 🎨 Estilos
O projeto utiliza SCSS para estilização, com variáveis globais definidas em:
```bash
assets/css/variables.scss
```

## 🤝 Contribuindo
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Autor
Tiago Gois - [GitHub](https://github.com/tiagogois)

---
⌨️ com ❤️ por [Tiago Gois](https://github.com/tiagogois)