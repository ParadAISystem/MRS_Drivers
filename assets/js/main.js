// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
  // Configuración de animaciones
  animation: {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    duration: 800
  },
  
  // Configuración de navegación
  navigation: {
    offset: 80, // Altura del navbar fijo
    duration: 1000
  },
  
  // Configuración de WhatsApp
whatsapp: {
    number: '522461701219', // Número de WhatsApp del equipo
    defaultMessage: 'Hola! Me interesa conocer más sobre el equipo MRS de karting.'
  }
};

// ===== UTILIDADES =====
class Utils {
  // Debounce para optimizar eventos
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Throttle para eventos de scroll
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
  
  // Smooth scroll a elemento
  static smoothScrollTo(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
  
  // Formatear número de WhatsApp
  static formatWhatsAppNumber(number) {
    return number.replace(/[^0-9]/g, '');
  }
  
  // Generar URL de WhatsApp
  static generateWhatsAppURL(number, message = '') {
    const formattedNumber = this.formatWhatsAppNumber(number);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
  }
}

// ===== ANIMACIONES DE SCROLL =====
class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }
  
  init() {
    this.createObserver();
    this.observeElements();
  }
  
  createObserver() {
    const options = {
      threshold: CONFIG.animation.threshold,
      rootMargin: CONFIG.animation.rootMargin
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }
  
  observeElements() {
    // Elementos que se animan al hacer scroll
    const animatedElements = document.querySelectorAll(
      '.animate-on-scroll, .section-header, .fundador, .campeonato, .fecha, .opcion, .proyecto, .sponsor-logo, .contacto-opcion'
    );
    
    animatedElements.forEach(element => {
      element.classList.add('animate-on-scroll');
      this.observer.observe(element);
    });
  }
  
  animateElement(element) {
    element.classList.add('animate');
    
    // Animaciones específicas por tipo de elemento
    if (element.classList.contains('fundador')) {
      setTimeout(() => {
        element.style.transform = 'translateY(0) scale(1)';
        element.style.opacity = '1';
      }, 100);
    }
    
    if (element.classList.contains('sponsor-logo')) {
      setTimeout(() => {
        element.style.transform = 'scale(1) rotate(0deg)';
        element.style.opacity = '1';
      }, 200);
    }
  }
}

// ===== NAVEGACIÓN =====
class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.hamburger = document.querySelector('.hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    this.isMenuOpen = false;
    
    this.init();
  }
  
  init() {
    this.setupScrollEffect();
    this.setupSmoothScroll();
    this.setupMobileMenu();
    this.setupActiveLink();
  }
  
  setupScrollEffect() {
    const handleScroll = Utils.throttle(() => {
      if (window.scrollY > 100) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
  }
  
  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          Utils.smoothScrollTo(targetElement, CONFIG.navigation.offset);
          this.closeMobileMenu();
        }
      });
    });
  }
  
  setupMobileMenu() {
    console.log('Setting up mobile menu...');
    console.log('Hamburger element:', this.hamburger);
    console.log('NavMenu element:', this.navMenu);
    console.log('Navbar element:', this.navbar);
    
    if (this.hamburger && this.navMenu) {
      console.log('✅ Both elements found, adding event listener');
      this.hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🍔 Hamburger clicked!');
        this.toggleMobileMenu();
      });
      
      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (this.isMenuOpen && !this.navbar.contains(e.target)) {
          console.log('Closing menu - clicked outside');
          this.closeMobileMenu();
        }
      });
    } else {
      console.error('❌ Mobile menu elements not found:', { 
        hamburger: this.hamburger, 
        navMenu: this.navMenu,
        hamburgerExists: !!this.hamburger,
        navMenuExists: !!this.navMenu
      });
    }
  }
  
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('🔄 Toggling mobile menu. Is open:', this.isMenuOpen);
    
    this.hamburger.classList.toggle('active');
    this.navMenu.classList.toggle('active');
    
    console.log('📱 Menu classes after toggle:', {
      hamburger: this.hamburger.className,
      navMenu: this.navMenu.className,
      hamburgerHasActive: this.hamburger.classList.contains('active'),
      navMenuHasActive: this.navMenu.classList.contains('active')
    });
    
    // Verificar estilos computados
    const navMenuStyles = window.getComputedStyle(this.navMenu);
    console.log('🎨 NavMenu computed styles:', {
      position: navMenuStyles.position,
      top: navMenuStyles.top,
      display: navMenuStyles.display,
      visibility: navMenuStyles.visibility,
      zIndex: navMenuStyles.zIndex
    });
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }
  
  closeMobileMenu() {
    this.isMenuOpen = false;
    this.hamburger.classList.remove('active');
    this.navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  setupActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    
    const handleScroll = Utils.throttle(() => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - CONFIG.navigation.offset - 50;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      this.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
  }
}

