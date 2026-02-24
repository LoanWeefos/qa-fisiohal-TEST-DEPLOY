const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC52 — Validar campo Cuéntame qué pasó, cuándo fue y si tuviste alguna secuela o tratamiento.", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC52 — Validar campo Cuéntame qué pasó, cuándo fue y si tuviste alguna secuela o tratamiento. | 52 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it(`Debe funcionar correctamente cuando se selecciona "Si"`, async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(3);

    const accidenteSelect = await global.helper.findOrFail(
      "//select[@name='Has_tenido_alg_n_accidente_fuerte_o_un_golpe_importante_como_ca_das_choques_frac']",
      "Campo ¿Has tenido algún accidente fuerte o un golpe importante? - No se encuentra en el formulario"
    );

    await accidenteSelect.sendKeys("No");
    await global.driver.sleep(300);

    let detalleAccidenteInput = await global.driver.findElements(
      By.xpath(
        "//input[@name='Cu_ntame_qu_pas_cu_ndo_fue_y_si_tuviste_alguna_secuela_o_tratamiento']"
      )
    );

    assert.strictEqual(
      detalleAccidenteInput.length,
      0,
      "El campo de detalle NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await accidenteSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await accidenteSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    detalleAccidenteInput = await global.driver.findElements(
      By.xpath(
        "//input[@name='Cu_ntame_qu_pas_cu_ndo_fue_y_si_tuviste_alguna_secuela_o_tratamiento']"
      )
    );

    assert.ok(
      detalleAccidenteInput.length > 0 &&
      (await detalleAccidenteInput[0].isDisplayed()),
      "El campo de detalle debería mostrarse al seleccionar 'Si'"
    );

    const input = detalleAccidenteInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(200);

    const textoValido = "Caída en escaleras con rehabilitación posterior";
    await input.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = await input.getAttribute("value");

    assert.strictEqual(
      valueUI,
      textoValido,
      "El campo no aceptó texto válido"
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(150);

    await input.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = await input.getAttribute("value");

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(150);

    await input.sendKeys("@#%");
    await global.driver.sleep(200);

    valueUI = await input.getAttribute("value");

    assert.ok(
      !/[^a-zA-ZÀ-ÿ\s]/.test(valueUI),
      `El campo permitió símbolos. Valor actual: "${valueUI}"`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});