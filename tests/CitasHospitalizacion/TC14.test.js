const assert = require("assert");
const { By, Key } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC14 — Validar lista de frecuencias", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Allowed: ["Semanal", "Del día"],
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC14 — Validar lista de frecuencias | 14 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe mostrar únicamente 'Semanal' y 'Del día' en frecuencia", async () => {
    const freqBtn = await global.helper.findOrFail(
      "//button[@name='Frequency']",
      "Botón Frecuencia"
    );
    await freqBtn.click();
    await global.driver.sleep(400);

    const items = await global.driver.findElements(
      By.xpath("//lightning-base-combobox-item")
    );

    const labels = [];
    for (const it of items) {
      const t = (await it.getText()).trim();
      if (t) labels.push(t);
    }

    const unique = [...new Set(labels)];

    const allAreAllowed = unique.every((x) => expected.Allowed.includes(x));
    assert.strictEqual(
      allAreAllowed,
      true,
      `Frecuencias inesperadas: ${unique.join(", ")}`
    );

    assert.strictEqual(
      unique.length >= 2,
      true,
      "La lista de frecuencias no mostró suficientes opciones."
    );

    await global.driver.actions().sendKeys(Key.ESCAPE).perform();
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
