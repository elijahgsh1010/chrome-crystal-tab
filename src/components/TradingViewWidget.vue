<template>
  <div class="tv-floating-widget" :style="positionStyle">
    <div class="tradingview-widget-container">
      <div
        class="tradingview-widget-container__widget"
        ref="widgetContainer"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  position: {
    type: String,
    default: 'bottom-left'
  }
})

const widgetContainer = ref(null)

const positionStyle = computed(() => {
  if (!props.position) return { bottom: '20px', left: '20px' }
  
  const style = {}
  
  if (props.position.top !== undefined && props.position.top !== 'auto') {
    style.top = typeof props.position.top === 'number' ? `${props.position.top}px` : props.position.top
  }
  
  if (props.position.bottom !== undefined && props.position.bottom !== 'auto') {
    style.bottom = typeof props.position.bottom === 'number' ? `${props.position.bottom}px` : props.position.bottom
  }
  
  if (props.position.left !== undefined && props.position.left !== 'auto') {
    style.left = typeof props.position.left === 'number' ? `${props.position.left}px` : props.position.left
  }
  
  if (props.position.right !== undefined && props.position.right !== 'auto') {
    style.right = typeof props.position.right === 'number' ? `${props.position.right}px` : props.position.right
  }
  
  return style
})

onMounted(() => {
  console.log('[CrystalTab] TradingView widget mounted')
  
  // Only inject once
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
  
  /* Smooth transitions */
  transition: all 0.3s ease;
  overflow: hidden;
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
}

.tradingview-widget-container__widget {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
