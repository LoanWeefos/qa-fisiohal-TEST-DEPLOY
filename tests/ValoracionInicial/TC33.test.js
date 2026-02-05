const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");
const path = require("path");

describe("TC33 — Validar campo Adjuntar archivo", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
    fileName: "test_receta",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC33 — Validar campo Adjuntar archivo | 33 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Se debe poder adjuntar un archivo y guardarse en la cuenta del paciente", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(2);

    const recetaSelect = await global.helper.findOrFail(
      "//select[@name='Cuenta_con_Receta_m_dica']",
      "Campo Cuenta con Receta médica"
    );

    await recetaSelect.findElement(
      By.xpath(".//option[normalize-space()='Si, adjuntar']")
    ).click();

    await global.driver.sleep(800);

    const fileInput = await global.helper.findOrFail(
      "//input[@type='file' and contains(@id,'input-file')]",
      "Input Adjuntar archivo"
    );

    const filePath = path.resolve(
      __dirname,
      "../../helpers/test_receta.txt"
    );

    await fileInput.sendKeys(filePath);

    await global.driver.sleep(1500);

    await global.driver.navigate().refresh();
    await global.driver.sleep(3000);

    await global.helper.goToAccountBySearch(expected.AccountName);

    await global.helper.goToFilesTab();

    const fileRow = await global.driver.findElements(
      By.xpath(`//span[@title='${expected.fileName}']`)
    );

    assert.ok(
      fileRow.length > 0,
      `El archivo "${expected.fileName}" no se encontró en Archivos`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});