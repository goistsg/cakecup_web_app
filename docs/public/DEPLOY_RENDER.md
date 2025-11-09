# 🚀 Deploy no Render - CakeCup Web App

Este guia explica como fazer o deploy da aplicação CakeCup no Render usando Docker.

---

## 📋 Pré-requisitos

- [ ] Conta no [Render](https://render.com)
- [ ] Repositório Git (GitHub, GitLab ou Bitbucket)
- [ ] Código commitado e enviado para o repositório
- [ ] Variáveis de ambiente configuradas

---

## 🔧 Configuração das Variáveis de Ambiente

Antes de fazer o deploy, você precisa configurar as seguintes variáveis de ambiente:

### Obrigatórias:
```env
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1
NUXT_PUBLIC_COMPANY_ID=seu-company-id-aqui
```

### Opcionais:
```env
NODE_ENV=production
PORT=3000
```

---

## 🚀 Passo a Passo - Deploy no Render

### 1️⃣ **Criar Novo Web Service**

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório Git

### 2️⃣ **Configurar o Service**

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `cakecup-web-app` (ou o nome que preferir) |
| **Region** | Escolha a região mais próxima |
| **Branch** | `main` ou `master` |
| **Root Directory** | (deixe em branco) |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `Dockerfile` |
| **Docker Command** | (deixe em branco - usa o CMD do Dockerfile) |

### 3️⃣ **Configurar Plano**

- **Free**: Para testes (aplicação hiberna após inatividade)
- **Starter ($7/mês)**: Para produção (sempre ativo)

### 4️⃣ **Adicionar Variáveis de Ambiente**

Na seção **Environment Variables**, adicione:

```
NUXT_PUBLIC_API_BASE = https://vendabela.onrender.com/app/v1
NUXT_PUBLIC_COMPANY_ID = seu-company-id-aqui
NODE_ENV = production
```

### 5️⃣ **Deploy**

1. Clique em **"Create Web Service"**
2. Aguarde o build (pode levar 5-10 minutos)
3. Acompanhe os logs em tempo real

### 6️⃣ **Verificar Deploy**

Após o deploy, você verá:
- ✅ Status: **Live**
- 🌐 URL: `https://cakecup-web-app.onrender.com` (ou similar)

---

## 🔄 Deploy Automático (CI/CD)

O Render faz deploy automático quando você:
- Faz push para a branch configurada
- Merge de Pull Request
- Atualiza as variáveis de ambiente

---

## 📊 Monitoramento

### Logs
```bash
# Ver logs em tempo real no dashboard
Dashboard → Seu Service → Logs
```

### Métricas
- CPU Usage
- Memory Usage
- Request Count
- Response Time

### Health Check
O Dockerfile já inclui um health check:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3
```

---

## 🔧 Configurações Avançadas

### Custom Domain

1. Vá em **Settings** → **Custom Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções

### Auto-Deploy

Por padrão, está ativado. Para desativar:
1. **Settings** → **Build & Deploy**
2. Desmarque **Auto-Deploy**

### Environment Groups

Para reutilizar variáveis em múltiplos services:
1. **Dashboard** → **Environment Groups**
2. Crie um grupo
3. Adicione variáveis
4. Vincule ao service

---

## 🐛 Troubleshooting

### ❌ Build Failed

**Problema**: Erro durante o build

**Solução**:
```bash
# 1. Verificar logs de build no Render
# 2. Testar build localmente:
docker build -t cakecup-test .
docker run -p 3000:3000 cakecup-test
```

### ❌ Application Crashed

**Problema**: App inicia mas crasha

**Solução**:
1. Verificar logs: `Dashboard → Logs`
2. Verificar variáveis de ambiente
3. Testar localmente com Docker

### ❌ Port Issues

**Problema**: Porta incorreta

**Solução**:
- Render usa a variável `PORT` automaticamente
- Não é necessário configurar manualmente
- O Dockerfile já está configurado para `PORT=3000`

### ❌ Environment Variables Not Working

**Problema**: Variáveis não estão sendo lidas

**Solução**:
1. Verificar se as variáveis estão com prefixo `NUXT_PUBLIC_`
2. Fazer rebuild após adicionar variáveis
3. Verificar no código se está usando `useRuntimeConfig()`

---

## 🧪 Testar Localmente com Docker

Antes de fazer deploy, teste localmente:

### Build da Imagem
```bash
docker build -t cakecup-web-app .
```

### Rodar Container
```bash
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1 \
  -e NUXT_PUBLIC_COMPANY_ID=seu-company-id \
  cakecup-web-app
```

### Acessar
```
http://localhost:3000
```

### Parar Container
```bash
docker ps  # Ver containers rodando
docker stop <container-id>
```

---

## 🐳 Docker Compose (Desenvolvimento Local)

Para desenvolvimento local com Docker Compose:

### 1. Criar arquivo `.env`
```env
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1
NUXT_PUBLIC_COMPANY_ID=seu-company-id
```

### 2. Rodar com Docker Compose
```bash
docker-compose up -d
```

### 3. Ver logs
```bash
docker-compose logs -f
```

### 4. Parar
```bash
docker-compose down
```

---

## 📈 Performance

### Otimizações Incluídas

✅ **Multi-stage build**: Reduz tamanho da imagem
✅ **Alpine Linux**: Imagem base leve (~50MB)
✅ **Non-root user**: Segurança
✅ **Health check**: Monitoramento automático
✅ **Dumb-init**: Gerenciamento de processos
✅ **Production build**: Código otimizado

### Tamanho da Imagem
```
Builder stage: ~500MB (descartado)
Final image: ~150-200MB
```

---

## 🔒 Segurança

### Práticas Implementadas

✅ **Non-root user**: App roda como usuário `nuxt`
✅ **Minimal base image**: Alpine Linux
✅ **No secrets in image**: Variáveis via environment
✅ **.dockerignore**: Não inclui arquivos sensíveis
✅ **Health checks**: Detecta problemas rapidamente

---

## 💰 Custos

### Free Tier
- ✅ 750 horas/mês grátis
- ⚠️ App hiberna após 15min de inatividade
- ⚠️ Cold start de ~30s
- ✅ Bom para testes

### Starter Plan ($7/mês)
- ✅ Sempre ativo
- ✅ 512MB RAM
- ✅ 0.5 CPU
- ✅ SSL automático
- ✅ Bom para produção

---

## 📝 Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] Código commitado e enviado para Git
- [ ] `.env.example` atualizado
- [ ] Variáveis de ambiente configuradas
- [ ] Build local funciona (`npm run build`)
- [ ] Docker build funciona (`docker build -t test .`)
- [ ] Testes passando
- [ ] README atualizado
- [ ] CHANGELOG atualizado

---

## 🔗 Links Úteis

- [Render Documentation](https://render.com/docs)
- [Render Docker Guide](https://render.com/docs/docker)
- [Nuxt 3 Deployment](https://nuxt.com/docs/getting-started/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 🆘 Suporte

### Problemas com Render
- [Render Community](https://community.render.com)
- [Render Status](https://status.render.com)

### Problemas com a Aplicação
- Verificar logs no dashboard
- Testar localmente com Docker
- Verificar variáveis de ambiente
- Consultar documentação do projeto

---

## 🎉 Deploy Concluído!

Após o deploy bem-sucedido:

1. ✅ Acesse a URL fornecida pelo Render
2. ✅ Teste todas as funcionalidades
3. ✅ Configure domínio customizado (opcional)
4. ✅ Configure monitoramento
5. ✅ Celebre! 🎊

---

**Última atualização**: 09/11/2024  
**Versão**: 1.0.0

