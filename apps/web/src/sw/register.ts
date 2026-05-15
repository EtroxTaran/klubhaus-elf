let registered = false

export async function registerServiceWorker() {
  if (registered || !('serviceWorker' in navigator)) {
    return
  }

  registered = true
  await navigator.serviceWorker.register('/service-worker.js')
}
