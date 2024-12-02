<template>
  <div class="privacidade-page">
    <header class="page-header">
      <h1>Política de Privacidade</h1>
    </header>

    <div class="content-wrapper">
      <section class="privacy-section">
        <h2>Introdução</h2>
        <p>A CakeCup está comprometida em proteger sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços.</p>
      </section>

      <section class="privacy-section">
        <h2>Informações que Coletamos</h2>
        <ul>
          <li>
            <h3>Informações Pessoais</h3>
            <p>Nome, endereço de e-mail, número de telefone e endereço de entrega quando você faz um pedido ou cria uma conta.</p>
          </li>
          <li>
            <h3>Informações de Pagamento</h3>
            <p>Detalhes do cartão de crédito ou outras informações de pagamento são processadas de forma segura por nossos parceiros de pagamento.</p>
          </li>
          <li>
            <h3>Informações de Uso</h3>
            <p>Dados sobre como você interage com nosso site, incluindo páginas visitadas e produtos visualizados.</p>
          </li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>Como Usamos suas Informações</h2>
        <ul>
          <li>Processar e entregar seus pedidos</li>
          <li>Enviar atualizações sobre seus pedidos</li>
          <li>Melhorar nossos produtos e serviços</li>
          <li>Enviar comunicações de marketing (com seu consentimento)</li>
          <li>Prevenir fraudes e manter a segurança</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>Proteção de Dados</h2>
        <p>Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
      </section>

      <section class="privacy-section">
        <h2>Cookies e Tecnologias Similares</h2>
        <p>Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site. Você pode controlar o uso de cookies através das configurações do seu navegador.</p>
      </section>

      <section class="privacy-section">
        <h2>Seus Direitos</h2>
        <p>Você tem direito a:</p>
        <ul>
          <li>Acessar suas informações pessoais</li>
          <li>Corrigir dados imprecisos</li>
          <li>Solicitar a exclusão de suas informações</li>
          <li>Retirar seu consentimento para marketing</li>
          <li>Solicitar a portabilidade dos dados</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>Contato</h2>
        <p>Se você tiver dúvidas sobre nossa política de privacidade ou sobre como tratamos seus dados, entre em contato conosco:</p>
        <div class="contact-info">
          <p>Email: privacidade@cakecup.com.br</p>
          <p>Telefone: (11) 99999-9999</p>
          <NuxtLink to="/contact" class="contact-link">
            Página de Contato
          </NuxtLink>
        </div>
      </section>

      <section class="privacy-section">
        <h2>Atualizações da Política</h2>
        <p>Esta política pode ser atualizada periodicamente. A data da última atualização será sempre indicada no início do documento.</p>
        <p class="last-update">Última atualização: {{ lastUpdate }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const lastUpdate = '28 de Novembro de 2024'
</script>

<style lang="scss" scoped>
.privacidade-page {
  .page-header {
    background: var(--primary-color);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
    
    h1 {
      font-size: 2.5rem;
      margin: 0;
    }
  }

  .content-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .privacy-section {
    margin-bottom: 3rem;

    h2 {
      color: var(--primary-color);
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
    }

    h3 {
      color: var(--primary-color);
      margin: 1rem 0;
      font-size: 1.3rem;
    }

    p {
      line-height: 1.6;
      color: #444;
      margin-bottom: 1rem;
    }

    ul {
      list-style-type: none;
      padding-left: 0;

      li {
        margin-bottom: 1rem;
        padding-left: 1.5rem;
        position: relative;

        &::before {
          content: "•";
          color: var(--primary-color);
          position: absolute;
          left: 0;
        }
      }
    }

    .contact-info {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1rem;

      p {
        margin-bottom: 0.5rem;
      }

      .contact-link {
        display: inline-block;
        margin-top: 1rem;
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .last-update {
      font-style: italic;
      color: #666;
      margin-top: 1rem;
    }
  }
}

@media (max-width: 768px) {
  .privacidade-page {
    .page-header {
      padding: 3rem 1rem;

      h1 {
        font-size: 2rem;
      }
    }

    .content-wrapper {
      padding: 1rem;
    }

    .privacy-section {
      h2 {
        font-size: 1.5rem;
      }

      h3 {
        font-size: 1.2rem;
      }
    }
  }
}
</style> 