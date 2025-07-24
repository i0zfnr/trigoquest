document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animations
  AOS.init({ duration: 800, once: true });

  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Loading animation
  window.addEventListener('load', function() {
    setTimeout(() => {
      document.querySelector('.loader-container').style.opacity = '0';
      setTimeout(() => {
        document.querySelector('.loader-container').style.display = 'none';
      }, 500);
    }, 500);
  });

  // Mobile navigation toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('nav');
  
  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', function() {
      nav.classList.toggle('show');
      this.innerHTML = nav.classList.contains('show') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    function checkScreenSize() {
      if (window.innerWidth <= 768) {
        nav.classList.remove('show');
        mobileMenuToggle.style.display = 'block';
      } else {
        nav.classList.add('show');
        mobileMenuToggle.style.display = 'none';
      }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
  }

  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      const icon = this.querySelector('i');
      if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        this.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        localStorage.setItem('darkMode', 'enabled');
      } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        this.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        localStorage.setItem('darkMode', 'disabled');
      }
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          window.location.hash = targetId;
        }
      }
    });
  });

  // Active navigation link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-btn');
  
  function highlightNavLink() {
    let fromTop = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}` || 
             (sectionId === 'intro' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavLink);
  highlightNavLink();

  // Interactive math icons
  const mathIconsContainer = document.querySelector('.math-icons');
  if (mathIconsContainer) {
    const icons = ['fa-superscript', 'fa-square-root-alt', 'fa-greater-than-equal', 
                  'fa-infinity', 'fa-pi', 'fa-equals', 'fa-percent'];
    
    for (let i = 0; i < 10; i++) {
      const icon = document.createElement('div');
      icon.className = 'math-icon';
      icon.innerHTML = `<i class="fas ${icons[Math.floor(Math.random() * icons.length)]}"></i>`;
      icon.style.top = `${Math.random() * 100}%`;
      icon.style.left = `${Math.random() * 100}%`;
      icon.style.animationDuration = `${15 + Math.random() * 10}s`;
      mathIconsContainer.appendChild(icon);
    }

    document.querySelectorAll('.math-icon').forEach(icon => {
      icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.5) rotate(15deg)';
        this.style.color = 'rgba(255,255,255,0.3)';
      });
      
      icon.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.color = 'rgba(255,255,255,0.1)';
      });
    });
  }

  // Question card interactions
  const questionCards = document.querySelectorAll('.question-card');
  if (questionCards.length > 0) {
    questionCards.forEach(card => {
      card.addEventListener('click', function(e) {
        if (e.target === this) {
          const details = this.querySelector('details');
          if (details) {
            details.open = !details.open;
          }
        }
      });
    });

    // Progress tracker
    document.getElementById('totalQuestions').textContent = questionCards.length;
    
    questionCards.forEach(card => {
      const details = card.querySelector('details');
      details.addEventListener('toggle', function() {
        if (this.open) {
          card.classList.add('completed');
          updateProgress();
        }
      });
    });
    
    function updateProgress() {
      const completed = document.querySelectorAll('.question-card.completed').length;
      const total = document.querySelectorAll('.question-card').length;
      document.getElementById('completedQuestions').textContent = completed;
      document.querySelector('.progress-fill').style.width = `${(completed / total) * 100}%`;
    }

    // Difficulty filter
    const difficultyFilters = document.querySelectorAll('.difficulty-filter');
    if (difficultyFilters.length > 0) {
      difficultyFilters.forEach(button => {
        button.addEventListener('click', function() {
          difficultyFilters.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          const difficulty = this.dataset.difficulty;
          questionCards.forEach(card => {
            if (difficulty === 'all' || card.querySelector('.difficulty').classList.contains(`difficulty-${difficulty}`)) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }

    // Print questions
    const printButton = document.querySelector('.print-btn');
    if (printButton) {
      printButton.addEventListener('click', function() {
        const printStyles = `
          <style>
            @media print {
              body * {
                visibility: hidden;
              }
              .question-card, .question-card * {
                visibility: visible;
              }
              .question-card {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                page-break-after: always;
              }
              .back-to-top, .print-btn, nav {
                display: none !important;
              }
              details[open] {
                display: block !important;
              }
            }
          </style>
        `;
        
        const originalContent = document.body.innerHTML;
        const questionCards = document.querySelectorAll('.question-card');
        let printContent = printStyles;
        
        questionCards.forEach(card => {
          printContent += card.outerHTML;
        });
        
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
      });
    }
  }

  // Trigonometry calculator
  const calculateBtn = document.getElementById('calculateBtn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
      const angle = parseFloat(document.getElementById('angleInput').value);
      const func = document.getElementById('trigFunction').value;
      
      if (isNaN(angle)) {
        alert('Please enter a valid number for the angle');
        return;
      }
      
      let result;
      switch(func) {
        case 'sin': 
        case 'cos': 
        case 'tan':
          const radians = angle * Math.PI / 180;
          result = Math[func](radians);
          break;
        case 'asin':
        case 'acos':
        case 'atan':
          result = Math[func](angle) * 180 / Math.PI;
          break;
      }
      
      document.getElementById('calcResult').textContent = result.toFixed(4);
    });
  }

  // Video play/pause control
  const video = document.querySelector('video');
  if (video) {
    const playButton = document.querySelector('.video-play-button');
    
    playButton.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        video.pause();
        playButton.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
    
    video.addEventListener('play', () => {
      playButton.style.opacity = '0';
      setTimeout(() => {
        playButton.style.display = 'none';
      }, 300);
    });
    
    video.addEventListener('pause', () => {
      playButton.style.display = 'flex';
      setTimeout(() => {
        playButton.style.opacity = '1';
      }, 10);
    });
  }

  // Scroll progress indicator
  const scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress';
  document.body.prepend(scrollProgress);
  
  window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + '%';
  });

  // Back to top button
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(backToTop);
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });

  // Download button hover effects
  const downloadButtons = document.querySelectorAll('.download-btn');
  downloadButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
});