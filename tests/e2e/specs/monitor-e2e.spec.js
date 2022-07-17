const { test, expect } = require('@playwright/test');
const { LandingPage } = require('../pages/landingPage');
const {
  deleteEmailAddress,
  delay,
  generateRandomEmail,
} = require('../utils/helpers');
const { RegisterPage } = require('../pages/registerPage');

test.describe('Monitor e2e check for breaches', () => {
  let landingPage;
  let testEmail;
  let restEmail;  

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    testEmail = await generateRandomEmail();
    await landingPage.open();
  });

  test.afterEach(async () => {
    await deleteEmailAddress(testEmail);
  });

  test('Verify breach details are returned correctly and user can sign up', async ({
    page,
    request
  }) => {
    
      await page.type(landingPage.checkForBreachesEmailInput, testEmail, {
        delay: 50
      });
      await landingPage.CheckForBreachesButton.click();

      expect(page.url()).toContain('/scan');
      expect(await landingPage.emailScannedForBreaches.textContent()).toContain(
        testEmail
      );
      expect(await landingPage.breachResults.textContent()).toContain('0');

      await landingPage.alertAboutNewBreachesButton.click();
      const registerPage = new RegisterPage(page);
      await registerPage.createAccount(process.env.TESTACCOUNT_PASSWORD);

      async (attempts = 5) => {
        if (attempts === 0) {
          throw new Error('Unable to retrieve restmail data');
        }

        const response = await request.get(
          `http://restmail.net/mail/${testEmail}`,
          {
            failOnStatusCode: false
          }
        );

        const resJson = JSON.parse(await response.text());
        if (resJson.length) {
          restEmail = resJson[0].subject;
          return;
        }

        await delay(1000);
        await waitForRestmail(attempts - 1);
      };

      const verificationCode = restEmail.split(':')[1];
      await registerPage.verifyCodeInputField.fill(verificationCode.trim());
      await registerPage.continue();

      expect(page.url()).toContain('/user/dashboard');
    
  });

  test('Verify Get email alerts when your info appears in a known breach check box', async ({
    page,
    browserName,
    request
  }) => {
      await page.type(landingPage.checkForBreachesEmailInput, testEmail);
      await landingPage.newsLetterCheckBox.check();
      await landingPage.CheckForBreachesButton.click();
      await page.waitForLoadState('networkidle');
      
      if(browserName === 'firefox'){
        expect(page.url()).toContain('authorization?')
      } else {
        expect(page.url()).toContain('/signup');
      }      

      const registerPage = new RegisterPage(page);
      await registerPage.createAccount(process.env.TESTACCOUNT_PASSWORD);

      async (attempts = 5) => {
        if (attempts === 0) {
          throw new Error('Unable to retrieve restmail data');
        }

        const response = await request.get(
          `http://restmail.net/mail/${testEmail}`,
          {
            failOnStatusCode: false
          }
        );

        const resJson = JSON.parse(await response.text());
        if (resJson.length) {
          restEmail = resJson[0].subject;
          return;
        }

        await delay(1000);
        await waitForRestmail(attempts - 1);
      };

      const verificationCode = restEmail.split(':')[1];
      await registerPage.verifyCodeInputField.fill(verificationCode.trim());
      await registerPage.continue();

      expect(page.url()).toContain('/user/dashboard');
  });
});
