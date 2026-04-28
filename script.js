/**
 * Portfolio — Single-page with smooth scrolling, typing effect, form
 */

(function () {
  'use strict';

  const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'testimonials', 'contact'];

  // ----- Typing effect -----
  const taglines = [
    'Full-Stack Developer',
    'Building real projects',
    'Student developer',
    'Code • Ship • Learn'
  ];
  const typingEl = document.querySelector('.typing-text');
  let taglineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function type() {
    if (!typingEl) return;
    const current = taglines[taglineIndex];
    if (isDeleting) {
      typingEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }
    let delay = isDeleting ? 60 : 100;
    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      taglineIndex = (taglineIndex + 1) % taglines.length;
      delay = 400;
    }
    typingTimeout = setTimeout(type, delay);
  }

  if (typingEl) setTimeout(type, 800);

  // ----- Smooth scrolling navigation -----
  function setActiveNav(id) {
    var navItems = document.querySelectorAll('.side-nav-item, .bottom-nav-item');
    navItems.forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-nav') === id);
    });
  }

  function bookFlipTo(targetId) {
    var targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    var sections = document.querySelectorAll('.section');
    var currentSection = null;

    // Find current visible section
    sections.forEach(function(section) {
      var rect = section.getBoundingClientRect();
      if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
        currentSection = section;
      }
    });

    // Create book flip effect
    var flipOverlay = document.createElement('div');
    flipOverlay.className = 'book-flip-overlay';
    flipOverlay.innerHTML = `
      <div class="book-flip-page">
        <div class="book-flip-content">
          <div class="book-flip-text">Loading ${targetId.charAt(0).toUpperCase() + targetId.slice(1)}...</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(flipOverlay);

    // Start flip animation
    setTimeout(function() {
      flipOverlay.classList.add('flipping');
    }, 10);

    // Complete flip and navigate
    setTimeout(function() {
      flipOverlay.classList.add('complete');
      
      setTimeout(function() {
        // Scroll to target section
        targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        setActiveNav(targetId);
        
        // Remove overlay
        setTimeout(function() {
          flipOverlay.classList.add('removing');
          setTimeout(function() {
            document.body.removeChild(flipOverlay);
          }, 300);
        }, 100);
      }, 300);
    }, 600);
  }

  // Handle navigation clicks
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    var href = link.getAttribute('href');
    if (href === '#') return;
    
    var id = href.slice(1).split('/')[0].split('?')[0];
    if (SECTION_IDS.indexOf(id) === -1) return;
    
    e.preventDefault();
    e.stopPropagation();
    bookFlipTo(id);
    return false;
  }, true);

  // Intersection Observer for active nav highlighting
  function setupIntersectionObserver() {
    var sections = document.querySelectorAll('.section');
    var navItems = document.querySelectorAll('.side-nav-item, .bottom-nav-item');
    
    var observerOptions = {
      rootMargin: '-80px 0px -50% 0px',
      threshold: 0
    };

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          setActiveNav(id);
        }
      });
    }, observerOptions);

    sections.forEach(function(section) {
      observer.observe(section);
    });
  }

  // ----- Scroll-based navigation hiding -----
  var lastScrollTop = 0;
  var scrollThreshold = 100;
  var navToggle = document.getElementById('navToggle');
  var sideNav = document.querySelector('.side-nav');

  function handleScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > scrollThreshold) {
      // Hide navigation when scrolling down
      sideNav.classList.add('hidden');
      navToggle.classList.add('visible');
    } else {
      // Show navigation when at top
      sideNav.classList.remove('hidden');
      navToggle.classList.remove('visible');
    }
    
    lastScrollTop = scrollTop;
  }

  // Throttle scroll events
  var scrollTimer;
  function throttledHandleScroll() {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function() {
      handleScroll();
      scrollTimer = null;
    }, 16); // ~60fps
  }

  // Navigation toggle button click handler
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      // Toggle navigation visibility manually
      if (sideNav.classList.contains('hidden')) {
        sideNav.classList.remove('hidden');
        navToggle.classList.remove('visible');
      } else {
        sideNav.classList.add('hidden');
        navToggle.classList.add('visible');
      }
    });
  }

  // Initialize on DOM ready
  function init() {
    setupIntersectionObserver();
    
    // Set up scroll listener
    window.addEventListener('scroll', throttledHandleScroll);
    
    // Handle initial hash
    var hash = window.location.hash.slice(1).split('/')[0].split('?')[0];
    if (SECTION_IDS.indexOf(hash) !== -1) {
      setTimeout(function() {
        bookFlipTo(hash);
      }, 100);
    } else {
      setActiveNav('hero');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ----- Contact form with Node.js backend -----
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      // Show loading state
      btn.textContent = 'Sending message...';
      btn.disabled = true;
      
      // Get form data
      const formData = {
        from_name: form.from_name.value,
        from_email: form.from_email.value,
        message: form.message.value
      };

      try {
        // Send to Node.js backend
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Show success
          btn.textContent = 'Message sent ✓';
          btn.style.background = 'rgba(16, 185, 129, 0.3)';
          form.reset();
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.background = '';
          }, 3000);
        } else {
          // Show error
          btn.textContent = 'Failed to send';
          btn.style.background = 'rgba(239, 68, 68, 0.3)';
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.background = '';
          }, 3000);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Fallback to direct email method
        sendDirectEmail(formData);
        
        btn.textContent = 'Message sent ✓';
        btn.style.background = 'rgba(16, 185, 129, 0.3)';
        form.reset();
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }
    });

    // Fallback direct email function
    function sendDirectEmail(formData) {
      const subject = encodeURIComponent('New message from ' + formData.from_name + ' via portfolio');
      const body = encodeURIComponent(
        `Hello Ange Gloria,\n\n` +
        `You received a new message from your portfolio website!\n\n` +
        `**From:** ${formData.from_name}\n` +
        `**Email:** ${formData.from_email}\n\n` +
        `**Message:**\n${formData.message}\n\n` +
        `---\n` +
        `Sent from: angeportfolio.com\n` +
        `Date: ${new Date().toLocaleString()}`
      );
      
      const mailto = `mailto:angemariegloriairakoze@gmail.com?subject=${subject}&body=${body}`;
      window.open(mailto, '_blank');
    }

    // Test button functionality
    const testBtn = document.getElementById('test-email');
    if (testBtn) {
      testBtn.addEventListener('click', async function() {
        const testData = {
          from_name: 'Test User',
          from_email: 'test@example.com',
          message: 'This is a test message to verify the Node.js backend works perfectly.'
        };
        
        testBtn.textContent = 'Testing backend...';
        testBtn.disabled = true;
        
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
          });
          
          const result = await response.json();
          
          if (result.success) {
            testBtn.textContent = 'Backend test ✓';
            testBtn.style.background = 'rgba(16, 185, 129, 0.3)';
          } else {
            testBtn.textContent = 'Backend test failed';
            testBtn.style.background = 'rgba(239, 68, 68, 0.3)';
          }
        } catch (error) {
          console.error('Test error:', error);
          testBtn.textContent = 'Using fallback ✓';
          testBtn.style.background = 'rgba(251, 146, 60, 0.3)';
        }
        
        setTimeout(() => {
          testBtn.textContent = 'Test Direct Message';
          testBtn.disabled = false;
          testBtn.style.background = '';
        }, 2000);
      });
    }
  }

  // ----- Footer year -----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
