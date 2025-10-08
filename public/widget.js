/**
 * Answer24 Embeddable Chat Widget
 * Multi-tenant chat widget for partner websites
 */

(function() {
  'use strict';

  // Configuration
  const WIDGET_VERSION = '1.0.0';
  const API_BASE_URL = 'https://your-domain.com/api'; // Replace with your domain
  
  // Widget state
  let isOpen = false;
  let isLoaded = false;
  let settings = {};
  let messages = [];
  let currentCompanyId = null;

  // DOM elements
  let widgetContainer = null;
  let chatWindow = null;
  let settingsPanel = null;

  /**
   * Initialize the widget
   */
  function init() {
    // Get company ID from script tag
    const script = document.currentScript;
    currentCompanyId = script?.getAttribute('data-company') || 
                      script?.getAttribute('data-company-id') ||
                      window.answer24CompanyId;

    if (!currentCompanyId) {
      console.error('Answer24 Widget: Company ID is required');
      return;
    }

    // Load settings and initialize
    loadSettings().then(() => {
      createWidget();
      isLoaded = true;
    });
  }

  /**
   * Load widget settings from API
   */
  async function loadSettings() {
    try {
      const response = await fetch(`${API_BASE_URL}/widget-settings/${currentCompanyId}`);
      const data = await response.json();
      settings = data.settings || {};
    } catch (error) {
      console.error('Failed to load widget settings:', error);
      // Use default settings
      settings = {
        primary_color: '#007bff',
        secondary_color: '#6c757d',
        text_color: '#ffffff',
        background_color: '#ffffff',
        border_radius: 12,
        company_name: 'Your Company',
        welcome_message: 'Hi! How can I help you today?',
        position: 'bottom-right',
        auto_open: false
      };
    }
  }

  /**
   * Create the widget HTML
   */
  function createWidget() {
    // Create main container
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'answer24-widget';
    widgetContainer.style.cssText = `
      position: fixed;
      ${settings.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      ${settings.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create chat button
    const chatButton = document.createElement('div');
    chatButton.id = 'answer24-chat-button';
    chatButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
        <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="currentColor"/>
      </svg>
    `;
    chatButton.style.cssText = `
      width: 60px;
      height: 60px;
      background: ${settings.primary_color};
      color: ${settings.text_color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    `;

    // Create chat window
    chatWindow = document.createElement('div');
    chatWindow.id = 'answer24-chat-window';
    chatWindow.style.cssText = `
      position: absolute;
      bottom: 80px;
      ${settings.position.includes('right') ? 'right: 0;' : 'left: 0;'}
      width: 350px;
      height: 500px;
      background: ${settings.background_color};
      border-radius: ${settings.border_radius}px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      display: none;
      flex-direction: column;
      overflow: hidden;
    `;

    // Create chat header
    const chatHeader = document.createElement('div');
    chatHeader.style.cssText = `
      background: ${settings.primary_color};
      color: ${settings.text_color};
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;
    chatHeader.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        ${settings.company_logo ? `<img src="${settings.company_logo}" style="width: 32px; height: 32px; border-radius: 50%;" />` : ''}
        <div>
          <div style="font-weight: 600; font-size: 16px;">${settings.company_name}</div>
          <div style="font-size: 12px; opacity: 0.8;">Online</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="answer24-settings-btn" style="background: none; border: none; color: inherit; cursor: pointer; padding: 4px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
          </svg>
        </button>
        <button id="answer24-close-btn" style="background: none; border: none; color: inherit; cursor: pointer; padding: 4px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>
    `;

    // Create messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'answer24-messages';
    messagesContainer.style.cssText = `
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    // Create input container
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      padding: 16px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 8px;
    `;
    inputContainer.innerHTML = `
      <input 
        id="answer24-message-input" 
        type="text" 
        placeholder="${settings.placeholder_text}"
        style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 20px; outline: none;"
      />
      <button 
        id="answer24-send-btn" 
        style="background: ${settings.primary_color}; color: ${settings.text_color}; border: none; border-radius: 20px; padding: 12px 16px; cursor: pointer;"
      >
        Send
      </button>
    `;

    // Assemble chat window
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(messagesContainer);
    chatWindow.appendChild(inputContainer);

    // Add to container
    widgetContainer.appendChild(chatButton);
    widgetContainer.appendChild(chatWindow);

    // Add to page
    document.body.appendChild(widgetContainer);

    // Add event listeners
    setupEventListeners();

    // Add welcome message
    addMessage('bot', settings.welcome_message);

    // Auto-open if configured
    if (settings.auto_open) {
      toggleChat();
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Chat button click
    document.getElementById('answer24-chat-button')?.addEventListener('click', toggleChat);
    
    // Close button click
    document.getElementById('answer24-close-btn')?.addEventListener('click', toggleChat);
    
    // Send button click
    document.getElementById('answer24-send-btn')?.addEventListener('click', sendMessage);
    
    // Enter key in input
    document.getElementById('answer24-message-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    // Settings button click
    document.getElementById('answer24-settings-btn')?.addEventListener('click', toggleSettings);
  }

  /**
   * Toggle chat window
   */
  function toggleChat() {
    isOpen = !isOpen;
    const chatWindow = document.getElementById('answer24-chat-window');
    if (chatWindow) {
      chatWindow.style.display = isOpen ? 'flex' : 'none';
    }
  }

  /**
   * Add message to chat
   */
  function addMessage(sender, text) {
    const messagesContainer = document.getElementById('answer24-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      display: flex;
      ${sender === 'user' ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
      margin-bottom: 8px;
    `;

    const messageBubble = document.createElement('div');
    messageBubble.style.cssText = `
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 18px;
      background: ${sender === 'user' ? settings.primary_color : '#f0f0f0'};
      color: ${sender === 'user' ? settings.text_color : '#333'};
      word-wrap: break-word;
    `;
    messageBubble.textContent = text;

    messageDiv.appendChild(messageBubble);
    messagesContainer.appendChild(messageBubble);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Store message
    messages.push({ sender, text });
  }

  /**
   * Send message
   */
  async function sendMessage() {
    const input = document.getElementById('answer24-message-input') as HTMLInputElement;
    const message = input?.value?.trim();
    
    if (!message) return;

    // Add user message
    addMessage('user', message);
    input.value = '';

    // Show typing indicator
    addMessage('bot', '...');

    try {
      // Send to API
      const response = await fetch(`${API_BASE_URL}/partner-chat/${currentCompanyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: messages.slice(-10), // Last 10 messages for context
          user_id: generateUserId()
        })
      });

      const data = await response.json();

      // Remove typing indicator
      const messagesContainer = document.getElementById('answer24-messages');
      if (messagesContainer && messagesContainer.lastChild) {
        messagesContainer.removeChild(messagesContainer.lastChild);
      }

      // Add bot response
      addMessage('bot', data.message || 'Sorry, I could not process your message.');

    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove typing indicator
      const messagesContainer = document.getElementById('answer24-messages');
      if (messagesContainer && messagesContainer.lastChild) {
        messagesContainer.removeChild(messagesContainer.lastChild);
      }
      
      addMessage('bot', 'Sorry, something went wrong. Please try again.');
    }
  }

  /**
   * Toggle settings panel
   */
  function toggleSettings() {
    // Create settings panel if it doesn't exist
    if (!settingsPanel) {
      createSettingsPanel();
    }
    
    // Toggle visibility
    const isVisible = settingsPanel.style.display !== 'none';
    settingsPanel.style.display = isVisible ? 'none' : 'block';
  }

  /**
   * Create settings panel
   */
  function createSettingsPanel() {
    settingsPanel = document.createElement('div');
    settingsPanel.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      padding: 20px;
      overflow-y: auto;
      display: none;
    `;

    settingsPanel.innerHTML = `
      <h3 style="margin: 0 0 20px 0; color: #333;">Widget Settings</h3>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Company Name</label>
        <input id="setting-company-name" type="text" value="${settings.company_name}" 
               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Welcome Message</label>
        <textarea id="setting-welcome-message" 
                  style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; height: 60px;">${settings.welcome_message}</textarea>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Primary Color</label>
        <input id="setting-primary-color" type="color" value="${settings.primary_color}" 
               style="width: 100%; height: 40px; border: 1px solid #ddd; border-radius: 4px;" />
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">AI Personality</label>
        <textarea id="setting-ai-personality" 
                  style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; height: 60px;">${settings.ai_personality}</textarea>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 20px;">
        <button id="save-settings" 
                style="flex: 1; background: ${settings.primary_color}; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer;">
          Save Settings
        </button>
        <button id="cancel-settings" 
                style="flex: 1; background: #6c757d; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer;">
          Cancel
        </button>
      </div>
    `;

    chatWindow?.appendChild(settingsPanel);

    // Add event listeners for settings
    document.getElementById('save-settings')?.addEventListener('click', saveSettings);
    document.getElementById('cancel-settings')?.addEventListener('click', () => {
      settingsPanel.style.display = 'none';
    });
  }

  /**
   * Save settings
   */
  async function saveSettings() {
    const newSettings = {
      company_name: (document.getElementById('setting-company-name') as HTMLInputElement)?.value,
      welcome_message: (document.getElementById('setting-welcome-message') as HTMLTextAreaElement)?.value,
      primary_color: (document.getElementById('setting-primary-color') as HTMLInputElement)?.value,
      ai_personality: (document.getElementById('setting-ai-personality') as HTMLTextAreaElement)?.value,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/widget-settings/${currentCompanyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        // Update local settings
        Object.assign(settings, newSettings);
        
        // Update UI
        updateWidgetAppearance();
        
        // Hide settings panel
        settingsPanel.style.display = 'none';
        
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  }

  /**
   * Update widget appearance
   */
  function updateWidgetAppearance() {
    // Update chat button
    const chatButton = document.getElementById('answer24-chat-button');
    if (chatButton) {
      chatButton.style.background = settings.primary_color;
    }

    // Update header
    const chatHeader = chatWindow?.querySelector('div');
    if (chatHeader) {
      chatHeader.style.background = settings.primary_color;
    }

    // Update company name in header
    const companyNameElement = chatWindow?.querySelector('div > div > div');
    if (companyNameElement) {
      companyNameElement.textContent = settings.company_name;
    }
  }

  /**
   * Generate user ID
   */
  function generateUserId() {
    let userId = localStorage.getItem('answer24_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('answer24_user_id', userId);
    }
    return userId;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global API
  window.Answer24Widget = {
    version: WIDGET_VERSION,
    open: () => toggleChat(),
    close: () => { isOpen = false; toggleChat(); },
    sendMessage: (message) => {
      if (message) {
        addMessage('user', message);
        sendMessage();
      }
    }
  };

})();
