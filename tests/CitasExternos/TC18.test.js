const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

describe("TC18 — Validar listado de terapias", function () {
  this.timeout(0);

  const expectedTherapies = [
    "E Otros",
    "E Cadera",
    "E Rodilla",
    "E Tobillo",
    "E Hombro",
    "E Codo",
    "E Mano",
    "E Columna",
    "E Rehabilitación Deportiva",
    "E Neurorehabilitación Adultos",
    "E Neurorehabilitación Pediatrica",
    "E Drenaje Linfatico",
    "E Hidroterapia",
    "E Deglución",
    "E Lenguaje",
    "E Cognitivo",
    "E Acompañamiento Terapeutico",
    "E Pilates",
    "E Pulmonar",
    "E Cardiopulmonar",
    "E Neurac",
    "E Piso Pelvico",
    "E High Tech Room",
    "E ATM",
    "E Paralisis Facial",
    "E Cortesias",
    "E Estetica",
    "E Oncologico",
    "E Cama Tracción",
    "E Axon",
    "E Geriatria",

    "H Acompañamiento Terapeutico",
    "H Coe Fisica",
    "H Coe Pulmonar",
    "H Cognitiva",
    "H Covid Deglucion",
    "H Covid Fisica",
    "H Covid Pulmonar",
    "H CPM",
    "H Cunero Fisiologico",
    "H Deglucion",
    "H Drenaje Linfatico",
    "H Fisica",
    "H Lenguaje",
    "H Neurorehabilitacion",
    "H Oncologia",
    "H Ortopedia",
    "H Pulmonar",
    "H Terapia Media Deglucion",
    "H Terapia Media Fisica",
    "H Terapia Media Pulmonar",
    "H UCC Fisica",
    "H UCC Pulmonar",
    "H UCIN Neurodesarrollo",
    "H UCIN Orofacial",
    "H UCIN Pulmonar",
    "H Urgencias Fisica",
    "H Urgencias Pulmonar",
    "H UTI Deglucion",
    "H UTI Drenaje Linfatico",
    "H UTI Fisica",
    "H UTI Pulmonar",
    "H UTIN Neurodesarrollo",
    "H UTIN Orofacial",
    "H UTIN Pulmonar",
  ].map(normalize);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC18 — Validar listado de terapias | 18 de 50\n");
    }
    await global.helper.goToAccount("TEST TEST");

    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe mostrar todas las terapias de externo", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1200);

    const cards = await global.driver.wait(
      until.elementsLocated(
        By.xpath("//span[contains(@class,'slds-text-heading_medium')]")
      ),
      15000
    );

    const uiTherapiesRaw = [];
    for (const card of cards) {
      uiTherapiesRaw.push(await card.getText());
    }

    const uiTherapies = uiTherapiesRaw.map(normalize);

    const faltantes = expectedTherapies.filter((t) => !uiTherapies.includes(t));

    const sobrantes = uiTherapies.filter((t) => !expectedTherapies.includes(t));

    const coinciden = uiTherapies.filter((t) => expectedTherapies.includes(t));

    console.log("\nFALTANTES (" + faltantes.length + "):");
    faltantes.forEach((t) => console.log(t));

    console.log("\nSOBRANTES (" + sobrantes.length + "):");
    sobrantes.forEach((t) => console.log(t));

    assert.strictEqual(
      faltantes.length === 0 && sobrantes.length === 0,
      true,
      `Diferencias en listado terapias | ` +
        `FALTANTES(${faltantes.length}): ${
          faltantes.length ? faltantes.join(", ") : "Ninguno"
        } | ` +
        `SOBRANTES(${sobrantes.length}): ${
          sobrantes.length ? sobrantes.join(", ") : "Ninguno"
        }`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
