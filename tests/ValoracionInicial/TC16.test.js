const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC16 — Validar opciones del campo Parentesco", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "sony_2105@yahoo.com.mx.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC16 — Validar opciones del campo Parentesco | 16 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo muestra todos los valores correspondientes", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const parentescoSelect = await global.helper.findOrFail(
      "//select[@name='Parentesco_pl']",
      "Campo Parentesco - No se encuentra en el formulario"
    );

    const optionElements = await parentescoSelect.findElements(
      By.xpath(".//option")
    );

    const opcionesUI = [];
    for (const opt of optionElements) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") {
        opcionesUI.push(text);
      }
    }

    const opcionesEsperadas = [
      "Esposa",
      "Esposo",
      "Madre",
      "Padre",
      "Hermano",
      "Hijo",
      "Hija",
      "Otro",
    ];

    for (const esperado of opcionesEsperadas) {
      assert.ok(
        opcionesUI.includes(esperado),
        `No se encontró la opción "${esperado}" en el campo Parentesco. Opciones encontradas: ${opcionesUI.join(", ")}`
      );
    }

    assert.strictEqual(
      opcionesUI.length,
      opcionesEsperadas.length,
      `El número de opciones en Parentesco no coincide. Esperadas: ${opcionesEsperadas.length}, Encontradas: ${opcionesUI.length}`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
