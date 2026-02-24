const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

const therapistShiftMap = {
  "alinn rivera": "matutino",
  "andrea severiano": "matutino",
  "bertha bahan": "matutino",
  "bruno espinosa": "vespertino",
  "bryan marquez": "intermedio 1",
  "cecilia ramirez": "matutino",
  "cynthia campos": "vespertino",
  "isis meneses": "vespertino",
  "ivonne garcia": "matutino",
  "jose carlos rodriguez": "vespertino",
  "jose luis salgado": "vespertino",
  "orlando gonzalez": "matutino",
  "sashiko yamamoto": "intermedio 2",
  "virgo jaramillo": "matutino",
  "daniela castro": "vespertino",
};

const shiftRanges = {
  matutino: ["08:00", "16:00"],
  vespertino: ["12:00", "20:00"],
  "intermedio 1": ["10:00", "18:00"],
  "intermedio 2": ["11:00", "19:00"],
  "turno completo": ["08:00", "20:00"],
};

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

describe("TC30 — Mostrar horarios asignados correctamente por terapeuta", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC30 — Mostrar horarios asignados correctamente por terapeuta | 30 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe mostrar el Next Availability dentro del turno asignado", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico - Debe existir la opción de terapia 'E Drenaje Linfatico' en el step Select Topic"
    );

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-text-heading_medium') and normalize-space()='Cubiculo B']",
      "Opción Cubiculo B - Debe existir el área 'Cubiculo B' en las opciones de áreas del step Select Service Territory"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    const tableXpath =
      "//div[contains(@class,'runtime_appointmentbookingFlowCandidate')]//tbody/tr";

    await global.helper.findOrFail(tableXpath, "Tabla de terapeutas - Debe existir una tabla de terapeutas en el step Select Candidate", 20000);

    const rows = await global.driver.findElements(By.xpath(tableXpath));
    assert.ok(rows.length > 0, "No se encontraron terapeutas en la tabla");

    for (const row of rows) {
      const nameCell = await row.findElement(
        By.xpath(".//th[@data-cell-value]")
      );

      const rawName = await nameCell.getAttribute("data-cell-value");
      const therapist = normalize(rawName);

      const shift = therapistShiftMap[therapist];

      if (!shift) {
        if (therapist.includes("jonathan ulises")) {
          continue;
        }
        assert.ok(false, `Terapeuta sin turno definido: ${rawName}`);
      }

      const availabilityCell = await row.findElement(
        By.xpath(".//td[@data-cell-value]")
      );

      const availabilityText = await availabilityCell.getAttribute(
        "data-cell-value"
      );

      const timeMatch = availabilityText.match(/(\d{2}:\d{2})$/);
      assert.ok(
        timeMatch,
        `No se pudo leer horario para ${rawName}: ${availabilityText}`
      );

      const time = timeMatch[1];

      const [start, end] = shiftRanges[shift];

      const timeMin = toMinutes(time);
      const startMin = toMinutes(start);
      const endMin = toMinutes(end);

      assert.ok(
        timeMin >= startMin && timeMin <= endMin,
        `Horario fuera de turno: ${rawName} → ${time} (Turno ${shift} ${start}-${end})`
      );
    }
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
