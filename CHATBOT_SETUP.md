# Chatbot Setup Guide

## OpenAI Integration Setup

To enable the chatbot functionality, you need to set up your OpenAI API key.

### 1. Create Environment File

Create a `.env.local` file in your project root with the following content:

```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Optional: Custom system prompt for the chatbot
VITE_CHATBOT_SYSTEM_PROMPT=You are a helpful assistant for Prosper Online, a digital marketing agency that helps Canadian businesses grow online. Be friendly, professional, and focus on digital marketing, SEO, lead generation, and analytics services. Keep responses concise and helpful.
```

### 2. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env.local` file

### 3. Features

The chatbot includes:
- ✅ **OpenAI GPT-3.5-turbo integration**
- ✅ **Conversation history** for context
- ✅ **Custom system prompt** for Prosper Online branding
- ✅ **Error handling** with user-friendly messages
- ✅ **Loading states** with animated indicators
- ✅ **Accessibility features** (ARIA labels, keyboard navigation)
- ✅ **Responsive design** that works on all devices
- ✅ **Professional UI** with message bubbles

### 4. Usage

The chatbot appears as a floating button in the bottom-right corner of your website. Users can:
- Click the chat button to open/close the chat window
- Type messages and press Enter to send
- Use Shift+Enter for new lines
- See real-time responses from the AI assistant

### 5. Customization

You can customize the chatbot by:
- Modifying the system prompt in `.env.local`
- Adjusting the max_tokens (currently 300)
- Changing the temperature (currently 0.7)
- Updating the welcome message in the component

### 6. Security Notes

- Never commit your `.env.local` file to version control
- The API key is exposed to the client-side (this is normal for Vite)
- Consider implementing rate limiting for production use
- Monitor your OpenAI usage to control costs

### 7. Troubleshooting

If the chatbot doesn't work:
1. Check that your API key is correctly set in `.env.local`
2. Restart your development server after adding environment variables
3. Check the browser console for error messages
4. Verify your OpenAI account has sufficient credits
