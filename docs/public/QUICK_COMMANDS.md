# ⚡ Comandos Rápidos - CakeCup

Comandos essenciais para desenvolvimento e deploy.

---

## 🚀 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

---

## 🐳 Docker Local

```bash
# Build da imagem
docker build -t cakecup-web-app .

# Rodar container
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1 \
  -e NUXT_PUBLIC_COMPANY_ID=seu-company-id \
  cakecup-web-app

# Rodar em background
docker run -d -p 3000:3000 --name cakecup \
  -e NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1 \
  -e NUXT_PUBLIC_COMPANY_ID=seu-company-id \
  cakecup-web-app

# Ver logs
docker logs -f cakecup

# Parar container
docker stop cakecup

# Remover container
docker rm cakecup
```

---

## 🐳 Docker Compose

```bash
# Criar .env
cp .env.example .env
# Editar .env com seus valores

# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose stop

# Parar e remover
docker-compose down

# Rebuild
docker-compose up --build -d
```

---

## 📦 Git

```bash
# Status
git status

# Adicionar tudo
git add .

# Commit
git commit -m "feat: add logo and docker config"

# Push
git push origin main

# Ver histórico
git log --oneline
```

---

## 🚀 Deploy Render

### Primeira vez:

1. **Push para Git**
   ```bash
   git add .
   git commit -m "feat: add logo and docker config"
   git push origin main
   ```

2. **No Render Dashboard**
   - New + → Web Service
   - Conectar repositório
   - Runtime: **Docker**
   - Dockerfile Path: `Dockerfile`
   - Adicionar variáveis:
     - `NUXT_PUBLIC_API_BASE`
     - `NUXT_PUBLIC_COMPANY_ID`
   - Create Web Service

### Atualizações:

```bash
# Fazer mudanças no código
git add .
git commit -m "feat: sua mensagem"
git push

# Render faz deploy automático!
```

---

## 🔍 Verificações

```bash
# Verificar porta 3000
netstat -an | grep 3000  # Linux/Mac
netstat -ano | findstr 3000  # Windows

# Ver containers rodando
docker ps

# Ver imagens
docker images

# Ver uso de recursos
docker stats

# Limpar Docker
docker system prune -a
```

---

## 🧪 Testes

```bash
# Testar build local
npm run build
npm run preview

# Testar Docker local
docker build -t cakecup-test .
docker run -p 3000:3000 cakecup-test

# Acessar
http://localhost:3000
```

---

## 🐛 Troubleshooting

```bash
# Ver logs do container
docker logs cakecup

# Entrar no container
docker exec -it cakecup sh

# Ver variáveis de ambiente
docker exec cakecup env

# Rebuild sem cache
docker build --no-cache -t cakecup-web-app .

# Limpar tudo e recomeçar
docker stop cakecup
docker rm cakecup
docker rmi cakecup-web-app
docker build -t cakecup-web-app .
```

---

## 📊 Monitoramento

```bash
# Ver logs em tempo real
docker logs -f cakecup

# Ver estatísticas
docker stats cakecup

# Ver health check
docker inspect --format='{{.State.Health.Status}}' cakecup

# Ver detalhes completos
docker inspect cakecup
```

---

## 🔧 Utilitários

```bash
# Criar .env a partir do exemplo
cp .env.example .env

# Ver tamanho da imagem
docker images cakecup-web-app --format "{{.Size}}"

# Ver camadas da imagem
docker history cakecup-web-app

# Limpar containers parados
docker container prune

# Limpar imagens não usadas
docker image prune
```

---

## 📝 Variáveis de Ambiente

### Desenvolvimento (.env)
```env
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1
NUXT_PUBLIC_COMPANY_ID=seu-company-id-aqui
NODE_ENV=development
```

### Produção (Render)
```env
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1
NUXT_PUBLIC_COMPANY_ID=seu-company-id-aqui
NODE_ENV=production
```

---

## 🎯 Workflow Completo

### Desenvolvimento
```bash
# 1. Clonar/Atualizar
git pull

# 2. Instalar
npm install

# 3. Configurar
cp .env.example .env
# Editar .env

# 4. Rodar
npm run dev
```

### Deploy
```bash
# 1. Testar localmente
npm run build
npm run preview

# 2. Testar com Docker
docker build -t cakecup-test .
docker run -p 3000:3000 cakecup-test

# 3. Commit e Push
git add .
git commit -m "feat: sua mensagem"
git push

# 4. Render faz deploy automático
# Verificar logs no dashboard
```

---

## 🔗 Links Rápidos

- 📖 [DEPLOY_RENDER.md](DEPLOY_RENDER.md) - Guia completo
- 🐳 [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - Guia Docker
- 📝 [DEPLOY_SUMMARY.md](DEPLOY_SUMMARY.md) - Resumo
- 🌐 [Render Dashboard](https://dashboard.render.com)

---

**Dica**: Salve este arquivo nos favoritos para acesso rápido aos comandos!

