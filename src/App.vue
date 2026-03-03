<template>
  <div class="app-container">
    <!-- Background Display -->
    <div class="background-container">
      <video 
        v-if="media.type === 'video'" 
        :src="media.url" 
        autoplay 
        loop 
        muted
        class="media-display"
      ></video>
      <img 
        v-else-if="media.type === 'image'" 
        :src="media.url" 
        class="media-display"
        :style="{ objectFit: settings.objectFit }"
      />
      <div v-else class="default-background"></div>
    </div>

    <!-- Date & Time Widgets -->
    <DateTimeWidget :position="settings.dateTimePosition" />

    <!-- TradingView Widget -->
    <TradingViewWidget :position="settings.tradingViewPosition" />

    <!-- Settings Button -->
    <button @click="isSettingsOpen = !isSettingsOpen" class="settings-btn" title="Settings">
      ⚙️
    </button>

    <!-- Settings Panel -->
    <transition name="slide">
      <div v-if="isSettingsOpen" class="settings-panel">
        <div class="settings-header">
          <h2>Crystal Tab Settings</h2>
          <button @click="isSettingsOpen = false" class="close-btn">✕</button>
        </div>

        <div class="settings-content">
          <!-- File Upload -->
          <div class="setting-group">
            <label>Upload Media</label>
            <div class="upload-area" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleFileDrop">
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileSelect"
                accept="image/*,video/mp4"
                class="file-input"
              />
              <div :class="['upload-content', { dragging: isDragging }]">
                <span class="upload-icon">📁</span>
                <p>Drag & drop or click to upload</p>
                <small>Supports: JPG, PNG, GIF, MP4</small>
              </div>
            </div>
          </div>

          <!-- URL Input -->
          <div class="setting-group">
            <label>Or paste a URL</label>
            <div class="url-input-group">
              <input 
                v-model="urlInput" 
                type="url" 
                placeholder="https://example.com/video.mp4"
                class="url-input"
              />
              <button @click="loadFromUrl" class="btn-url">Load</button>
            </div>
            <small>Supports video (MP4, WebM) and image URLs</small>
          </div>

          <!-- Current Media Info -->
          <div v-if="media.url" class="setting-group">
            <label>Current Media</label>
            <div class="media-info">
              <p>Type: <strong>{{ media.type }}</strong></p>
              <p>Size: <strong>{{ formatFileSize(media.size) }}</strong></p>
              <button @click="clearMedia" class="btn-danger">Remove</button>
            </div>
          </div>

          <!-- Image Settings -->
          <div v-if="media.type === 'image'" class="setting-group">
            <label>Image Fit</label>
            <div class="option-group">
              <label class="radio-label">
                <input v-model="settings.objectFit" type="radio" value="cover" />
                Cover
              </label>
              <label class="radio-label">
                <input v-model="settings.objectFit" type="radio" value="contain" />
                Contain
              </label>
              <label class="radio-label">
                <input v-model="settings.objectFit" type="radio" value="fill" />
                Fill
              </label>
            </div>
          </div>

          <!-- Brightness Control -->
          <div class="setting-group">
            <label>Brightness: {{ settings.brightness }}%</label>
            <input v-model.number="settings.brightness" type="range" min="50" max="150" class="slider" />
          </div>

          <!-- Blur Effect -->
          <div class="setting-group">
            <label>Blur Effect: {{ settings.blur }}px</label>
            <input v-model.number="settings.blur" type="range" min="0" max="20" class="slider" />
          </div>

          <!-- Widget Positions -->
          <div class="setting-group">
            <label>Date & Time Widget Position</label>
            <div class="option-group">
              <label class="radio-label">
                <input v-model="settings.dateTimePosition" type="radio" value="top-left" />
                Top Left
              </label>
              <label class="radio-label">
                <input v-model="settings.dateTimePosition" type="radio" value="top-right" />
                Top Right
              </label>
              <label class="radio-label">
                <input v-model="settings.dateTimePosition" type="radio" value="bottom-left" />
                Bottom Left
              </label>
              <label class="radio-label">
                <input v-model="settings.dateTimePosition" type="radio" value="bottom-right" />
                Bottom Right
              </label>
            </div>
          </div>

          <div class="setting-group">
            <label>TradingView Widget Position</label>
            <div class="option-group">
              <label class="radio-label">
                <input v-model="settings.tradingViewPosition" type="radio" value="top-left" />
                Top Left
              </label>
              <label class="radio-label">
                <input v-model="settings.tradingViewPosition" type="radio" value="top-right" />
                Top Right
              </label>
              <label class="radio-label">
                <input v-model="settings.tradingViewPosition" type="radio" value="bottom-left" />
                Bottom Left
              </label>
              <label class="radio-label">
                <input v-model="settings.tradingViewPosition" type="radio" value="bottom-right" />
                Bottom Right
              </label>
            </div>
          </div>

          <!-- Save Button -->
          <button @click="saveSettings" class="btn-primary">Save Settings</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { loadSettings, saveToStorage, loadFromStorage } from './utils/storage'
