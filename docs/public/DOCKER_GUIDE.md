# 🐳 Guia Docker - CakeCup Web App

Guia completo para usar Docker com a aplicação CakeCup.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Build da Imagem](#build-da-imagem)
3. [Rodar Container](#rodar-container)
4. [Docker Compose](#docker-compose)
5. [Comandos Úteis](#comandos-úteis)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Instalar Docker

**Windows/Mac:**
- Baixe [Docker Desktop](https://www.docker.com/products/docker-desktop)

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Verificar Instalação
```bash
docker --version
docker-compose --version
```

---

## 🏗️ Build da Imagem

### Build Básico
```bash
docker build -t cakecup-web-app .
```

### Build com Tag de Versão
```bash
docker build -t cakecup-web-app:1.0.0 .
docker build -t cakecup-web-app:latest .
```

### Build sem Cache (forçar rebuild)
```bash
docker build --no-cache -t cakecup-web-app .
```

### Ver Imagens
```bash
docker images
```

---

## 🚀 Rodar Container

### Rodar Simples
```bash
docker run -p 3000:3000 cakecup-web-app
```

### Rodar em Background (-d)
```bash
docker run -d -p 3000:3000 --name cakecup cakecup-web-app
```

### Rodar com Variáveis de Ambiente
```bash
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1 \
  -e NUXT_PUBLIC_COMPANY_ID=seu-company-id \
  --name cakecup \
  cakecup-web-app
```

### Rodar com Arquivo .env
```bash
docker run -p 3000:3000 --env-file .env --name cakecup cakecup-web-app
```

### Rodar com Auto-restart
```bash
docker run -d -p 3000:3000 --restart unless-stopped --name cakecup cakecup-web-app
```

---

## 🐳 Docker Compose

### Arquivo docker-compose.yml

Já está incluído no projeto! Veja `docker-compose.yml`

### Comandos Docker Compose

#### Iniciar
```bash
# Iniciar em background
docker-compose up -d

# Iniciar e ver logs
docker-compose up

# Build e iniciar
docker-compose up --build
```

#### Parar
```bash
# Parar containers
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar, remover e limpar volumes
docker-compose down -v
```

#### Ver Status
```bash
docker-compose ps
```

#### Ver Logs
```bash
# Todos os logs
docker-compose logs

# Logs em tempo real
docker-compose logs -f

# Últimas 100 linhas
docker-compose logs --tail=100
```

#### Rebuild
```bash
docker-compose up --build
```

---

## 🛠️ Comandos Úteis

### Gerenciar Containers

```bash
# Listar containers rodando
docker ps

# Listar todos os containers (incluindo parados)
docker ps -a

# Parar container
docker stop cakecup

# Iniciar container parado
docker start cakecup

# Reiniciar container
docker restart cakecup

# Remover container
docker rm cakecup

# Remover container forçadamente
docker rm -f cakecup
```

### Ver Logs

```bash
# Ver logs
docker logs cakecup

# Ver logs em tempo real
docker logs -f cakecup

# Últimas 100 linhas
docker logs --tail=100 cakecup

# Logs com timestamp
docker logs -t cakecup
```

### Executar Comandos no Container

```bash
# Abrir shell no container
docker exec -it cakecup sh

# Executar comando específico
docker exec cakecup node --version

# Ver variáveis de ambiente
docker exec cakecup env
```

### Inspecionar Container

```bash
# Ver detalhes do container
docker inspect cakecup

# Ver IP do container
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cakecup

# Ver portas mapeadas
docker port cakecup
```

### Gerenciar Imagens

```bash
# Listar imagens
docker images

# Remover imagem
docker rmi cakecup-web-app

# Remover imagens não utilizadas
docker image prune

# Remover todas as imagens não utilizadas
docker image prune -a
```

### Limpar Docker

```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Remover volumes não utilizados
docker volume prune

# Remover networks não utilizadas
docker network prune

# Limpar tudo (CUIDADO!)
docker system prune -a --volumes
```

---

## 🔍 Monitoramento

### Ver Uso de Recursos

```bash
# Ver estatísticas em tempo real
docker stats cakecup

# Ver estatísticas de todos os containers
docker stats
```

### Health Check

```bash
# Ver status de health
docker inspect --format='{{.State.Health.Status}}' cakecup

# Ver logs de health check
docker inspect --format='{{json .State.Health}}' cakecup | jq
```

---

## 🐛 Troubleshooting

### Problema: Container não inicia

**Solução:**
```bash
# Ver logs de erro
docker logs cakecup

# Verificar se a porta está em uso
netstat -an | grep 3000  # Linux/Mac
netstat -ano | findstr 3000  # Windows

# Tentar com porta diferente
docker run -p 3001:3000 cakecup-web-app
```

### Problema: Build falha

**Solução:**
```bash
# Build com logs detalhados
docker build --progress=plain -t cakecup-web-app .

# Limpar cache e rebuildar
docker build --no-cache -t cakecup-web-app .

# Verificar .dockerignore
cat .dockerignore
```

### Problema: Variáveis de ambiente não funcionam

**Solução:**
```bash
# Verificar variáveis no container
docker exec cakecup env

# Rodar com variáveis explícitas
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1 \
  -e NUXT_PUBLIC_COMPANY_ID=test \
  cakecup-web-app
```

### Problema: Container usa muita memória

**Solução:**
```bash
# Limitar memória
docker run -p 3000:3000 --memory="512m" cakecup-web-app

# Ver uso de memória
docker stats cakecup
```

### Problema: Imagem muito grande

**Solução:**
```bash
# Ver tamanho da imagem
docker images cakecup-web-app

# Ver camadas da imagem
docker history cakecup-web-app

# O Dockerfile já está otimizado com multi-stage build
```

---

## 📊 Análise de Imagem

### Ver Camadas
```bash
docker history cakecup-web-app
```

### Ver Tamanho
```bash
docker images cakecup-web-app --format "{{.Size}}"
```

### Scan de Segurança
```bash
docker scan cakecup-web-app
```

---

## 🔒 Segurança

### Boas Práticas Implementadas

✅ **Multi-stage build**: Imagem final não contém ferramentas de build
✅ **Alpine Linux**: Imagem base mínima
✅ **Non-root user**: App roda como usuário `nuxt`
✅ **Health check**: Monitora saúde da aplicação
✅ **.dockerignore**: Não inclui arquivos sensíveis

### Verificar Vulnerabilidades
```bash
# Docker scan (requer login)
docker scan cakecup-web-app

# Trivy (alternativa)
trivy image cakecup-web-app
```

---

## 📝 Exemplos de Uso

### Desenvolvimento Local
```bash
# Build
docker build -t cakecup-dev .

# Rodar com hot reload (se configurado)
docker run -p 3000:3000 -v $(pwd):/app cakecup-dev
```

### Teste de Produção
```bash
# Build
docker build -t cakecup-prod .

# Rodar
docker run -p 3000:3000 --env-file .env.production cakecup-prod
```

### CI/CD
```bash
# Build com tag de commit
docker build -t cakecup-web-app:${GIT_COMMIT} .

# Push para registry
docker push cakecup-web-app:${GIT_COMMIT}
```

---

## 🔗 Links Úteis

- [Docker Documentation](https://docs.docker.com)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

---

## 🆘 Precisa de Ajuda?

1. Verificar logs: `docker logs cakecup`
2. Ver documentação: `DEPLOY_RENDER.md`
3. Testar localmente sem Docker: `npm run dev`
4. Verificar variáveis de ambiente

---

**Última atualização**: 09/11/2024  
**Versão**: 1.0.0

