# Chrome Crystal Tab 🎨

A beautiful Chrome extension that lets you customize your new tab page with personal videos and images.

## Features ✨

- 🎥 **Video Support** - Set MP4 videos as your new tab background
- 🖼️ **Image Support** - Use JPG, PNG, or GIF images
- 🎨 **Effects** - Adjust brightness and blur for perfect visibility
- 💾 **Persistent** - Your settings are saved and synced
- ⚡ **Fast** - Built with Vue 3 & Composition API
- 📱 **Responsive** - Works on all screen sizes

## Installation

### Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chrome-crystal-tab.git
cd chrome-crystal-tab
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `dist/` folder

### Development Mode

Run with hot reload:
```bash
npm run dev
```

Then load the extension from the `dist/` folder and refresh as you make changes.

## Usage

1. **Open a new tab** - Your customized tab appears instantly
2. **Click the ⚙️ button** - Open settings panel
3. **Upload media** - Drag & drop or click to select
4. **Adjust effects** - Brightness and blur sliders
5. **Save** - Changes are immediately applied

## Project Structure

```
chrome-crystal-tab/
├── src/
│   ├── pages/
│   │   └── newtab.html          # New tab page
│   ├── utils/
│   │   └── storage.js           # Chrome Storage API wrapper
│   ├── App.vue                  # Main component
│   ├── main.js                  # Entry point
│   └── style.css                # Global styles
├── manifest.json                # Chrome extension manifest
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

## Technology Stack

- **Vue 3** - Frontend framework
- **Composition API** - Reactive state management
- **Vite** - Fast build tool
- **Chrome Storage API** - Persistent data storage

## Building for Release

Create a zip file for Chrome Web Store:
```bash
npm run zip
```

This generates `chrome-crystal-tab.zip` ready for upload.

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Brave
- Any Chromium-based browser

## Contributing

Contributions welcome! Please open issues and pull requests.

## License

MIT

## Author

Built with ❤️ by Miki

## Tips

- **Best Performance**: MP4 videos should be < 20MB for smooth playback
- **Image Quality**: Use high-resolution images for crisp display
- **Effects**: Combine brightness and blur for reduced eye strain
- **Dark Mode**: Use darker images with increased brightness

---

**Want to customize further?** Check out the Vue 3 Composition API docs and modify `src/App.vue` to add more features!
