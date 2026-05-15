import { registerSW } from 'virtual:pwa-register'

let registered = false

export async function registerServiceWorker() {
  if (registered || !('serviceWorker' in navigator)) {
    return
  }

  registered = true
  registerSW({
    immediate: true,
    onNeedRefresh() {
      window.dispatchEvent(new CustomEvent('soccer-manager:pwa-update-ready'))
    },
    onOfflineReady() {
      window.dispatchEvent(new CustomEvent('soccer-manager:pwa-offline-ready'))
    },
  })
}
