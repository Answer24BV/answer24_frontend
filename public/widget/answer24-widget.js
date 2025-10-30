/**
 * Answer24 Embeddable Chat Widget
 * Version: 2.0.0
 * 
 * Usage:
 * <script src="https://yourdomain.com/widget/answer24-widget.js" data-public-key="YOUR_PUBLIC_KEY"></script>
 */

(function() {
  'use strict';

  // Get configuration from script tag
  const scriptTag = document.currentScript || document.querySelector('script[data-public-key]');
  const publicKey = scriptTag?.getAttribute('data-public-key');
  /**
   * API Base URL selection logic:
   * 1. If data-api-base attr is present on <script>, use that (explicit override)
   * 2. Otherwise, auto-detect based on window.location.host:
   *    - localhost/127.0.0.1: use dev backend (https://answer24_backend.test/api/v1)
   *    - answer24.nl or api.answer24.nl: use prod backend (https://api.answer24.nl/api/v1)
   * 3. Fallback: use prod API as the safest default
   *
   * This enables seamless switching between local/dev and production environments.
   */
  let apiBase = scriptTag?.getAttribute('data-api-base');
  if (!apiBase) {
    const currentHost = window.location.host;
    if (currentHost.includes('localhost') || currentHost.startsWith('127.')) {
      apiBase = 'https://answer24_backend.test/api/v1';
    } else if (currentHost.includes('answer24.nl')) {
      apiBase = 'https://api.answer24.nl/api/v1';
    } else {
      apiBase = 'https://api.answer24.nl/api/v1'; // safest fallback
    }
  }
  
  if (!publicKey) {
    console.error('[Answer24 Widget] Error: data-public-key attribute is required');
    return;
  }

  console.log('[Answer24 Widget] Initializing with public key:', publicKey);

  // Widget state
  let widgetSettings = null;
  let isOpen = false;
  let messages = [];
  let chatId = null;

  // Detect demo mode or missing publicKey
  let effectivePublicKey = publicKey;
  if (!effectivePublicKey || effectivePublicKey === 'demo-key-123') {
    effectivePublicKey = 'PUB_demo_testkey'; // Use a universal test key for demo
    console.warn('[Answer24 Widget] Using fallback demo public key: PUB_demo_testkey');
  }

  // After fetching the widget settings, merge each key with defaults as fallback
  function mergeWithDefaults(apiJson) {
    const defaultSettings = {
      theme: {
        primary: '#2563eb',
        foreground: '#ffffff',
        background: '#ffffff',
        radius: 18,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      behavior: {
        position: 'right',
        openOnLoad: false,
        openOnExitIntent: true,
        openOnInactivityMs: 0,
        zIndex: 9999
      },
      features: {
        chat: true,
        wallet: false,
        offers: false,
        leadForm: false
      },
      i18n: {
        default: 'en-US',
        strings: {
          'chat.welcome': "Hi there! I'm answer24, your assistant. How can I help you today?",
          'chat.placeholder': 'Type your message...',
          'chat.send': 'Send'
        }
      },
      integrations: {},
      visibility_rules: {},
      cdn: {},
    };

    function mergeSection(api, def) {
      if (!api || typeof api !== 'object') return { ...def };
      const merged = { ...def };
      for (const k in def) if (Object.hasOwn(def, k)) merged[k] = (api[k] !== undefined ? api[k] : def[k]);
      for (const k in api) if (!Object.hasOwn(def, k)) merged[k] = api[k]; // bring any extra keys
      return merged;
    }

    return {
      theme: mergeSection(apiJson.theme, defaultSettings.theme),
      behavior: mergeSection(apiJson.behavior, defaultSettings.behavior),
      features: mergeSection(apiJson.features, defaultSettings.features),
      i18n: apiJson.i18n ? { ...defaultSettings.i18n, ...apiJson.i18n, strings: { ...defaultSettings.i18n.strings, ...((apiJson.i18n||{}).strings || {}) } } : defaultSettings.i18n,
      integrations: apiJson.integrations || {},
      visibility_rules: apiJson.visibility_rules || {},
      cdn: apiJson.cdn || {},
    };
  }

  // Fetch widget settings from API or localStorage
  async function loadSettings() {
    try {
      // Use correct API base for config fetch
      const url = `${apiBase}/widget/config?key=${encodeURIComponent(effectivePublicKey)}`;
      const apiResp = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (apiResp.ok) {
        const apiJson = await apiResp.json();
        if (apiJson && typeof apiJson === 'object') {
          widgetSettings = mergeWithDefaults(apiJson);
          console.log('[Answer24 Widget] Loaded settings from API (with merged defaults)', widgetSettings);
          try {
            localStorage.setItem('widget-settings', JSON.stringify(widgetSettings));
          } catch (e) {}
          return;
        }
      } else {
        // Log if API returns error
        console.warn(`[Answer24 Widget] API returned status ${apiResp.status}`);
      }
    } catch (apiErr) {
      console.warn('[Answer24 Widget] Failed to fetch settings from API', apiErr);
    }
    // 2. Fall back to localStorage if possible
    try {
      const localSettings = localStorage.getItem('widget-settings');
      if (localSettings) {
        widgetSettings = JSON.parse(localSettings);
        console.log('[Answer24 Widget] Loaded settings from localStorage');
        return;
      }
    } catch (e) {
      // localStorage might not be available
      console.log('[Answer24 Widget] localStorage not available, will use defaults');
    }
    // 3. Final fallback: hardcoded default settings
    widgetSettings = {
      theme: {
        primary: '#2563eb',
        foreground: '#ffffff',
        background: '#ffffff',
        radius: 18,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      behavior: {
        position: 'right',
        openOnLoad: false,
        zIndex: 9999
      },
      features: { chat: true, wallet: false, offers: false, leadForm: false },
      i18n: {
        default: 'en-US',
        strings: {
          'chat.welcome': "Hi there! I'm answer24, your assistant. How can I help you today?",
          'chat.placeholder': 'Type your message...',
          'chat.send': 'Send'
        }
      },
      integrations: {},
      visibility_rules: {},
      cdn: {},
    };
  }

  // Create widget HTML
  function createWidgetHTML() {
    const theme = widgetSettings.theme;
    const behavior = widgetSettings.behavior;
    const strings = widgetSettings.i18n.strings;
    const position = behavior.position === 'left' ? 'left: 24px;' : 'right: 24px;';

    return `
      <style>
        #answer24-widget-container * {
          box-sizing: border-box;
          font-family: ${theme.fontFamily};
        }
        
        #answer24-chat-button {
          position: fixed;
          bottom: 24px;
          ${position}
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${theme.primary}, #1e293b);
          color: ${theme.foreground};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: ${behavior.zIndex};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        
        #answer24-chat-button:hover {
          transform: scale(1.1);
        }
        
        #answer24-chat-window {
          position: fixed;
          bottom: 100px;
          ${position}
          width: 400px;
          max-width: 90vw;
          height: 600px;
          max-height: 70vh;
          background: ${theme.background};
          border-radius: ${theme.radius}px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          z-index: ${behavior.zIndex};
          display: none;
          flex-direction: column;
          overflow: hidden;
        }
        
        #answer24-chat-window.open {
          display: flex;
        }
        
        #answer24-chat-header {
          background: linear-gradient(135deg, ${theme.primary}, #1e293b);
          color: ${theme.foreground};
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        #answer24-chat-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        #answer24-close-button {
          background: transparent;
          border: none;
          color: ${theme.foreground};
          cursor: pointer;
          font-size: 24px;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        #answer24-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f9fafb;
        }
        
        .answer24-message {
          margin-bottom: 16px;
          padding: 12px 16px;
          border-radius: 12px;
          max-width: 85%;
          word-wrap: break-word;
        }
        
        .answer24-message.user {
          background: linear-gradient(135deg, ${theme.primary}, #1e40af);
          color: white;
          margin-left: auto;
        }
        
        .answer24-message.bot {
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }
        
        #answer24-input-area {
          padding: 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 8px;
        }
        
        #answer24-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
        }
        
        #answer24-input:focus {
          border-color: ${theme.primary};
        }
        
        #answer24-send-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${theme.primary}, #1e293b);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        
        #answer24-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .answer24-typing {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }
        
        .answer24-typing span {
          width: 8px;
          height: 8px;
          background: ${theme.primary};
          border-radius: 50%;
          animation: answer24-bounce 1.4s infinite ease-in-out;
        }
        
        .answer24-typing span:nth-child(1) { animation-delay: -0.32s; }
        .answer24-typing span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes answer24-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      </style>
      
      <div id="answer24-widget-container">
        <button id="answer24-chat-button" aria-label="Open chat">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        
        <div id="answer24-chat-window">
          <div id="answer24-chat-header">
            <h3>answer24 Chat</h3>
            <button id="answer24-close-button" aria-label="Close chat">&times;</button>
          </div>
          <div id="answer24-messages">
            <div class="answer24-message bot">${strings['chat.welcome']}</div>
          </div>
          <div id="answer24-input-area">
            <input 
              type="text" 
              id="answer24-input" 
              placeholder="${strings['chat.placeholder']}"
              autocomplete="off"
            />
            <button id="answer24-send-button" aria-label="${strings['chat.send']}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Send message to API
  async function sendMessage(message) {
    try {
      // For now, simulate AI response
      // In production, this would call your Laravel backend API
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            content: `Thank you for your message: "${message}". This is a demo response. Connect to your backend API for real AI responses.`
          });
        }, 1000);
      });
    } catch (error) {
      console.error('[Answer24 Widget] Error sending message:', error);
      return {
        content: 'Sorry, something went wrong. Please try again.'
      };
    }
  }

  // Add message to chat
  function addMessage(text, sender = 'bot') {
    const messagesContainer = document.getElementById('answer24-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `answer24-message ${sender}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Show typing indicator
  function showTyping() {
    const messagesContainer = document.getElementById('answer24-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'answer24-typing-indicator';
    typingDiv.className = 'answer24-message bot';
    typingDiv.innerHTML = '<div class="answer24-typing"><span></span><span></span><span></span></div>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Hide typing indicator
  function hideTyping() {
    const typing = document.getElementById('answer24-typing-indicator');
    if (typing) typing.remove();
  }

  // Handle send message
  async function handleSendMessage() {
    const input = document.getElementById('answer24-input');
    const message = input?.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    if (input) input.value = '';
    
    // Show typing
    showTyping();
    
    // Send to API
    const response = await sendMessage(message);
    
    // Hide typing and show response
    hideTyping();
    addMessage(response.content, 'bot');
  }

  // Initialize widget
  async function initWidget() {
    await loadSettings();
    
    // Inject HTML
    const container = document.createElement('div');
    try {
      container.innerHTML = createWidgetHTML();
      document.body.appendChild(container.firstElementChild);
      // Check for successful injection
      const widgetRoot = document.getElementById('answer24-widget-container');
      if (widgetRoot) {
        console.log('[Answer24 Widget] Widget injected, DOM:', widgetRoot);
      } else {
        // Fallback: forcibly inject a widget with guaranteed safe defaults
        console.warn('[Answer24 Widget] Widget HTML not injected—falling back to emergency default markup.');
        container.innerHTML = `<div id="answer24-widget-container"><button id="answer24-chat-button" style="position:fixed;bottom:24px;right:24px;z-index:9999">💬</button><div id="answer24-chat-window" style="display:none;position:fixed;bottom:100px;right:24px;width:300px;height:400px;background:#fff;border-radius:16px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.08)"><div id="answer24-chat-header" style="background:#2563eb;color:#fff;padding:12px 16px;display:flex;justify-content:space-between"><span>answer24</span><button id="answer24-close-button" style="background:none;border:none;font-size:20px;color:#fff">&times;</button></div><div id="answer24-messages" style="flex:1;overflow:auto;padding:8px">Widget config error. Using fallback.</div><div id="answer24-input-area"><input id="answer24-input" type="text" placeholder="Type a message..." style="width:70%"><button id="answer24-send-button">Send</button></div></div></div>`;
        document.body.appendChild(container.firstElementChild);
        console.log('[Answer24 Widget] Emergency fallback widget injected.');
      }
    } catch (err) {
      // Always fallback if anything throws during markup creation
      console.error('[Answer24 Widget] Exception during widget DOM injection', err);
      container.innerHTML = `<div id="answer24-widget-container"><button id="answer24-chat-button" style="position:fixed;bottom:24px;right:24px;z-index:9999">💬</button><div id="answer24-chat-window" style="display:none;position:fixed;bottom:100px;right:24px;width:300px;height:400px;background:#fff;border-radius:16px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.08)"><div id="answer24-chat-header" style="background:#2563eb;color:#fff;padding:12px 16px;display:flex;justify-content:space-between"><span>answer24</span><button id="answer24-close-button" style="background:none;border:none;font-size:20px;color:#fff">&times;</button></div><div id="answer24-messages" style="flex:1;overflow:auto;padding:8px">Widget error. Emergency fallback loaded.</div><div id="answer24-input-area"><input id="answer24-input" type="text" placeholder="Type a message..." style="width:70%"><button id="answer24-send-button">Send</button></div></div></div>`;
      document.body.appendChild(container.firstElementChild);
      console.log('[Answer24 Widget] Emergency fallback (exception) widget injected.');
    }
    
    // Always attach handlers for normal + fallback widget (for robustness)
    function attachWidgetHandlers() {
      const chatButton = document.getElementById('answer24-chat-button');
      const closeButton = document.getElementById('answer24-close-button');
      const chatWindow = document.getElementById('answer24-chat-window');
      const sendButton = document.getElementById('answer24-send-button');
      const input = document.getElementById('answer24-input');

      if (chatButton && chatWindow) {
        chatButton.onclick = function() {
          chatWindow.style.display = (chatWindow.style.display === 'none' || !chatWindow.style.display) ? (chatWindow.classList.contains('open') ? 'flex' : 'block') : 'none';
          // For fallback, we'll just use 'block' (never flex if fallback)
          chatWindow.classList.add('open');
          if (input) try { input.focus(); } catch (e) {}
        }
      }
      if (closeButton && chatWindow) {
        closeButton.onclick = function() {
          chatWindow.style.display = 'none';
          chatWindow.classList.remove('open');
        }
      }
      // Emergency fallback for open/close/sendMessage API
      window.Answer24Widget = {
        open: function() {
          const cw = document.getElementById('answer24-chat-window');
          if (cw) {
            cw.style.display = cw.classList.contains('open') ? 'flex' : 'block';
            cw.classList.add('open');
          }
        },
        close: function() {
          const cw = document.getElementById('answer24-chat-window');
          if (cw) {
            cw.style.display = 'none';
            cw.classList.remove('open');
          }
        },
        sendMessage: function(message) {
          const input = document.getElementById('answer24-input');
          if (input) {
            input.value = message;
            // If sendButton exists, simulate click
            const sendButton = document.getElementById('answer24-send-button');
            if (sendButton) sendButton.click();
          }
        }
      }
    } // end attachWidgetHandlers

    // Attach handlers after *all* DOM injection attempts
    setTimeout(attachWidgetHandlers, 50); // Slight delay to ensure DOM is present
    
    // Event listeners w/ proper assignments
    const chatButton = document.getElementById('answer24-chat-button');
    const closeButton = document.getElementById('answer24-close-button');
    const chatWindow = document.getElementById('answer24-chat-window');
    const sendButton = document.getElementById('answer24-send-button');
    const input = document.getElementById('answer24-input');
    
    if (chatButton) {
      chatButton.addEventListener('click', function() {
        isOpen = !isOpen;
        if (chatWindow) chatWindow.classList.toggle('open', isOpen);
        if (isOpen && input) input.focus();
      });
    } else {
      console.warn('[Answer24 Widget] chatButton not found in DOM.');
    }

    if (closeButton) {
      closeButton.addEventListener('click', function() {
        isOpen = false;
        if (chatWindow) chatWindow.classList.remove('open');
      });
    } else {
      console.warn('[Answer24 Widget] closeButton not found in DOM.');
    }

    if (sendButton) {
      sendButton.addEventListener('click', handleSendMessage);
    } else {
      console.warn('[Answer24 Widget] sendButton not found in DOM.');
    }

    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSendMessage();
      });
    } else {
      console.warn('[Answer24 Widget] chat input not found in DOM.');
    }
    
    // Listen for settings updates (if on same domain)
    try {
      window.addEventListener('widget-settings-updated', async () => {
        console.log('[Answer24 Widget] Settings updated, reloading...');
        await loadSettings();
        // Recreate widget with new settings
        const widgetContainer = document.getElementById('answer24-widget-container');
        if (widgetContainer) {
          const wasOpen = isOpen;
          widgetContainer.remove();
          await initWidget();
          if (wasOpen) {
            document.getElementById('answer24-chat-window')?.classList.add('open');
            isOpen = true;
          }
        }
      });
    } catch (e) {
      // Event listeners might not work on external domains
      console.log('[Answer24 Widget] Event listeners not available');
    }
    
    console.log('[Answer24 Widget] Initialized successfully');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  // Expose global API
  window.Answer24Widget = {
    open: function() {
      var chatWindow = document.getElementById('answer24-chat-window');
      if (chatWindow) {
        isOpen = true;
        chatWindow.classList.add('open');
      }
    },
    close: function() {
      var chatWindow = document.getElementById('answer24-chat-window');
      if (chatWindow) {
        isOpen = false;
        chatWindow.classList.remove('open');
      }
    },
    sendMessage: function(message) {
      var input = document.getElementById('answer24-input');
      if (input) {
        input.value = message;
        handleSendMessage();
      }
    }
  };
})();

