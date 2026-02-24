const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

function normalizarError(err) {
  const msg = String(err?.message || err);

  if (
    msg.includes("no se encuentra") ||
    msg.includes("invalid session id") ||
    msg.includes("El elemento") ||
    msg.includes("no such window") ||
    msg.includes("Falló al hacer click")
  ) {
    return "No existe en lista";
  }
  return msg;
}

function getNextMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = (8 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);

  return {
    day: String(d.getDate()).padStart(2, "0"),
    monthLabel: d.toLocaleString("en-US", { month: "long" }),
    year: String(d.getFullYear()),
    iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`,
  };
}

const terapiaToTerritorio = {
  "H Fisica": "Piso 1",
  "H Ortopedia": "Piso 1",
  "H Deglucion": "Piso 1",
  "H Cognitiva": "Piso 1",
  "H Lenguaje": "Piso 1",
  "H Pulmonar": "Piso 1",
  "H Drenaje Linfatico": "Piso 1",
  "H Terapia Media Fisica": "Piso 1",
  "H Terapia Media Pulmonar": "Piso 1",
  "H Terapia Media Deglucion": "Piso 1",
  "H Neurorehabilitacion": "Piso 1",
  "H Acompañamiento Terapeutico": "Piso 1",

  "H Cunero Fisiologico": "Piso 2",

  "H CPM": "CPM",

  "H UCC Pulmonar": "UCC",
  "H UCC Fisica": "UCC",

  "H UCIN Neurodesarrollo": "UCIN",
  "H UCIN Pulmonar": "UCIN",
  "H UCIN Orofacial": "UCIN",

  "H UTIN Neurodesarrollo": "UTIN",
  "H UTIN Pulmonar": "UTIN",
  "H UTIN Orofacial": "UTIN",

  "H UTI Fisica": "UTI",
  "H UTI Pulmonar": "UTI",
  "H UTI Deglucion": "UTI",
  "H UTI Drenaje Linfatico": "UTI",
  "H UTI Lenguaje": "UTI",

  "H COE Pulmonar": "COE",
  "H COE Fisica": "COE",

  "H Urgencias Fisica": "URG",
  "H Urgencias Pulmonar": "URG",

  "H COVID Fisica": "COVID",
  "H COVID Pulmonar": "COVID",
  "H COVID Deglucion": "COVID",

  "H Oncologia": "ONCO",
  "H ONCO Pulmonar": "ONCO",
};

describe("TC36 — Validar Evaluación Terapéutica Hospitalización", function () {
  this.timeout(0);

  const patientName = "Test Durán";
  const results = [];

  const terapiasHospitalizacion = Object.keys(terapiaToTerritorio);
  const fecha = getNextMonday();

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC36 — Validar Evaluación Terapéutica Hospitalización | 36 de 36\n"
      );
    }

    await global.helper.goToAccount(patientName);
  });

  for (const terapia of terapiasHospitalizacion) {
    it(`Hospitalización → ${terapia}`, async () => {
      let status = "PASS";
      let encontrado = "";
      const territorio = terapiaToTerritorio[terapia];

      try {
        await global.helper.openCreateForm();

        await global.helper.selectFrequency("Del día");
        await global.helper.setDate(fecha.day, fecha.monthLabel, fecha.year);
        await global.helper.selectArea(territorio);
        await global.helper.selectTherapyAndAdd(terapia);

        const saveBtn = await global.helper.findOrFail(
          "//button[normalize-space()='Guardar']",
          "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita en el formulario de creación de citas de hospitalización"
        );

        await saveBtn.click();

        assert.ok(
          await global.helper.checkSuccessToast(),
          "No apareció toast de éxito"
        );

        await global.driver.navigate().refresh();
        await global.driver.sleep(1500);

        await global.helper.safeFindAndClick(
          "//a[@role='tab' and (normalize-space()='Citas' or @data-label='Citas')]",
          "Pestaña Citas - Debe existir una pestaña para acceder a las citas desde el detalle de la cuenta"
        );

        const row = await global.helper.findOrFail("//tbody/tr");
        const citaLink = await row.findElement(
          By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
        );

        await global.driver.executeScript("arguments[0].click();", citaLink);
        await global.driver.sleep(2500);

        const evalField = await global.helper.findOrFail(
          "//flexipage-field[@data-field-id='RecordEvaluacion_Terapeutica_cField']//lightning-formatted-text",
          "Evaluación Terapéutica - Debe existir un campo de evaluación terapéutica en el detalle de la cita"
        );

        encontrado = (await evalField.getText()).trim();

        if (encontrado !== "General") status = "FAIL";

        await global.helper.safeFindAndClick("(//button[@name='Delete'])[1]", "Botón Eliminar - Debe existir un botón para eliminar la cita creada en el detalle de la cita");
        await global.helper.safeFindAndClick(
          "//button[contains(@class,'forceActionButton')]//span[normalize-space()='Delete']/ancestor::button", "Confirmar eliminación - Debe existir un botón para confirmar la eliminación de la cita en el modal de confirmación"
        );

        await global.driver.sleep(1500);
        await global.helper.goToAccount(patientName);

        assert.strictEqual(
          encontrado,
          "General",
          `Terapia ${terapia} | Territorio ${territorio}`
        );
      } catch (e) {
        status = "ERROR";
        encontrado = normalizarError(e);
      }

      results.push({
        Terapia: terapia,
        Territorio: territorio,
        Esperado: "General",
        Encontrado: normalizarError(encontrado),
        Resultado: status,
      });
    });
  }

  after(async () => {
    try {
      console.table(results);

      const failed = results.filter((r) => r.Resultado !== "PASS");

      assert.strictEqual(
        failed.length,
        0,
        `Fallaron ${failed.length} terapias:\n` +
        failed
          .map(
            (f) =>
              `${f.Terapia} | Territorio: ${f.Territorio} | Encontrado: ${f.Encontrado}`
          )
          .join("\n")
      );
    } finally {
      await global.driver.quit();
    }
  });
});
