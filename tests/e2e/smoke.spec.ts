import { expect, type Page, test } from '@playwright/test'

async function waitForServiceWorkerControl(page: Page) {
  await page.waitForFunction(async () => Boolean((await navigator.serviceWorker?.ready)?.active))

  const isControlled = await page.evaluate(() => Boolean(navigator.serviceWorker.controller))
  if (!isControlled) {
    await page.reload({ waitUntil: 'domcontentloaded' })
  }

  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller))
}

test('loads the bootstrap home page and registers a service worker', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /dein fußballverein/i })).toBeVisible()
  await waitForServiceWorkerControl(page)
})

test('keeps the current shell available while offline', async ({ context, page }) => {
  await page.goto('/')
  await waitForServiceWorkerControl(page)
  await context.setOffline(true)

  await expect(page.getByRole('heading', { name: /dein fußballverein/i })).toBeVisible()
  await expect.poll(() => page.evaluate(() => navigator.onLine)).toBe(false)
})
