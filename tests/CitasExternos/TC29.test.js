const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC29 — Validar selección de 2 terapeutas", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC29 — Validar selección de 2 terapeutas | 29 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe deseleccionar el primer terapeuta al seleccionar el segundo", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico"
    );
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-text-heading_medium') and normalize-space()='Cubiculo B']",
      "Opción Cubiculo B"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1500);

    const tableXpath =
      "//div[contains(@class,'runtime_appointmentbookingFlowCandidate')]//table[contains(@class,'slds-table')]";

    await global.helper.findOrFail(tableXpath, "Tabla de terapeutas", 20000);

    const getRowByName = async (name) => {
      return await global.helper.findOrFail(
        `${tableXpath}//tr[.//th[normalize-space()='${name}']]`,
        "Fila de terapeuta " + name
      );
    };

    const clickRow = async (row) => {
      const radio = await row.findElement(By.xpath(".//input[@type='radio']"));
      await global.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
        radio
      );
    };

    const isSelected = async (row) => {
      const radio = await row.findElement(By.xpath(".//input[@type='radio']"));
      return await radio.isSelected();
    };

    const row1 = await getRowByName("Jose Carlos Rodriguez");
    const row2 = await getRowByName("Isis Meneses");

    await clickRow(row1);
    await global.driver.sleep(600);

    assert.strictEqual(
      await isSelected(row1),
      true,
      "No se seleccionó el primer terapeuta"
    );

    await clickRow(row2);
    await global.driver.sleep(600);

    assert.strictEqual(
      await isSelected(row1),
      false,
      "El primer terapeuta no se deseleccionó al seleccionar el segundo"
    );

    assert.strictEqual(
      await isSelected(row2),
      true,
      "No se seleccionó el segundo terapeuta"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
