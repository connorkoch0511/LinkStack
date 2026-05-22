import { test, expect } from '@playwright/test'

test('landing page loads with hero and pricing', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Your links,')).toBeVisible()
  await expect(page.getByText('Simple pricing')).toBeVisible()
  await expect(page.getByText('Free')).toBeVisible()
  await expect(page.getByText('Pro')).toBeVisible()
})

test('login and signup links are present', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Get started free' })).toBeVisible()
})

test('signup page renders form', async ({ page }) => {
  await page.goto('/signup')
  await expect(page.getByPlaceholder('yourname')).toBeVisible()
  await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
})
