<template>
  <div class="tv-floating-widget">
    <div class="tradingview-widget-container">
      <div
        class="tradingview-widget-container__widget"
        ref="widgetContainer"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const widgetContainer = ref(null)

onMounted(() => {
  console.log('[HiveBee] TradingView widget mounted')
  
  // Only inject once
  if (document.getElementById('tv-single-quote-script')) return

  const script = document.createElement('script')
  script.id = 'tv-single-quote-script'
  script.type = 'text/javascript'
  script.async = true
  script.src = '/embed-widget-single-quote.js'

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

<style>
.tv-floating-widget {
  position: fixed;
  display: block;
  width: 300px;
  height: 150px;
  left: 20px;     /* Bottom LEFT */
  bottom: 30px;   /* Adjust as needed */
  z-index: 9999;  /* Above app content */

  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 16px !important;
  
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

/* Dark theme variant (optional) */
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
