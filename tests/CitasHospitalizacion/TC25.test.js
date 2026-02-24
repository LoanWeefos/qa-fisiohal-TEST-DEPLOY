const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC25 — Validar doble click en Guardar (Work Order única)", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
    Area: "Piso 2",
    Therapy: "H Cunero Fisiologico",
    Day: "28",
    MonthLabel: "December",
    Year: "2026",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC25 — Validar doble click en Guardar | 25 de 36\n"
      );
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe crear solo una Work Order aunque se haga doble click en Guardar", async () => {
    await global.helper.selectFrequency(expected.Frequency);
    await global.helper.setDate(
      expected.Day,
      expected.MonthLabel,
      expected.Year
    );
    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);

    const saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita en el formulario de creación de citas de hospitalización"
    );

    const isDisabled = await global.helper.isButtonDisabled(saveBtn);
    assert.strictEqual(isDisabled, false, "Guardar está deshabilitado.");

    await saveBtn.click();
    await global.driver.sleep(150);

    try {
      await saveBtn.click();
    } catch (e) {}

    await global.driver.navigate().refresh();
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick(
      "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
      "Pestaña Citas - Debe existir una pestaña para visualizar las citas en el formulario de creación de citas de hospitalización"
    );
    await global.driver.sleep(2500);

    const rows = await global.driver.findElements(By.xpath("//tbody/tr"));
    assert.ok(rows.length >= 1, "No se creó ninguna cita");

    async function getCitaDataFromRow(row) {
      const link = await row.findElement(
        By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
      );

      await global.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
        link
      );
      await global.driver.sleep(2500);

      const account = (
        await global.driver.findElements(
          By.xpath(
            "//flexipage-field[@data-field-id='RecordAccountIdField']//a//span"
          )
        )
      ).at(-1);
      const accountUI = (await account.getText()).trim();

      const therapyUI = (
        await global.driver.findElements(
          By.xpath(
            "//flexipage-field[@data-field-id='RecordTipo_de_Cita_cField']//a//span"
          )
        )
      ).at(-1);
      const therapy = (await therapyUI.getText()).trim();

      const territoryUI = (
        await global.driver.findElements(
          By.xpath(
            "//flexipage-field[@data-field-id='RecordServiceTerritoryIdField']//a//span"
          )
        )
      ).at(-1);
      const territory = (await territoryUI.getText()).trim();

      const startDate = await global.helper
        .findOrFail(
          "//flexipage-field[@data-field-id='RecordStartDateField']//lightning-formatted-text",
          "Fecha inicio - Debe existir un campo que muestre la fecha de inicio de la cita en el detalle de la cita creada"
        )
        .then((e) => e.getText());

      const endDate = await global.helper
        .findOrFail(
          "//flexipage-field[@data-field-id='RecordEndDateField']//lightning-formatted-text",
          "Fecha fin - Debe existir un campo que muestre la fecha de fin de la cita en el detalle de la cita creada"
        )
        .then((e) => e.getText());

      await global.helper.safeFindAndClick(
        "(//button[@name='Delete'])[1]",
        "Botón Delete - Debe existir un botón 'Delete' para eliminar la cita creada"
      );

      await global.helper.safeFindAndClick(
        "//button[contains(@class,'forceActionButton')]//span[normalize-space()='Delete']/ancestor::button",
        "Confirmar Delete - Debe existir un botón para confirmar la eliminación de la cita"
      );

      await global.driver.sleep(1500);

      return { accountUI, therapy, territory, startDate, endDate };
    }

    const cita1 = await getCitaDataFromRow(rows[0]);

    await global.driver.navigate().refresh();
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick(
      "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
      "Pestaña Citas - Debe existir una pestaña para visualizar las citas en el formulario de creación de citas de hospitalización"
    );
    await global.driver.sleep(2500);

    const rowsAgain = await global.driver.findElements(By.xpath("//tbody/tr"));

    if (rowsAgain.length > 1) {
      const cita2 = await getCitaDataFromRow(rowsAgain[0]);

      const duplicated =
        cita1.accountUI === cita2.accountUI &&
        cita1.therapy === cita2.therapy &&
        cita1.territory === cita2.territory;

      logger.info(
        `Comparación de citas:
        cita1=${JSON.stringify(cita1)}
        cita2=${JSON.stringify(cita2)}
        duplicated=${duplicated}`
      );

      assert.strictEqual(
        duplicated,
        false,
        "Se detectó duplicación de cita por doble click en Guardar"
      );
    }
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
