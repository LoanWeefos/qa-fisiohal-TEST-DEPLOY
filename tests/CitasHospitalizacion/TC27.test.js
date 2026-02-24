//FLUJO DIFERENTE NO SE SELECCIONA HORA

const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC27 — Validar conflicto por hora", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
    Area: "Piso 1",
    Therapy: "H Ortopedia",
    Day: "29",
    MonthLabel: "December",
    Year: "2026",
    TaskSubject: "Error en registro de terapia",
  };

  const goToTasks = async () => {
    await global.helper.safeFindAndClick(
      "//button[contains(@title,'App Launcher')]",
      "Botón App Launcher - Debe existir un botón para abrir el App Launcher en la barra de navegación"
    );
    await global.driver.sleep(800);

    const searchInput = await global.helper.findOrFail(
      "//input[contains(@placeholder,'Search apps and items')]",
      "Input búsqueda App Launcher - Debe existir un campo de búsqueda para el App Launcher en la barra de navegación"
    );

    await searchInput.sendKeys("Tasks");
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//one-app-launcher-menu-item//span[normalize-space()='Tasks']",
      "App Tasks - Debe existir una opción para acceder a la app Tasks desde el App Launcher"
    );

    await global.driver.wait(
      until.elementLocated(By.xpath("//h1//span[contains(.,'Tasks')]")),
      10000
    );

    await global.driver.navigate().refresh();

    await global.helper.safeFindAndClick(
      "//button[contains(@title,'Select a List View')]", "Botón Select a List View - Debe existir un botón para seleccionar la vista de lista en la app Tasks"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//lightning-base-combobox-item//span[normalize-space()='Open Tasks']", "Open Tasks - Debe existir una opción para seleccionar la vista Open Tasks en la app Tasks"
    );

    await global.driver.wait(
      until.elementLocated(
        By.xpath("//h1//span[normalize-space()='Open Tasks']")
      ),
      10000
    );
  };

  const openFirstErrorTaskAndReadComments = async () => {
    const taskXpath = `(//a[contains(@class,'slds-split-view__list-item-action')]
      [.//span[normalize-space()='${expected.TaskSubject}']])[1]`;

    await global.driver.wait(until.elementLocated(By.xpath(taskXpath)), 10000);

    await global.helper.safeFindAndClick(taskXpath, "Tarea de error - Debe existir una tarea con asunto que contenga '" + expected.TaskSubject + "' en la lista de tareas abiertas");
    await global.driver.navigate().refresh();
    await global.driver.sleep(1000);

    const commentsXpath =
      "(//span[normalize-space()='Comments']" +
      "/ancestor::div[contains(@class,'slds-form-element')]" +
      "//span[contains(@class,'uiOutputTextArea')])[1]";

    const commentsEl = await global.helper.findOrFail(
      commentsXpath,
      "Campo Comments - Debe existir un campo de texto que muestre los comentarios de la tarea de error al abrirla"
    );

    return await commentsEl.getText();
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC27 — Validar conflicto por hora | 27 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe generar Task de error al intentar agendar terapia conflictiva", async () => {
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

    await saveBtn.click();
    await global.driver.sleep(3500);

    await goToTasks();

    const commentsText = await openFirstErrorTaskAndReadComments();

    const validErrors = [
      "Ya no existen horarios disponibles",
    ];

    assert.ok(
      validErrors.some((msg) => commentsText.includes(msg)),
      `Mensaje de error no esperado en Comments: ${commentsText}`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
