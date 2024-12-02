<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <p class="copyright">© {{ currentYear }} CakeCup. Todos os direitos reservados.</p>
      </div>
      
      <div class="footer-section">
        <nav class="footer-nav">
          <ul>
            <li><a href="/about">Sobre</a></li>
            <li><a href="/contact">Contato</a></li>
            <li><a href="/privacy">Privacidade</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style lang="scss" scoped>
.footer {
  background-color: #f8f9fa;
  padding: 2rem 0;
  margin-top: auto;
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
  
  .footer-nav {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      gap: 2rem;
      
      @media (max-width: 768px) {
        gap: 1rem;
      }
    }
    
    a {
      color: #666;
      text-decoration: none;
      transition: color 0.2s;
      
      &:hover {
        color: #333;
      }
    }
  }
  
  .copyright {
    color: #666;
    margin: 0;
  }
}
</style> 