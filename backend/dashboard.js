/**
 * Message Dashboard
 * Simple client-side message management system
 */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    PASSWORD: 'ange123', // Change this to your preferred password
    STORAGE_KEY: 'portfolio_messages'
  };

  // DOM Elements
  const loginScreen = document.getElementById('login-screen');
  const dashboardContent = document.getElementById('dashboard-content');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');
  const messagesContainer = document.getElementById('messages-container');
  const messageModal = document.getElementById('message-modal');
  const closeModal = document.getElementById('close-modal');
  const refreshBtn = document.getElementById('refresh-btn');
  const markAllReadBtn = document.getElementById('mark-all-read-btn');
  const deleteAllBtn = document.getElementById('delete-all-btn');

  // Modal elements
  const modalSubject = document.getElementById('modal-subject');
  const modalFrom = document.getElementById('modal-from');
  const modalEmail = document.getElementById('modal-email');
  const modalDate = document.getElementById('modal-date');
  const modalMessage = document.getElementById('modal-message');
  const replyBtn = document.getElementById('reply-btn');
  const deleteBtn = document.getElementById('delete-btn');

  // Stats elements
  const totalMessagesEl = document.getElementById('total-messages');
  const unreadMessagesEl = document.getElementById('unread-messages');

  // State
  let messages = [];
  let currentMessageId = null;

  // Initialize
  function init() {
    // Check if already logged in
    if (sessionStorage.getItem('dashboard_logged_in') === 'true') {
      showDashboard();
    } else {
      showLogin();
    }

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    refreshBtn.addEventListener('click', loadMessages);
    markAllReadBtn.addEventListener('click', markAllRead);
    deleteAllBtn.addEventListener('click', deleteAllMessages);
    closeModal.addEventListener('click', hideModal);
    replyBtn.addEventListener('click', handleReply);
    deleteBtn.addEventListener('click', handleDelete);

    // Close modal on outside click
    messageModal.addEventListener('click', function(e) {
      if (e.target === messageModal) {
        hideModal();
      }
    });
  }

  // Login/Logout
  function showLogin() {
    loginScreen.style.display = 'flex';
    dashboardContent.style.display = 'none';
  }

  function showDashboard() {
    loginScreen.style.display = 'none';
    dashboardContent.style.display = 'block';
    loadMessages();
  }

  function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === CONFIG.PASSWORD) {
      sessionStorage.setItem('dashboard_logged_in', 'true');
      loginError.style.display = 'none';
      showDashboard();
    } else {
      loginError.textContent = 'Incorrect password. Please try again.';
      loginError.style.display = 'block';
      document.getElementById('password').value = '';
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('dashboard_logged_in');
    showLogin();
    document.getElementById('password').value = '';
  }

  // Message Management
  function loadMessages() {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
    messages = stored ? JSON.parse(stored) : [];
    renderMessages();
    updateStats();
  }

  function saveMessages() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(messages));
    updateStats();
  }

  function renderMessages() {
    if (messages.length === 0) {
      messagesContainer.innerHTML = `
        <div class="empty-state">
          <h3>No messages yet</h3>
          <p>Messages from your contact form will appear here.</p>
        </div>
      `;
      return;
    }

    const messagesHTML = messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(message => createMessageHTML(message))
      .join('');

    messagesContainer.innerHTML = messagesHTML;

    // Add click listeners to message items
    document.querySelectorAll('.message-item').forEach(item => {
      item.addEventListener('click', function() {
        const messageId = this.dataset.messageId;
        showMessage(messageId);
      });
    });
  }

  function createMessageHTML(message) {
    const date = new Date(message.timestamp);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    return `
      <div class="message-item ${message.read ? '' : 'unread'}" data-message-id="${message.id}">
        <div class="message-header">
          <div class="message-from">${message.name}</div>
          <div class="message-date">${dateStr}</div>
        </div>
        <div class="message-preview" style="white-space: pre-wrap;">${message.message}</div>
        <div class="message-actions">
          <button class="btn btn-ghost" onclick="showMessage('${message.id}')">View</button>
          ${!message.read ? `<button class="btn btn-ghost" onclick="markAsRead('${message.id}')">Mark Read</button>` : ''}
          <button class="btn btn-ghost" onclick="deleteMessage('${message.id}')">Delete</button>
        </div>
      </div>
    `;
  }

  function showMessage(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    currentMessageId = messageId;
    
    modalSubject.textContent = `Message from ${message.name}`;
    modalFrom.textContent = message.name;
    modalEmail.textContent = message.email;
    modalDate.textContent = new Date(message.timestamp).toLocaleString();
    
    // Preserve user's exact formatting - no HTML escaping, show as typed
    modalMessage.textContent = message.message;
    modalMessage.style.whiteSpace = 'pre-wrap'; // Preserve line breaks and spacing
    modalMessage.style.fontFamily = 'inherit'; // Use normal font for readability
    
    messageModal.style.display = 'flex';
    
    // Mark as read
    if (!message.read) {
      markAsRead(messageId);
    }
  }

  function hideModal() {
    messageModal.style.display = 'none';
    currentMessageId = null;
  }

  function markAsRead(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (message && !message.read) {
      message.read = true;
      saveMessages();
      renderMessages();
    }
  }

  function markAllRead() {
    messages.forEach(message => {
      message.read = true;
    });
    saveMessages();
    renderMessages();
  }

  function deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
      messages = messages.filter(m => m.id !== messageId);
      saveMessages();
      renderMessages();
      if (currentMessageId === messageId) {
        hideModal();
      }
    }
  }

  function deleteAllMessages() {
    if (confirm('Are you sure you want to delete all messages? This cannot be undone.')) {
      messages = [];
      saveMessages();
      renderMessages();
      hideModal();
    }
  }

  function handleDelete() {
    if (currentMessageId) {
      deleteMessage(currentMessageId);
    }
  }

  function handleReply() {
    const message = messages.find(m => m.id === currentMessageId);
    if (message) {
      const subject = encodeURIComponent(`Re: Message from ${message.name}`);
      const body = encodeURIComponent(
        `\n\n---\nOriginal message from ${message.name} (${message.email}):\n${message.message}`
      );
      window.open(`https://mail.google.com/mail/?view=cm&to=${message.email}&su=${subject}&body=${body}`, '_blank');
    }
  }

  function updateStats() {
    const total = messages.length;
    const unread = messages.filter(m => !m.read).length;
    
    totalMessagesEl.textContent = total;
    unreadMessagesEl.textContent = unread;
  }

  // Global functions for onclick handlers
  window.showMessage = showMessage;
  window.markAsRead = markAsRead;
  window.deleteMessage = deleteMessage;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
