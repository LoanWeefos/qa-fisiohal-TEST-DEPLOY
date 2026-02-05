const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC19 — Validar campo ¿Le gusta que le hablen de usted o de tú?", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC19 — Validar campo ¿Le gusta que le hablen de usted o de tú? | 19 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Comprobar elementos en el campo y solo elegir 1 elemento", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const hablarUstedSelect = await global.helper.findOrFail(
      "//select[@name='Le_gusta_que_le_hablen_de_usted']",
      "Campo ¿Le gusta que le hablen de usted?"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      hablarUstedSelect
    );
    await global.driver.sleep(400);

    const options = await hablarUstedSelect.findElements(By.xpath(".//option"));
    const opcionesUI = [];

    for (const opt of options) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") {
        opcionesUI.push(text);
      }
    }

    const opcionesEsperadas = ["Usted", "Tu"];

    assert.deepStrictEqual(
      opcionesUI.sort(),
      opcionesEsperadas.sort(),
      `Opciones incorrectas. Esperadas: ${opcionesEsperadas.join(
        ", "
      )} | Encontradas: ${opcionesUI.join(", ")}`
    );

    const opcionUsted = await global.helper.findOrFail(
      "//select[@name='Le_gusta_que_le_hablen_de_usted']/option[normalize-space()='Usted']",
      "Opción Usted"
    );

    await global.driver.executeScript(
      "arguments[0].selected = true; arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
      opcionUsted
    );
    await global.driver.sleep(300);

    let selectedValue = await hablarUstedSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "Usted",
      `No se seleccionó correctamente 'Usted'. Valor actual: ${selectedValue}`
    );

    const opcionTu = await global.helper.findOrFail(
      "//select[@name='Le_gusta_que_le_hablen_de_usted']/option[normalize-space()='Tu']",
      "Opción Tu"
    );

    await global.driver.executeScript(
      "arguments[0].selected = true; arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
      opcionTu
    );
    await global.driver.sleep(300);

    selectedValue = await hablarUstedSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "Tu",
      `No se seleccionó correctamente 'Tu'. Valor actual: ${selectedValue}`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});