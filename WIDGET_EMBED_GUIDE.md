# 🤖 Answer24 Embeddable Chat Widget

## 📋 **Quick Start for Partners**

### **Step 1: Get Your Company ID**
1. Contact Answer24 support to get your unique `company_id`
2. You'll receive your company ID (e.g., `123`, `456`, etc.)

### **Step 2: Add Widget to Your Website**

Add this single line to your website's HTML (before closing `</body>` tag):

```html
<script src="https://your-domain.com/widget.js" data-company="YOUR_COMPANY_ID"></script>
```

**Example:**
```html
<script src="https://answer24.com/widget.js" data-company="123"></script>
```

### **Step 3: Customize (Optional)**

You can also set the company ID via JavaScript:

```html
<script>
  window.answer24CompanyId = '123';
</script>
<script src="https://answer24.com/widget.js"></script>
```

## 🎨 **Widget Features**

### **✅ What Partners Get:**

1. **Customizable Appearance**
   - Company colors and branding
   - Custom logo and welcome message
   - Position control (bottom-right, bottom-left, etc.)

2. **AI-Powered Chat**
   - Trained on your company's data (stored in Pinecone)
   - Company-specific responses
   - Context-aware conversations

3. **Built-in Settings Panel**
   - Update settings directly from the widget
   - No need for separate admin dashboard
   - Real-time configuration changes

4. **Analytics & Logging**
   - Conversation tracking
   - Usage analytics
   - Customer insights

## ⚙️ **Advanced Configuration**

### **Widget API Methods**

```javascript
// Open the chat widget
Answer24Widget.open();

// Close the chat widget
Answer24Widget.close();

// Send a message programmatically
Answer24Widget.sendMessage('Hello, I need help with my order');
```

### **Custom Styling (CSS Override)**

```css
/* Override widget styles */
#answer24-widget {
  /* Your custom styles */
}

#answer24-chat-window {
  /* Customize chat window */
}

#answer24-chat-button {
  /* Customize chat button */
}
```

## 🔧 **Technical Details**

### **API Endpoints Used:**

1. **Widget Settings API**
   ```
   GET /api/widget-settings/{company_id}
   POST /api/widget-settings/{company_id}
   ```

2. **Partner Chat API**
   ```
   POST /api/partner-chat/{company_id}
   ```

### **Data Flow:**

```
Partner Website
    ↓ (embeds widget.js)
Widget loads with company_id
    ↓ (calls API)
Widget Settings API → Gets partner's settings
    ↓ (user sends message)
Partner Chat API → AI response with company context
    ↓ (Pinecone search)
Company-specific knowledge base
```

## 🚀 **For Developers**

### **Widget Structure:**

```
public/
├── widget.js              # Main embeddable script
├── widget.css             # Optional custom styles
└── widget.min.js          # Minified version
```

### **API Requirements:**

1. **Widget Settings API** - Manage partner configurations
2. **Partner Chat API** - Handle AI conversations
3. **Pinecone Integration** - Company-specific knowledge base

### **Security:**

- ✅ Company ID validation
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input sanitization

## 📊 **Analytics Dashboard**

Partners can view:
- Total conversations
- Response times
- Customer satisfaction
- Popular questions
- AI accuracy metrics

## 🆘 **Support**

### **For Partners:**
- Email: support@answer24.com
- Documentation: https://docs.answer24.com/widget
- Live Chat: Available in your dashboard

### **For Developers:**
- API Docs: https://api.answer24.com/docs
- GitHub: https://github.com/answer24/widget
- Issues: https://github.com/answer24/widget/issues

## 🔄 **Updates & Maintenance**

- Widget auto-updates (no action needed)
- New features added automatically
- Bug fixes deployed instantly
- Backward compatibility maintained

---

**Ready to get started?** Contact us to get your company ID and start embedding the widget on your website! 🚀
