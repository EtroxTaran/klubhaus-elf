;(() => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      // Bootstrap shell stays usable if registration fails; E2E catches regressions.
    })
  })
})()
