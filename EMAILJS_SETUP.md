# EmailJS Setup Guide

## 🚀 **Quick Solution (Works Immediately!)**

Your contact form now works with a **smart fallback system**:

1. **If EmailJS is configured**: Sends email directly through the service
2. **If EmailJS is not configured**: Opens the user's email client with pre-filled message

**This means your form works right now without any setup!**

When users click "Send message", it will:
- Try to send via EmailJS (if configured)
- If that fails, open their default email app with your email address and the message pre-filled
- Users can then send the email directly to you

---

## 📧 **Optional: Configure EmailJS for Direct Sending**

If you want emails to send directly without opening the email client, follow these steps:

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month free)
3. Verify your email address

### Step 2: Create an Email Service

1. Click on "Email Services" in the dashboard
2. Click "Add New Service"
3. Choose "Gmail" (recommended)
4. Click "Connect Service" and sign in with your Gmail
5. Note your **Service ID** (looks like `service_xxxxxxx`)

### Step 3: Create an Email Template

1. Click on "Email Templates" in the dashboard
2. Click "Create New Template"
3. Fill in the template:

**Template Name:** Portfolio Contact

**To Email:** angemariegloriairakoze@gmail.com

**Subject:** New message from {{from_name}} via portfolio

**Email Content:**
```
You received a new message from your portfolio website!

**From:** {{from_name}}
**Email:** {{from_email}}

**Message:**
{{message}}

---
Sent from: angeportfolio.com
```

4. Save and note your **Template ID** (looks like `template_xxxxxxx`)

### Step 4: Get Your Public Key

1. Click on "Account" → "API Keys"
2. Copy your **Public Key**

### Step 5: Update Your Website

Replace these placeholders in `script.js`:

```javascript
// Find this line and replace YOUR_PUBLIC_KEY_HERE:
// (Add this at the top of the contact form section)
emailjs.init("your_actual_public_key");

// Find this line and replace the IDs:
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
// With:
emailjs.send('service_your_service_id', 'template_your_template_id', formData)
```

---

## 🔧 **How It Works Right Now**

**Without EmailJS setup:**
1. User fills out form
2. Clicks "Send message"
3. Their email app opens with pre-filled message
4. They click "Send" in their email client
5. You receive the email directly

**With EmailJS setup:**
1. User fills out form
2. Clicks "Send message"
3. Email is sent directly through EmailJS
4. You receive the email immediately

## ✅ **Testing Your Form**

1. Open your website and go to Contact page
2. Fill out the form with test information
3. Click "Send message"
4. It should either send directly or open your email app
5. Check your email at `angemariegloriairakoze@gmail.com`

## 🚨 **Important Security Note**

**NEVER ask users for email passwords or credentials!** This is extremely dangerous and will make your site untrustworthy. The current solution is secure and professional.

## 📞 **Need Help?**

- The form works immediately with the fallback system
- EmailJS setup is optional for a more seamless experience
- EmailJS support: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
