<template>
  <div class="datetime-widgets" :style="containerStyle" ref="containerRef" @mousedown="startDrag">
    <!-- Date Widget -->
    <div class="glass-widget date-widget">
      <div class="widget-content">
        <div class="widget-label">Date</div>
        <div class="widget-value">{{ formattedDate }}</div>
      </div>
    </div>

    <!-- Time Widget -->
    <div class="glass-widget time-widget">
      <div class="widget-content">
        <div class="widget-label">Time</div>
        <div class="widget-value">{{ formattedTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const formattedDate = ref('')
const formattedTime = ref('')
let intervalId = null

// Draggable state
const positionX = ref(20)
const positionY = ref(20)
const isDragging = ref(false)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)
const containerRef = ref(null)

const updateDateTime = () => {
  const now = new Date()

  // Format date: Monday, February 27, 2026
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  formattedDate.value = dateFormatter.format(now)

  // Format time: 05:53:24 or 5:53 AM
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
  formattedTime.value = timeFormatter.format(now)
}

const containerStyle = computed(() => ({
  left: `${positionX.value}px`,
  top: `${positionY.value}px`
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
  positionX.value = Math.max(0, Math.min(window.innerWidth - 280, positionX.value))
  positionY.value = Math.max(0, Math.min(window.innerHeight - 350, positionY.value))
}

const stopDrag = () => {
  isDragging.value = false
  // Save position to localStorage
  localStorage.setItem('dateTimeWidgetPosition', JSON.stringify({
    x: positionX.value,
    y: positionY.value
  }))
}

onMounted(() => {
  updateDateTime()
  intervalId = setInterval(updateDateTime, 1000)
  
  // Load saved position
  const saved = localStorage.getItem('dateTimeWidgetPosition')
  if (saved) {
    try {
      const { x, y } = JSON.parse(saved)
      positionX.value = x
      positionY.value = y
    } catch (e) {
      console.error('Failed to load widget position')
    }
  }
  
  // Add global mouse listeners
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.datetime-widgets {
  position: fixed;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: grab;
  user-select: none;
}

.datetime-widgets:active {
  cursor: grabbing;
}

.glass-widget {
  /* Glassmorphism effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  
  /* Shadow for depth */
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.3);
  
  /* Smooth transitions */
  transition: all 0.3s ease;
  overflow: hidden;
  
  /* Padding and sizing */
  padding: 16px 20px;
  min-width: 280px;
}

.glass-widget:hover {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 12px 40px 0 rgba(31, 38, 135, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.widget-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.widget-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.8;
}

.widget-value {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.5px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.date-widget .widget-value {
  font-size: 18px;
  font-weight: 600;
}

.time-widget .widget-value {
  font-size: 20px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

/* Dark theme variant */
@media (prefers-color-scheme: dark) {
  .glass-widget {
    background: rgba(20, 20, 30, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 
      0 8px 32px 0 rgba(0, 0, 0, 0.3),
      inset 0 1px 1px rgba(255, 255, 255, 0.1);
  }
  
  .glass-widget:hover {
    background: rgba(20, 20, 30, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 12px 40px 0 rgba(0, 0, 0, 0.4),
      inset 0 1px 1px rgba(255, 255, 255, 0.15);
  }
}

/* Mobile responsive */
@media (max-width: 480px) {
  .glass-widget {
    min-width: 240px;
    padding: 12px 16px;
  }

  .widget-value {
    font-size: 14px;
  }

  .date-widget .widget-value {
    font-size: 16px;
  }

  .time-widget .widget-value {
    font-size: 18px;
  }
}
</style>