import TradingViewWidget from './components/TradingViewWidget.vue'
import DateTimeWidget from './components/DateTimeWidget.vue'

const fileInput = ref(null)
const isSettingsOpen = ref(false)
const isDragging = ref(false)
const urlInput = ref('')

const media = reactive({
  type: null,
  url: null,
  size: 0
})

const settings = reactive({
  objectFit: 'cover',
  brightness: 100,
  blur: 0,
  dateTimePosition: 'top-left',
  tradingViewPosition: 'bottom-left'
})

const backgroundStyle = computed(() => ({
  filter: `brightness(${settings.brightness}%) blur(${settings.blur}px)`
}))

// Load settings on mount
onMounted(async () => {
  const stored = await loadSettings()
  if (stored) {
    Object.assign(settings, stored.settings)
    Object.assign(media, stored.media)
  }
})

// Watch for settings changes and apply styles
watch(settings, () => {
  const bgContainer = document.querySelector('.background-container')
  if (bgContainer) {
    bgContainer.style.filter = backgroundStyle.value.filter
  }
}, { deep: true })

// File handling
const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4']
  if (!validTypes.includes(file.type)) {
    alert('Unsupported file type. Please upload JPG, PNG, GIF, or MP4.')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const type = file.type.startsWith('video') ? 'video' : 'image'
    media.type = type
    media.url = e.target.result
    media.size = file.size
  }
  reader.readAsDataURL(file)
}

const clearMedia = () => {
  media.type = null
  media.url = null
  media.size = 0
}

const saveSettings = async () => {
  await saveToStorage({
    settings: { ...settings },
    media: { ...media }
  })
  isSettingsOpen.value = false
}

const formatFileSize = (bytes) => {
  const units = ['B', 'KB', 'MB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

const loadFromUrl = async () => {
  const url = urlInput.value.trim()
  if (!url) {
    alert('Please enter a valid URL')
    return
  }

  try {
    // Validate URL
    new URL(url)

    // Determine media type from URL
    const lowerUrl = url.toLowerCase()
    let mediaType = null

    if (lowerUrl.includes('.mp4') || lowerUrl.includes('.webm') || url.includes('video')) {
      mediaType = 'video'
    } else if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.gif') || url.includes('image')) {
      mediaType = 'image'
    } else {
      alert('Could not determine media type. Please ensure URL ends with .mp4, .webm, .jpg, .png, or .gif')
      return
    }

    // Set media
    media.type = mediaType
    media.url = url
    media.size = 0 // URL-based media doesn't have size

    urlInput.value = ''
  } catch (error) {
    alert('Invalid URL. Please enter a valid HTTP/HTTPS URL.')
  }
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.media-display {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-background {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.settings-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
}

.settings-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.settings-btn:active {
  transform: scale(0.95);
}

.settings-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.2);
  z-index: 101;
  overflow-y: auto;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
}

.settings-header h2 {
  font-size: 18px;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.settings-content {
  padding: 20px;
}

.setting-group {
  margin-bottom: 25px;
}

.setting-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.upload-area {
  position: relative;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.file-input {
  display: none;
}

.upload-content {
  padding: 30px 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.upload-content.dragging {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
}

.upload-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 10px;
}

.upload-content p {
  margin: 10px 0;
  color: #333;
  font-weight: 500;
}

.upload-content small {
  display: block;
  color: #999;
  margin-top: 5px;
}

.media-info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.media-info p {
  margin: 8px 0;
  color: #666;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  color: #666;
}

.radio-label input {
  cursor: pointer;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
}

.url-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.url-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: monospace;
  transition: all 0.3s ease;
}

.url-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-url {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.btn-url:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-url:active {
  transform: translateY(0);
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-danger {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #ee5a52;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 600px) {
  .settings-panel {
    width: 100%;
  }
}
</style>
