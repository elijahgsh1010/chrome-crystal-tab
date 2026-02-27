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
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js'

  // Set the widget configuration
  script.innerHTML = JSON.stringify({
    symbol: 'BLUEBERRY:XAUUSD',
    width: 300,
    height: 150,
    colorTheme: 'light',
    isTransparent: false,
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
  left: 20px;     /* Bottom LEFT */
  bottom: 20px;   /* Adjust as needed */
  z-index: 9999;  /* Above app content */
}

.tradingview-widget-container {
  width: 100%;
  height: 100%;
}

.tradingview-widget-container__widget {
  width: 100%;
  height: 100%;
}
</style>
