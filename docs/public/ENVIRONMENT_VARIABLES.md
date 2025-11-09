# 📝 Variáveis de Ambiente

Este arquivo documenta todas as variáveis de ambiente necessárias para o projeto CakeCup.

## 🔧 Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# API Base URL
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1

# Company ID (ID fixo da sua empresa)
NUXT_PUBLIC_COMPANY_ID=seu-company-id-aqui
```

## 📋 Variáveis Disponíveis

### `NUXT_PUBLIC_API_BASE`
- **Descrição**: URL base da API backend
- **Tipo**: String
- **Obrigatório**: Sim
- **Padrão**: `https://vendabela.onrender.com/app/v1`
- **Exemplo**: 
  - Produção: `https://vendabela.onrender.com/app/v1`
  - Desenvolvimento: `http://localhost:3001/app/v1`

### `NUXT_PUBLIC_COMPANY_ID`
- **Descrição**: ID único da empresa/loja no sistema
- **Tipo**: String (UUID)
- **Obrigatório**: Sim
- **Exemplo**: `123e4567-e89b-12d3-a456-426614174000`
- **Uso**: Utilizado em todas as requisições que necessitam identificar a empresa

## 🔍 Como Obter o COMPANY_ID

1. Faça login no sistema administrativo
2. Acesse a seção "Empresas"
3. Copie o ID da sua empresa
4. Cole no arquivo `.env`

## 🚀 Uso no Código

### Acessar via Runtime Config
```typescript
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const companyId = config.public.companyId
```

### Usar o Composable
```typescript
import { useCompany } from '~/composables/useCompany'

const { companyId } = useCompany()
```

## ⚠️ Importante

- **Nunca** commite o arquivo `.env` no Git
- O arquivo `.env.example` serve apenas como modelo
- Cada ambiente (dev, staging, prod) deve ter seu próprio `.env`
- As variáveis com prefixo `NUXT_PUBLIC_` são expostas no client-side

## 📝 Exemplo Completo

```env
# ========================================
# CONFIGURAÇÃO - CAKECUP WEB APP
# ========================================

# API Configuration
NUXT_PUBLIC_API_BASE=https://vendabela.onrender.com/app/v1

# Company Configuration
NUXT_PUBLIC_COMPANY_ID=123e4567-e89b-12d3-a456-426614174000

# ========================================
# PARA DESENVOLVIMENTO LOCAL
# ========================================
# NUXT_PUBLIC_API_BASE=http://localhost:3001/app/v1
# NUXT_PUBLIC_COMPANY_ID=local-company-id
```

## 🔒 Segurança

- Variáveis prefixadas com `NUXT_PUBLIC_` são **públicas**
- Não coloque informações sensíveis (passwords, tokens privados)
- Use variáveis sem prefixo para dados sensíveis (server-side only)

## 🛠️ Troubleshooting

### Erro: "companyId is undefined"
✅ Verifique se o arquivo `.env` existe
✅ Verifique se a variável está corretamente nomeada
✅ Reinicie o servidor de desenvolvimento após alterar o `.env`

### Erro: "API Base URL not configured"
✅ Verifique se `NUXT_PUBLIC_API_BASE` está definida
✅ Certifique-se de que a URL não tem barra no final

## 📚 Recursos

- [Documentação Nuxt - Runtime Config](https://nuxt.com/docs/guide/going-further/runtime-config)
- [Documentação da API](../docs/API_INTEGRATION.md)

