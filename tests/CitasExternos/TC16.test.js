const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC16 — Validar Parent record solo admite account", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt("/lightning/o/Account/list?filterName=__Recent");
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC16 — Validar Parent record solo admite account | 16 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Solo debe mostrar Account en el combobox de Parent Record", async () => {
    const clearBtn = "//button[@title='Clear Parent Record Selection' and not(@disabled)]";

    await global.helper.safeFindAndClick(clearBtn, "Boton Clear Selection");
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick(
      "//button[@aria-label='Choose an object']",
      "Boton Choose an object"
    );
    await global.driver.sleep(500);

    const allItems = await global.driver.findElements(
      By.xpath("//div[@role='listbox']//lightning-base-combobox-item")
    );

    const allTitles = [];
    for (const item of allItems) {
      const title = await item
        .findElement(By.xpath(".//span[@title]"))
        .getAttribute("title");
      allTitles.push((title || "").trim());
    }

    const notAccount = allTitles.filter(
      (t) => t && t.toLowerCase() !== "account"
    );

    assert.strictEqual(
      notAccount.length,
      0,
      `ERROR: El selector muestra objetos distintos a Account: ${notAccount.join(
        ", "
      )}`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