// ===== WHATSAPP INTEGRATION =====
class WhatsAppIntegration {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupWhatsAppButtons();
    this.createFloatingButton();
  }
  
  setupWhatsAppButtons() {
    const whatsappButtons = document.querySelectorAll('[data-whatsapp]');
    
    whatsappButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const customMessage = button.getAttribute('data-whatsapp-message') || CONFIG.whatsapp.defaultMessage;
        const whatsappURL = Utils.generateWhatsAppURL(CONFIG.whatsapp.number, customMessage);
        
        window.open(whatsappURL, '_blank');
      });
    });
  }
  
  createFloatingButton() {
    const floatingButton = document.createElement('div');
    floatingButton.className = 'whatsapp-float';
    floatingButton.innerHTML = `
      <a href="#" data-whatsapp data-whatsapp-message="${CONFIG.whatsapp.defaultMessage}">
        <i class="fab fa-whatsapp"></i>
      </a>
    `;
    
    // Estilos del botón flotante
    const styles = `
      .whatsapp-float {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 1000;
        animation: pulse 2s infinite;
      }
      
      .whatsapp-float a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background: #25D366;
        border-radius: 50%;
        color: white;
        font-size: 1.5rem;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
        transition: all 0.3s ease;
      }
      
      .whatsapp-float a:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @media (max-width: 768px) {
        .whatsapp-float {
          bottom: 1rem;
          right: 1rem;
        }
        
        .whatsapp-float a {
          width: 50px;
          height: 50px;
          font-size: 1.25rem;
        }
      }
    `;
    
    // Agregar estilos al head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // Agregar botón al body
    document.body.appendChild(floatingButton);
    
    // Configurar evento del botón flotante
    const floatingLink = floatingButton.querySelector('a');
    floatingLink.addEventListener('click', (e) => {
      e.preventDefault();
      const whatsappURL = Utils.generateWhatsAppURL(CONFIG.whatsapp.number, CONFIG.whatsapp.defaultMessage);
      window.open(whatsappURL, '_blank');
    });
  }
}

// ===== EFECTOS ADICIONALES =====
class AdditionalEffects {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupParallaxEffect();
    this.setupCounterAnimations();
    this.setupHoverEffects();
    this.setupScrollIndicator();
  }
  
  setupParallaxEffect() {
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
      const handleScroll = Utils.throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
      }, 16);
      
      window.addEventListener('scroll', handleScroll);
    }
  }
  
  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-counter'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
      }, 16);
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    counters.forEach(counter => observer.observe(counter));
  }
  
  setupHoverEffects() {
    // Efecto hover para tarjetas
    const cards = document.querySelectorAll('.fundador, .campeonato, .opcion, .proyecto');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
        card.style.transition = 'all 0.3s ease';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
  
  setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const nextSection = document.querySelector('#historia');
        if (nextSection) {
          Utils.smoothScrollTo(nextSection, CONFIG.navigation.offset);
        }
      });
      
      // Ocultar indicador después del primer scroll
      const handleScroll = () => {
        if (window.scrollY > 100) {
          scrollIndicator.style.opacity = '0';
          scrollIndicator.style.pointerEvents = 'none';
          window.removeEventListener('scroll', handleScroll);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
    }
  }
}

// ===== GESTIÓN DE ERRORES =====
class ErrorHandler {
  static init() {
    window.addEventListener('error', (e) => {
      console.error('Error en la aplicación:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Promise rechazada:', e.reason);
    });
  }
}

// ===== INICIALIZACIÓN PRINCIPAL =====
class App {
  constructor() {
    this.init();
  }
  
  init() {
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }
  
  start() {
    try {
      // Inicializar gestión de errores
      ErrorHandler.init();
      
      // Inicializar componentes principales
      new ScrollAnimations();
      new Navigation();
      new WhatsAppIntegration();
      new AdditionalEffects();
      
      // Mostrar mensaje de carga completada
      console.log('🏁 MRS Karting - Landing page cargada correctamente');
      
      // Animación inicial del hero
      this.animateHeroContent();
      
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
    }
  }
  
  animateHeroContent() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        heroContent.style.transition = 'all 1s ease-out';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 500);
    }
  }
}

// ===== INICIALIZAR APLICACIÓN =====
new App();

// ===== EXPORTAR PARA USO GLOBAL =====
window.MRSKarting = {
  Utils,
  CONFIG
};