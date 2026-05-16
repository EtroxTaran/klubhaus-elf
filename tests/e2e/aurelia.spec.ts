import { expect, test } from '@playwright/test'

test('navigates the match-day golden path from the hub', async ({ page }) => {
  await page.goto('/')

  // Hub → inbox via the header button.
  await page.getByRole('link', { name: 'Posteingang öffnen' }).click()
  await expect(page).toHaveURL(/\/posteingang$/)
  await expect(page.getByText('5 ungelesen')).toBeVisible()

  // Back to hub, then advance into the match flow.
  await page.goBack()
  await page.getByRole('link', { name: /Weiter zum nächsten Termin/ }).click()
  await expect(page).toHaveURL(/\/anpfiff$/)
  await page.getByRole('link', { name: 'Anpfiff' }).click()
  await expect(page).toHaveURL(/\/spiel$/)
  await expect(page.getByText('● LIVE · 90+3')).toBeVisible()

  // Half-time sheet is deep-linkable via the search param.
  await page.goto('/spiel?halbzeit=1')
  await expect(page.getByRole('dialog', { name: 'Was passen wir an?' })).toBeVisible()
})

test('persists the colour scheme and tints to the club accent', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('ap.scheme', 'dark'))
  await page.reload()

  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.scheme)).toBe('dark')
  // ThemeProvider's effect resolves the club theme on mount. The exact
  // accent hex is asserted precisely in theme-provider.test.tsx.
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
    .toBe('A_hafenstadt')
})
