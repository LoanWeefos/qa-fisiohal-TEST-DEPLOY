const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC54 — Validar registro de cita semanal con cantidad de recurrencia", function () {
  this.timeout(0);

  let driver, helper;

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt();
      global.driver = driver;
      global.helper = new browser(driver);
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']"
    );
  });

  it("Debe registrar una cita semanal con 5 recurrencias y reflejarse en calendario", async () => {
    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']"
    );
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cubiculo B']"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1500);

    await global.helper.findOrFail("//tbody/tr", "Tabla terapeutas", 20000);

    const rowCecilia = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]"
    );

    const therapistRadio = await rowCecilia.findElement(
      By.xpath(".//input[@type='radio']")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      therapistRadio
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick("//button[normalize-space()='Today']");
    await global.driver.sleep(1200);

    let columns = [];
    const start = Date.now();

    while (columns.length < 2 && Date.now() - start < 25000) {
      columns = await global.driver.findElements(
        By.xpath(
          "//div[contains(@class,'slds-col')]//div[@id='timeSlots']/ancestor::div[contains(@class,'slds-col')]"
        )
      );
      if (columns.length < 2) await global.driver.sleep(300);
    }

    assert.ok(columns.length >= 2);

    const targetColumn = columns[1];

    const slots = await targetColumn.findElements(
      By.xpath(".//span[contains(@class,'slds-radio_faux')]")
    );

    assert.ok(slots.length > 0);

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      slots[slots.length - 1]
    );
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1500);

    const daysInput = await global.helper.findOrFail(
      "//input[@name='Number_of_days_recurrence__c']"
    );

    await global.driver.executeScript("arguments[0].focus();", daysInput);
    await daysInput.clear();
    await global.driver.sleep(150);
    await daysInput.sendKeys("5");
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1500);

    const recurrenteCheckbox = await global.helper.findOrFail(
      "//input[@type='checkbox' and @name='RecurrenteCheckBox']",
      "Checkbox recurrente"
    );

    await global.driver.executeScript(
      "arguments[0].click();",
      recurrenteCheckbox
    );
    await global.driver.sleep(500);

    const recurrenceSelect = await global.helper.findOrFail(
      "//select[@name='RecurrenciaPickList']",
      "Selector de recurrencia"
    );

    await recurrenceSelect.sendKeys("Weekly");
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(2500);

    const noRadio = await global.helper.findOrFail(
      "//input[@type='radio' and @value='NO']",
      "Opción NO para materiales",
      60000
    );

    await global.driver.executeScript("arguments[0].click();", noRadio);
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Finish']"
    );
    await global.driver.sleep(4000);

    await global.helper.safeFindAndClick(
      "//a[contains(@title,'Home') or normalize-space()='Home']"
    );

    await global.helper.findOrFail(
      "//button[contains(@class,'fc-next-button')]",
      "Ir a siguiente semana"
    );

    const nextCalendarBtn = await global.helper.findOrFail(
      "//button[contains(@class,'fc-next-button')]",
      "Ir a siguiente semana"
    );

    let weeksWithEvents = 0;

    for (let i = 0; i < 6; i++) {
      const events = await global.driver.findElements(
        By.xpath("//a[contains(@class,'fc-time-grid-event')]")
      );

      if (events.length > 0) weeksWithEvents++;

      await nextCalendarBtn.click();
      await global.driver.sleep(1200);
    }

    assert.strictEqual(weeksWithEvents, 5);
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
