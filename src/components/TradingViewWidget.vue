<template>
  <div class="tv-floating-widget" :style="containerStyle" @mousedown="startDrag">
    <div class="tradingview-widget-container">
      <div
        class="tradingview-widget-container__widget"
        ref="widgetContainer"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'

const widgetContainer = ref(null)

// Draggable state
const positionX = ref(20)
const positionY = ref(20)
const isDragging = ref(false)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)

const containerStyle = computed(() => ({
  left: `${positionX.value}px`,
  top: `${positionY.value}px`,
  bottom: 'auto'
}))

const startDrag = (event) => {
  isDragging.value = true
  dragOffsetX.value = event.clientX - positionX.value
  dragOffsetY.value = event.clientY - positionY.value
}

const onMouseMove = (event) => {
  if (!isDragging.value) return
  
  positionX.value = event.clientX - dragOffsetX.value
  positionY.value = event.clientY - dragOffsetY.value
  
  // Keep within bounds
  positionX.value = Math.max(0, Math.min(window.innerWidth - 320, positionX.value))
  positionY.value = Math.max(0, Math.min(window.innerHeight - 170, positionY.value))
}

const stopDrag = () => {
  isDragging.value = false
  // Save position to localStorage
  localStorage.setItem('tradingViewWidgetPosition', JSON.stringify({
    x: positionX.value,
    y: positionY.value
  }))
}

onMounted(() => {
  console.log('[CrystalTab] TradingView widget mounted')
  
  // Load saved position
  const saved = localStorage.getItem('tradingViewWidgetPosition')
  if (saved) {
    try {
      const { x, y } = JSON.parse(saved)
      positionX.value = x
      positionY.value = y
    } catch (e) {
      console.error('Failed to load widget position')
    }
  }
  
  // Only inject script once
  if (document.getElementById('tv-single-quote-script')) return

  const script = document.createElement('script')
  script.id = 'tv-single-quote-script'
  script.type = 'text/javascript'
  script.async = true
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js'

  // Set the widget configuration
  script.innerHTML = JSON.stringify({
    symbol: 'BLUEBERRY:XAUUSD',
    width: 300,
    height: 150,
    colorTheme: 'light',
    isTransparent: true,
    locale: 'en'
  })

  if (widgetContainer.value) {
    widgetContainer.value.appendChild(script)
  }
  
  // Add global mouse listeners
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.tv-floating-widget {
  position: fixed;
  display: block;
  width: 300px;
  height: 150px;
  z-index: 9999;

  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  
  /* Cursor feedback */
  cursor: grab;
  user-select: none;
  
  /* Smooth transitions */
  transition: all 0.3s ease;
  overflow: hidden;
}

.tv-floating-widget:active {
  cursor: grabbing;
}

.tv-floating-widget:hover {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 12px 40px 0 rgba(31, 38, 135, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  transform: translateY(-4px);
}

.tradingview-widget-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.tradingview-widget-container__widget {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

/* Dark theme variant */
@media (prefers-color-scheme: dark) {
  .tv-floating-widget {
    background: rgba(20, 20, 30, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 
      0 8px 32px 0 rgba(0, 0, 0, 0.3),
      inset 0 1px 1px rgba(255, 255, 255, 0.1);
  }
  
  .tv-floating-widget:hover {
    background: rgba(20, 20, 30, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 12px 40px 0 rgba(0, 0, 0, 0.4),
      inset 0 1px 1px rgba(255, 255, 255, 0.15);
  }
}
</style>
