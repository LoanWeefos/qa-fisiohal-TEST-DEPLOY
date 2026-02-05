const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

function normalizarError(err) {
  const msg = String(err?.message || err);

  if (
    msg.includes("no se encuentra") ||
    msg.includes("invalid session id") ||
    msg.includes("El elemento") ||
    msg.includes("no such window")
  ) {
    return "No existe en lista";
  }

  return msg;
}

describe("TC50 — Validar Evaluación Terapéutica por terapia", function () {
  this.timeout(0);

  const results = [];

  const terapiasEvaluacion = [
    { terapia: "E Otros", evaluacion: "Fisica" },
    { terapia: "E Cadera", evaluacion: "Fisica" },
    { terapia: "E Rodilla", evaluacion: "Fisica" },
    { terapia: "E Tobillo", evaluacion: "Fisica" },
    { terapia: "E Hombro", evaluacion: "Fisica" },
    { terapia: "E Codo", evaluacion: "Fisica" },
    { terapia: "E Mano", evaluacion: "Fisica" },
    { terapia: "E Columna", evaluacion: "Fisica" },
    { terapia: "E Rehabilitación Deportiva", evaluacion: "Fisica" },
    { terapia: "E Neurorehabilitación Adultos", evaluacion: "Neurologica" },
    { terapia: "E Neurorehabilitación Pediatrica", evaluacion: "Neurologica" },
    { terapia: "E Drenaje Linfatico", evaluacion: "Linfedema" },
    { terapia: "E Hidroterapia", evaluacion: "Fisica" },
    { terapia: "E Deglución", evaluacion: "Fisica" },
    { terapia: "E Lenguaje", evaluacion: "Fisica" },
    { terapia: "E Cognitivo", evaluacion: "Cognitiva" },
    { terapia: "E Acompañamiento Terapeutico", evaluacion: "Acompañamiento" },
    { terapia: "E Pilates", evaluacion: "Fisica" },
    { terapia: "E Pulmonar", evaluacion: "Pulmonar" },
    { terapia: "E Cardiopulmonar", evaluacion: "Pulmonar" },
    { terapia: "E Neuro", evaluacion: "Fisica" },
    { terapia: "E Piso Pelvico", evaluacion: "Fisica" },
    { terapia: "E High Tech Room", evaluacion: "Fisica" },
    { terapia: "E ATM", evaluacion: "Fisica" },
    { terapia: "E Paralisis Facial", evaluacion: "Fisica" },
    { terapia: "E Cortesias", evaluacion: "Fisica" },
    { terapia: "E Estetica", evaluacion: "Fisica" },
    { terapia: "E Oncologico", evaluacion: "Linfedema" },
    { terapia: "E Camara de Traccion", evaluacion: "Fisica" },
    { terapia: "E Axon", evaluacion: "Fisica" },
  ];

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC50 — Validar Evaluación Terapéutica por terapia | 50 de 50\n"
      );
    }

    await global.helper.goToAccount("TEST TEST");
  });

  for (const { terapia, evaluacion } of terapiasEvaluacion) {
    it(`Validar evaluación para ${terapia}`, async () => {
      let status = "PASS";
      let foundValue = "";

      try {
        await global.helper.safeFindAndClick(
          "//button[@name='Account.Agenda_Cita']",
          "Agendar Cita"
        );

        await global.helper.safeFindAndClick(
          "//button[normalize-space()='Next']"
        );

        const terapiaOption = await global.helper.findOrFail(
          `//span[contains(@class,'slds-visual-picker__figure')]//span[contains(text(),'${terapia}')]`,
          "Seleccionar terapia"
        );

        await global.driver.executeScript(
          "arguments[0].click();",
          terapiaOption
        );
        await global.helper.safeFindAndClick(
          "//button[normalize-space()='Next']"
        );

        await global.helper.safeFindAndClick(
          "(//div[contains(@class,'runtime_appointmentbookingFlowLocation')]//label)[3]"
        );

        await global.helper.safeFindAndClick(
          "//button[normalize-space()='Next']"
        );

        const therapistRadio = await global.helper.findOrFail(
          "(//tbody//input[@type='radio'])[1]",
          "Seleccionar primer terapeuta"
        );

        await global.driver.executeScript(
          "arguments[0].scrollIntoView({ block: 'center' }); arguments[0].click();",
          therapistRadio
        );

        await global.helper.safeFindAndClick(
          "//button[normalize-space()='Next']"
        );

        const slot = await global.helper.findOrFail(
          "(//span[contains(@class,'slds-radio_faux')])[last()]",
          "Seleccionar horario"
        );

        await global.driver.executeScript("arguments[0].click();", slot);
        await global.helper.safeFindAndClick(
          "//button[normalize-space()='Next']"
        );
        await global.helper.safeFindAndClick(
          "//button[normalize-space()='Next']"
        );
        await global.helper.safeFindAndClick(
          "//button[normalize-space()='Next']"
        );
        await global.helper.safeFindAndClick(
          "//button[normalize-space()='Finish']"
        );
        await global.driver.sleep(3000);

        await global.driver.navigate().refresh();
        await global.driver.sleep(1000);

        await global.helper.safeFindAndClick(
          "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
          "Pestaña Citas"
        );
        await global.driver.sleep(2500);

        const rows = await global.driver.findElements(By.xpath("//tbody/tr"));
        assert.ok(rows.length > 0, "No hay citas creadas");

        const firstRow = rows[0];
        const citaLink = await firstRow.findElement(
          By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
        );

        await global.driver.executeScript(
          "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
          citaLink
        );
        await global.driver.sleep(3000);

        const evalValue = await global.helper.findOrFail(
          "//flexipage-field[@data-field-id='RecordEvaluacion_Terapeutica_cField']//lightning-formatted-text",
          "Evaluación Terapéutica"
        );

        foundValue = (await evalValue.getText()).trim();

        if (foundValue !== evaluacion) status = "FAIL";

        await global.helper.safeFindAndClick(
          "(//button[@name='Delete'])[2]",
          "Botón Delete"
        );

        await global.helper.safeFindAndClick(
          "//button[contains(@class,'forceActionButton')]//span[normalize-space()='Delete']/ancestor::button",
          "Confirmar Delete"
        );

        await global.driver.sleep(1000);
        await global.driver.navigate().refresh();
        await global.driver.sleep(4000);

        await global.driver.sleep(2000);
        await global.helper.goToAccount("TEST TEST");

        assert.strictEqual(
          status,
          "PASS",
          `Para la terapia ${terapia}, se esperaba evaluación ${evaluacion} pero se encontró ${foundValue}`
        );
      } catch (e) {
        status = "ERROR";
        foundValue = normalizarError(e.message);
      }

      results.push({
        Terapia: terapia,
        Esperado: evaluacion,
        Encontrado: normalizarError(foundValue),
        Res: status,
      });
    });
  }

  after(async () => {
    try {
      console.table(results);

      const failed = results.filter((r) => r.Res !== "PASS");

      assert.strictEqual(
        failed.length,
        0,
        `Fallaron ${failed.length} terapias:\n` +
          failed
            .map(
              (f) =>
                `${f.Terapia} | Esperado: ${f.Esperado} | Encontrado: ${f.Encontrado}`
            )
            .join("\n")
      );
    } finally {
      if (!global.__runningAll && global.driver) {
        await global.driver.quit();
      }
    }
  });
});
