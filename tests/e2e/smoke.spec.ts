import { expect, test } from '@playwright/test'

test('loads the bootstrap home page and registers a service worker', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /dein fußballverein/i })).toBeVisible()

  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker?.getRegistration()
    return Boolean(registration)
  })
})

test('keeps the shell available while offline', async ({ context, page }) => {
  await page.goto('/')
  await context.setOffline(true)
  await page.reload()

  await expect(page.getByRole('heading', { name: /dein fußballverein/i })).toBeVisible()
})
