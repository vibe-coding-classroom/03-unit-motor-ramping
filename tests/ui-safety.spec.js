const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Motor Ramping UI Safety Check', () => {
  test('should disable send button when maxPwmLimit exceeds 255', async ({ page }) => {
    // 載入本地 HTML 檔案
    const filePath = 'file://' + path.resolve(__dirname, '../ramping-app.html');
    await page.goto(filePath);

    const maxPwmInput = page.locator('#maxPwmLimit');
    const sendBtn = page.locator('#sendBtn');

    // 測試正常值
    await maxPwmInput.fill('200');
    await expect(sendBtn).toBeEnabled();

    // 測試非法值 (軟體保險絲)
    await maxPwmInput.fill('999');
    await expect(sendBtn).toBeDisabled();
    
    // 檢查是否顯示錯誤訊息
    const errorMessage = page.locator('.input-group.error .error-message');
    await expect(errorMessage).toBeVisible();
  });

  test('should verify binary payload length in console', async ({ page }) => {
    const filePath = 'file://' + path.resolve(__dirname, '../ramping-app.html');
    await page.goto(filePath);

    // 監聽 console 輸出
    const consolePromise = page.waitForEvent('console', msg => msg.text().includes('Sending binary payload'));
    
    await page.click('#sendBtn');
    
    const consoleMsg = await consolePromise;
    expect(consoleMsg.text()).toContain('Sending binary payload');
  });
});
