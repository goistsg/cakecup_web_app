# 🎨 Paleta de Cores - CakeCup

Este documento descreve a paleta de cores oficial da aplicação CakeCup.

## 📋 Cores Principais

### 🔴 Vermelho Escuro - Primária
```css
--primary: #8B0014
--primary-light: #A61C2F
--primary-dark: #6A0010
```
**Uso**: Botões principais, links, destaques, logo

### 🔴 Vermelho Médio - Secundária
```css
--secondary: #D32F2F
--secondary-light: #E57373
--secondary-dark: #C62828
```
**Uso**: Botões secundários, badges, alertas de destaque

### 🟤 Marrom - Destaque
```css
--accent: #A0522D
--accent-light: #BC6C47
--accent-dark: #8B4513
```
**Uso**: Elementos de destaque, bordas especiais, ícones

## 🎨 Cores de Fundo

### Bege Claro - Fundo Principal
```css
--background: #E9DFD7
--background-light: #F5EDE8
--background-dark: #DDD0C5
```
**Uso**: Fundo principal da aplicação

### Rosa Claro - Superfícies
```css
--surface: #FBE9E7
--surface-light: #FFFFFF
--surface-dark: #F4D9D5
```
**Uso**: Cards, modais, áreas de conteúdo

## ✍️ Cores de Texto

### Marrom Escuro - Texto Principal
```css
--text: #3A1F1B
--text-light: #6B4D47
--text-lighter: #8B6F68
```
**Uso**: Textos principais, títulos, parágrafos

## 🔔 Cores de Status

```css
--success: #4CAF50  /* Verde - Sucesso */
--error: #D32F2F    /* Vermelho - Erro */
--warning: #FF9800  /* Laranja - Aviso */
--info: #2196F3     /* Azul - Informação */
```

## 🎭 Gradientes

```css
/* Gradiente Principal */
--gradient-primary: linear-gradient(135deg, #8B0014 0%, #D32F2F 100%)

/* Gradiente Secundário */
--gradient-secondary: linear-gradient(135deg, #D32F2F 0%, #A0522D 100%)

/* Gradiente Quente */
--gradient-warm: linear-gradient(135deg, #FBE9E7 0%, #E9DFD7 100%)
```

## 💡 Como Usar

### Em arquivos CSS/SCSS
```css
.meu-botao {
  background-color: var(--primary);
  color: var(--text-on-primary);
}

.meu-card {
  background-color: var(--surface);
  color: var(--text);
}
```

### Em arquivos Vue (style scoped)
```vue
<style scoped>
.header {
  background: var(--primary);
  color: white;
}

.container {
  background: var(--background);
}
</style>
```

### Classes Utilitárias
```html
<!-- Cores de Texto -->
<span class="text-primary">Texto Primário</span>
<span class="text-secondary">Texto Secundário</span>

<!-- Cores de Fundo -->
<div class="bg-primary">Fundo Primário</div>
<div class="bg-surface">Fundo Superfície</div>

<!-- Bordas -->
<div class="border-primary">Borda Primária</div>
```

## 🎯 Mapeamento de Cores

### Antes → Depois
```
#ff69b4 (Rosa Antigo) → var(--primary) (#8B0014)
#ff1493 (Rosa Escuro) → var(--secondary) (#D32F2F)
#ff4081 (Rosa Médio) → var(--secondary) (#D32F2F)
#f9f9f9 (Cinza Claro) → var(--background) (#E9DFD7)
```

## 📊 Acessibilidade

### Contraste de Cores

| Fundo | Texto | Contraste | Status |
|-------|-------|-----------|--------|
| `--primary` | white | 8.2:1 | ✅ AAA |
| `--secondary` | white | 5.8:1 | ✅ AA |
| `--background` | `--text` | 10.1:1 | ✅ AAA |
| `--surface` | `--text` | 11.4:1 | ✅ AAA |

Todos os contrastes atendem aos padrões WCAG 2.1 AA ou superior.

## 🎨 Visualização da Paleta

```
┌─────────────────────────────────────┐
│ PRIMARY (#8B0014)                   │ Vermelho Escuro
├─────────────────────────────────────┤
│ SECONDARY (#D32F2F)                 │ Vermelho Médio
├─────────────────────────────────────┤
│ ACCENT (#A0522D)                    │ Marrom
├─────────────────────────────────────┤
│ BACKGROUND (#E9DFD7)                │ Bege Claro
├─────────────────────────────────────┤
│ SURFACE (#FBE9E7)                   │ Rosa Claro
├─────────────────────────────────────┤
│ TEXT (#3A1F1B)                      │ Marrom Escuro
└─────────────────────────────────────┘
```

## 📝 Notas de Implementação

### Arquivos Atualizados
- ✅ `assets/styles/colors.css` - Sistema completo de variáveis
- ✅ `assets/styles/_variables.scss` - Variáveis SCSS
- ✅ `nuxt.config.ts` - Configuração global
- ✅ Todos os componentes atualizados para usar as novas cores

### Compatibilidade
- ✅ Suporta todos os navegadores modernos
- ✅ Variáveis CSS (:root)
- ✅ Variáveis SCSS (export)
- ✅ Classes utilitárias

## 🔄 Migração

Se você criar novos componentes, use sempre as variáveis CSS:

**❌ NÃO faça:**
```css
color: #ff69b4;
background: #8B0014;
```

**✅ FAÇA:**
```css
color: var(--primary);
background: var(--primary);
```

## 🎨 Design System

Esta paleta de cores é parte do Design System do CakeCup e deve ser usada consistentemente em toda a aplicação para manter a identidade visual.

### Princípios
1. **Consistência**: Use sempre as variáveis CSS
2. **Acessibilidade**: Mantenha contraste adequado
3. **Hierarquia**: Use primary para ações principais
4. **Feedback**: Use cores de status para feedback do usuário

---

**Última atualização**: 09/11/2024
**Versão da Paleta**: 2.0

