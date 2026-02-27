/**
 * Storage utilities for Chrome Crystal Tab
 * Uses Chrome Storage API for persistence
 */

const STORAGE_KEY = 'crystal_tab_data'

/**
 * Save settings and media to Chrome storage
 */
export async function saveToStorage(data) {
  return new Promise((resolve, reject) => {
    try {
      // Use chrome.storage if available (in extension context)
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [STORAGE_KEY]: data }, () => {
          if (chrome.runtime.lastError) {
            console.error('Storage error:', chrome.runtime.lastError)
            // Fallback to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
          }
          resolve(data)
        })
      } else {
        // Fallback for development
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        resolve(data)
      }
    } catch (error) {
      console.error('Error saving to storage:', error)
      reject(error)
    }
  })
}

/**
 * Load settings and media from storage
 */
export async function loadFromStorage() {
  return new Promise((resolve, reject) => {
    try {
      // Try chrome.storage first
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
          if (chrome.runtime.lastError) {
            console.error('Storage error:', chrome.runtime.lastError)
            // Fallback to localStorage
            const data = localStorage.getItem(STORAGE_KEY)
            resolve(data ? JSON.parse(data) : null)
          } else {
            resolve(result[STORAGE_KEY] || null)
          }
        })
      } else {
        // Fallback for development
        const data = localStorage.getItem(STORAGE_KEY)
        resolve(data ? JSON.parse(data) : null)
      }
    } catch (error) {
      console.error('Error loading from storage:', error)
      reject(error)
    }
  })
}

/**
 * Load stored settings and media
 */
export async function loadSettings() {
  const data = await loadFromStorage()
  if (!data) {
    return {
      settings: {
        objectFit: 'cover',
        brightness: 100,
        blur: 0
      },
      media: {
        type: null,
        url: null,
        size: 0
      }
    }
  }
  return data
}

/**
 * Clear all stored data
 */
export async function clearStorage() {
  return new Promise((resolve, reject) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.remove([STORAGE_KEY], () => {
          if (chrome.runtime.lastError) {
            localStorage.removeItem(STORAGE_KEY)
          }
          resolve()
        })
      } else {
        localStorage.removeItem(STORAGE_KEY)
        resolve()
      }
    } catch (error) {
      console.error('Error clearing storage:', error)
      reject(error)
    }
  })
}
