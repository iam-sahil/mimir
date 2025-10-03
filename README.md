# Mimir Chat

<p align="center">
  <img src="/public/icons/android-chrome-192x192.png" width="96" alt="Mimir Logo" />
</p>

<p align="center">
  <b>Your Intelligent AI Chat Assistant</b><br/>
  <a href="#features">Features</a> • <a href="#installation">Install</a> • <a href="#usage">Usage</a> • <a href="#whats-new">What's New</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square" />
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.0.0-blue?style=flat-square&logo=typescript" />
</p>

---

## ✨ Features

- 🤖 **Multiple AI Models**: Seamlessly switch between Gemini and OpenRouter models
- 🔑 **Multiple API Key Support**: Add multiple Gemini API keys for automatic rotation when rate limits are reached
- 🎨 **Beautiful UI**: Modern, responsive design with multiple themes and font customization
- ⌨️ **Smart Typing**: Fast, smooth typewriter effect with background processing and tab-switching support
- 🔒 **Privacy First**: All data and API keys stored client-side only
- 🖼️ **Image Generation**: Create images from text prompts (model-dependent)
- 📁 **Smart Organization**: Pin, rename, and organize conversations with folders
- ⌨️ **Keyboard Shortcuts**: Fixed and improved keyboard shortcuts (Ctrl+R for rename, etc.)
- 🎯 **Default Model Selection**: Set and persist your preferred default AI model
- 🔤 **Live Font Customization**: Change interface and code fonts with instant preview
- ♿ **Accessibility**: Fully keyboard accessible and screen reader friendly

---

## 📸 Preview

<p align="center">
  <img src="/public/icons/mimir-screenshot-1.png" width="800" alt="Mimir Chat Interface" />
  <img src="/public/icons/mimir-screenshot-2.png" width="800" alt="Mimir Chat Features" />
</p>

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/mimir.git
cd mimir

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to start chatting!

---

## 🆕 What's New

### Recent Updates (v1.1.0)
- ✅ **Multiple API Key Rotation**: Support for up to 5 Gemini API keys with automatic rotation on rate limits
- ✅ **Fixed Keyboard Shortcuts**: Ctrl+R for rename now works correctly without false triggers
- ✅ **Tab Switching Fix**: AI responses no longer pause when switching tabs or chats
- ✅ **Live Font Preview**: See font changes instantly as you select them
- ✅ **Default Model Persistence**: Your selected default model now properly saves and loads
- ✅ **Improved Error Handling**: Better rate limit detection and automatic key rotation

---

## 🛠️ Configuration

### API Keys

#### Multiple Gemini API Keys (Recommended)
For better reliability and higher rate limits, you can add multiple Gemini API keys:

1. Get your API keys from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. In Settings > Account > API Keys, enter multiple keys separated by commas:
   ```
   AIzaSyABC123..., AIzaSyDEF456..., AIzaSyGHI789...
   ```
3. The app will automatically rotate between keys when rate limits are reached

#### Environment Variables (Optional)
You can also configure multiple keys in `.env.local`:
```env
VITE_GEMINI_FREE_API_KEY=your_primary_api_key
VITE_GEMINI_FREE_API_KEY_2=your_secondary_api_key
VITE_GEMINI_FREE_API_KEY_3=your_tertiary_api_key
VITE_GEMINI_FREE_API_KEY_4=your_fourth_api_key
VITE_GEMINI_FREE_API_KEY_5=your_fifth_api_key
VITE_FREE_MESSAGE_LIMIT=10
```

#### OpenRouter
- Get your key from [OpenRouter](https://openrouter.ai/keys)
- Add in Settings > Account > API Keys

### Customization
- **Themes**: Choose from 15+ themes in Settings > Appearance
- **Fonts**: Customize main and code fonts with live preview
- **Models**: Set your preferred default AI model (now properly persists!)
- **Shortcuts**: View all keyboard shortcuts in Settings > Shortcuts

---

## 🧠 Tech Stack

- **Frontend**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Icons**: Lucide Icons
- **State Management**: React Context
- **API Integration**: Gemini + OpenRouter

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + B` | Toggle sidebar |
| `Ctrl + K` | Focus search / Open search modal |
| `Ctrl + R` | Rename current chat |
| `Ctrl + Shift + O` | Create new chat |
| `Ctrl + Shift + /` | Cycle through themes |
| `Ctrl + Shift + A` | Attach files |

---

## 🐛 Known Issues & Fixes

This version includes fixes for:
- ✅ Keyboard shortcuts triggering with just Ctrl key
- ✅ Typing animation pausing when switching tabs
- ✅ Chat breaking on page refresh during AI response
- ✅ Default model selection not persisting
- ✅ Font changes not applying properly

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by the Sahil Rana
</p> 