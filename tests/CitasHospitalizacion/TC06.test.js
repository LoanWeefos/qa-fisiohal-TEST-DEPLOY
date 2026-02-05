const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");


describe("TC06 — Terapias filtradas por Área de Atención", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Area: "Piso 1",
  };

  const expectedTherapies = [
    "H Fisica",
    "H Terapia Media Fisica",
    "H Ortopedia",
    "H Terapia Media Pulmonar",
    "H Drenaje Linfatico",
    "H Pulmonar",
    "H Deglucion",
    "H Lenguaje",
    "H Cognitiva",
    "H Neurorehabilitacion",
    "H Terapia Media Deglucion",
  ];

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC06 — Terapias filtradas por Área de Atención | 6 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe mostrar las terapias configuradas para Piso 1", async () => {
    const areaInputXpath =
      "//label[contains(.,'Área de Atención')]/following::input[1]";

    const areaInput = await global.helper.findOrFail(
      areaInputXpath,
      "Campo Área de Atención"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      areaInput
    );
    await areaInput.click();
    await global.driver.sleep(300);

    await areaInput.sendKeys(Key.CONTROL, "a");
    await global.driver.sleep(100);
    await areaInput.sendKeys(Key.BACK_SPACE);
    await global.driver.sleep(300);

    await areaInput.sendKeys("Piso 1");
    await areaInput.sendKeys(Key.SPACE);
    await global.driver.sleep(800);
    await areaInput.sendKeys(Key.BACK_SPACE);
    await global.driver.sleep(800);

    await global.driver.wait(
      async () =>
        (
          await global.driver.findElements(
            By.xpath("//lightning-base-combobox-item")
          )
        ).length > 0,
      7000
    );

    await global.helper
      .findOrFail(
        `//lightning-base-combobox-item//span[contains(@title,'Piso 1')]`,
        "Opción Área Piso 1"
      )
      .then((opcionArea) => opcionArea.click());

    await global.driver.sleep(400);

    await global.helper
      .findOrFail("//button[@name='therapy']", "Botón Terapia")
      .then((botonTerapia) => botonTerapia.click());

    await global.driver.sleep(400);

    await global.driver.wait(
      async () =>
        (
          await global.driver.findElements(
            By.xpath("//lightning-base-combobox-item")
          )
        ).length > 0,
      7000
    );

    const therapyList = await global.driver.findElements(
      By.xpath("//lightning-base-combobox-item")
    );

    const actualTherapies = [];

    for (const therapy of therapyList) {
      let name =
        (await therapy.getAttribute("title")) || (await therapy.getText());

      name = (name || "").trim();

      if (name.startsWith("H_")) {
        name = name.replace(/^H_/, "");
      }

      if (name) actualTherapies.push(name);
    }

    await global.driver.actions().sendKeys(Key.ESCAPE).perform();
    await global.driver.sleep(300);

    const expectedSorted = [...expectedTherapies].sort();
    const actualSorted = [...new Set(actualTherapies)].sort();

    assert.deepStrictEqual(actualSorted, expectedSorted);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
