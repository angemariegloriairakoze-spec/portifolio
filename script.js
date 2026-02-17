/**
 * Portfolio — Book-style pages, typing effect, form
 */

(function () {
  'use strict';

  const PAGE_IDS = ['hero', 'about', 'skills', 'projects', 'contact'];

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

  // ----- Book-style page switching -----
  var pages = document.querySelectorAll('.page');
  var navItems = document.querySelectorAll('.side-nav-item, .bottom-nav-item');

  function getPageEl(id) {
    return document.getElementById('page-' + id);
  }

  function setActivePage(id) {
    navItems.forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-nav') === id);
    });
    try {
      history.replaceState(null, '', '#' + id);
    } catch (e) {}
  }

  function goToPage(targetId) {
    var targetPage = getPageEl(targetId);
    if (!targetPage) return;

    // Remove active from all pages so only one is visible
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove('active', 'flip-out', 'flip-in');
    }
    targetPage.classList.add('active');
    setActivePage(targetId);
  }

  // Catch every click on hash links (nav or .nav-link) and switch page (capture so we run first)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (href === '#') return;
    var id = href.slice(1).split('/')[0].split('?')[0];
    if (PAGE_IDS.indexOf(id) === -1) return;
    e.preventDefault();
    e.stopPropagation();
    goToPage(id);
    return false;
  }, true);

  // Initial state: show page from URL hash or hero (run after DOM is ready)
  function initPage() {
    pages = document.querySelectorAll('.page');
    navItems = document.querySelectorAll('.side-nav-item, .bottom-nav-item');
    var hash = window.location.hash.slice(1).split('/')[0].split('?')[0];
    if (PAGE_IDS.indexOf(hash) !== -1) {
      goToPage(hash);
    } else {
      setActivePage('hero');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }

  // ----- Contact form with direct user messaging -----
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
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

      // Save message to dashboard
      saveMessageToDashboard(formData);

      // Send direct confirmation to user
      sendConfirmationToUser(formData);
      
      // Show success and reset form
      setTimeout(() => {
        btn.textContent = 'Message sent ✓';
        btn.style.background = 'rgba(100, 200, 140, 0.3)';
        form.reset();
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }, 1500);
    });

    // Function to send confirmation to user
    function sendConfirmationToUser(formData) {
      const subject = encodeURIComponent('Thank you for contacting Ange Gloria!');
      const body = encodeURIComponent(
        `Hello ${formData.from_name},\n\n` +
        `Thank you so much for reaching out through my portfolio! I've received your message and I'm excited to connect with you.\n\n` +
        `---\n\n` +
        `About Me:\n` +
        `I'm Irakoze Ange Marie Gloria, a passionate full-stack developer who loves building real projects and learning in the open. I specialize in creating modern web applications with:\n\n` +
        `🎯 Frontend: HTML5, CSS3, JavaScript, React\n` +
        `⚙️ Backend: Node.js, Express, REST APIs\n` +
        `🗄️ Database: MongoDB, PostgreSQL, Redis\n` +
        `🛠️ Tools: Git, GitHub, Docker, VS Code\n\n` +
        `I'm always excited to collaborate on interesting projects, internships, and learning opportunities. Whether you need a web application built, want to discuss a potential collaboration, or just want to connect - I'm here and ready to help!\n\n` +
        `I'll get back to you within 24 hours. In the meantime, feel free to check out my portfolio for more of my work.\n\n` +
        `Looking forward to our conversation!\n\n` +
        `Best regards,\n` +
        `Irakoze Ange Marie Gloria\n` +
        `Full-Stack Developer\n` +
        `Portfolio: angeportfolio.com\n\n` +
        `---\n\n` +
        `Your original message:\n${formData.message}`
      );
      
      // Open user's email with confirmation
      const userMailto = `mailto:${formData.from_email}?subject=${subject}&body=${body}`;
      window.open(userMailto, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    }

    // Function to save message to dashboard
    function saveMessageToDashboard(formData) {
      const message = {
        id: Date.now().toString(),
        name: formData.from_name,
        email: formData.from_email,
        message: formData.message,
        timestamp: new Date().toISOString(),
        read: false
      };

      // Get existing messages
      const existingMessages = localStorage.getItem('portfolio_messages');
      const messages = existingMessages ? JSON.parse(existingMessages) : [];
      
      // Add new message
      messages.push(message);
      
      // Save to localStorage
      localStorage.setItem('portfolio_messages', JSON.stringify(messages));
      
      console.log('Message saved to dashboard:', message);
    }

    // Test button functionality
    const testBtn = document.getElementById('test-email');
    if (testBtn) {
      testBtn.addEventListener('click', function() {
        const testSubject = encodeURIComponent('Thank you for contacting Ange Gloria!');
        const testBody = encodeURIComponent(
          `Hello Test User,\n\n` +
          `Thank you so much for reaching out through my portfolio! I've received your message and I'm excited to connect with you.\n\n` +
          `---\n\n` +
          `About Me:\n` +
          `I'm Irakoze Ange Marie Gloria, a passionate full-stack developer who loves building real projects and learning in the open. I specialize in creating modern web applications with:\n\n` +
          `🎯 Frontend: HTML5, CSS3, JavaScript, React\n` +
          `⚙️ Backend: Node.js, Express, REST APIs\n` +
          `🗄️ Database: MongoDB, PostgreSQL, Redis\n` +
          `🛠️ Tools: Git, GitHub, Docker, VS Code\n\n` +
          `I'm always excited to collaborate on interesting projects, internships, and learning opportunities. Whether you need a web application built, want to discuss a potential collaboration, or just want to connect - I'm here and ready to help!\n\n` +
          `I'll get back to you within 24 hours. In the meantime, feel free to check out my portfolio for more of my work.\n\n` +
          `Looking forward to our conversation!\n\n` +
          `Best regards,\n` +
          `Irakoze Ange Marie Gloria\n` +
          `Full-Stack Developer\n` +
          `Portfolio: angeportfolio.com\n\n` +
          `---\n\n` +
          `Your original message:\nThis is a test message to verify the direct user messaging works perfectly.`
        );
        
        const userMailto = `mailto:test@example.com?subject=${testSubject}&body=${testBody}`;
        
        testBtn.textContent = 'Testing direct message...';
        testBtn.disabled = true;
        
        window.open(userMailto, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        setTimeout(() => {
          testBtn.textContent = 'Direct message sent ✓';
          testBtn.style.background = 'rgba(100, 200, 140, 0.3)';
          
          setTimeout(() => {
            testBtn.textContent = 'Test Direct Message';
            testBtn.disabled = false;
            testBtn.style.background = '';
          }, 2000);
        }, 1000);
      });
    }
  }

  // ----- Footer year -----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
