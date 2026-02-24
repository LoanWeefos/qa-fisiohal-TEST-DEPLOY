const assert = require("assert");
const { By, until, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC11 — Validar existencia de Tipo de terapia vía búsqueda", function () {
  this.timeout(0);

  const EXPECTED_THERAPIES = [
    "e otros",
    "e cadera",
    "e rodilla",
    "e tobillo",
    "e hombro",
    "e codo",
    "e mano",
    "e columna",
    "e rehabilitacion deportiva",
    "e neurorehabilitacion adultos",
    "e neurorehabilitacion pediatrica",
    "e drenaje linfatico",
    "e hidroterapia",
    "e deglucion",
    "e lenguaje",
    "e cognitivo",
    "e acompanamiento terapeutico",
    "e pilates",
    "e pulmonar",
    "e cardiopulmonar",
    "e neurac",
    "e piso pelvico",
    "e high tech room",
    "e atm",
    "e paralisis facial",
    "e cortesias",
    "e estetica",
    "e oncologico",
    "e geriatria",
  ];

  const normalize = (text = "") =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC11 de 11\n");
    }

    await global.helper.goToAccounts();
    await global.helper.safeFindAndClick(
      "//a[@role='button' and @title='New']",
      "Botón New Account - Debe hacer clic en el botón New para abrir el formulario de creación de cuenta"
    );
    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cuenta Externa']/ancestor::label",
      "Opción Cuenta Externa - Debe seleccionar la opción 'Cuenta Externa' al crear una nueva cuenta"
    );
    await global.helper.safeFindAndClick(
      "//button[.//span[normalize-space()='Next']]",
      "Botón Next - Debe hacer clic en el botón Next para avanzar al formulario de creación de cuenta"
    );
  });

  it("Debe encontrar terapias de Externo y no mostrar hospitalización", async () => {
    const input = await global.helper.findOrFail(
      "//input[@role='combobox' and @aria-label='Terapia de interés']",
      "Input Terapia de interés - Debe encontrar el campo de búsqueda para Terapia de interés en el formulario de cuenta externa"
    );

    const faltantes = [];
    const encontradosIndebidos = [];

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      input
    );

    for (const therapy of EXPECTED_THERAPIES) {
      const search = normalize(therapy);

      await global.driver.executeScript(
        "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input')); arguments[0].dispatchEvent(new Event('change'));",
        input
      );

      await input.sendKeys(search);
      await global.driver.sleep(600);

      const results = await global.driver.findElements(
        By.xpath("//lightning-base-combobox-item[@role='option']")
      );

      let found = false;

      for (const r of results) {
        const text = normalize(await r.getText());

        if (
          text &&
          !text.includes("new work type") &&
          !text.includes("show more") &&
          text.includes(search)
        ) {
          found = true;
          break;
        }
      }

      if (!found) {
        faltantes.push(therapy);
        console.error(`Terapia faltante: ${therapy}`);
      }
    }

    const FORBIDDEN_HOSPITALIZATION = [
      "h p",
      "h a",
      "h t",
      "h d",
      "h u",
      "h o",
      "h c",
      "h f",
      "h l",
      "h n",
    ];

    for (const searchRaw of FORBIDDEN_HOSPITALIZATION) {
      const search = normalize(searchRaw);

      await global.driver.executeScript(
        "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input')); arguments[0].dispatchEvent(new Event('change'));",
        input
      );

      await input.sendKeys(search);
      await global.driver.sleep(600);

      const results = await global.driver.findElements(
        By.xpath("//lightning-base-combobox-item[@role='option']")
      );

      for (const r of results) {
        const text = normalize(await r.getText());

        if (
          text &&
          !text.includes("new work type") &&
          !text.includes("show more") &&
          text.includes(search)
        ) {
          encontradosIndebidos.push(`${text}`);
          console.error(`Hospitalización encontrada: ${text}`);
        }
      }
    }

    assert.strictEqual(
      faltantes.length,
      0,
      `Terapias faltantes:\n- ${faltantes.join("\n- ")}`
    );

    assert.strictEqual(
      encontradosIndebidos.length,
      0,
      `Terapias de hospitalización no deberían aparecer:\n- ${encontradosIndebidos.join(
        "\n- "
      )}`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
