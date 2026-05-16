import { expect, type Page, test } from '@playwright/test'

async function waitForServiceWorkerControl(page: Page) {
  await page.evaluate(() => window.dispatchEvent(new Event('soccer-manager:register-sw')))
  await page.waitForFunction(async () => Boolean((await navigator.serviceWorker?.ready)?.active))

  const isControlled = await page.evaluate(() => Boolean(navigator.serviceWorker.controller))
  if (!isControlled) {
    await page.reload({ waitUntil: 'domcontentloaded' })
  }

  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller))
}

test('loads the Office Hub and registers a service worker', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText(/Heute klärt sich, ob der Vorstand Geduld kennt/)).toBeVisible()
  await expect(page.getByRole('link', { name: /Weiter zum nächsten Termin/ })).toBeVisible()
  await waitForServiceWorkerControl(page)
})

test('keeps the current shell available while offline', async ({ context, page }) => {
  await page.goto('/')
  await waitForServiceWorkerControl(page)
  await context.setOffline(true)

  await expect(page.getByText('Nächster Termin')).toBeVisible()
  await expect.poll(() => page.evaluate(() => navigator.onLine)).toBe(false)
})
