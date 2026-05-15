;(() => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  let started = false

  const register = () => {
    if (started) {
      return
    }

    started = true
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      // Bootstrap shell stays usable if registration fails; E2E catches regressions.
    })
  }

  window.addEventListener('soccer-manager:register-sw', register)
  window.addEventListener('load', () => {
    window.setTimeout(register, 15000)
  })
})()
