const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC28 — Validar horarios por Territorio vs Médico", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
    Day: "29",
    MonthLabel: "December",
    Year: "2025",
    Area: "Piso 1",
    Therapy: "H Fisica",

    TaskSubject: "Error en registro de terapia",
  };

  const goToTasks = async () => {
    await global.helper.safeFindAndClick(
      "//button[contains(@title,'App Launcher')]",
      "Botón App Launcher"
    );
    await global.driver.sleep(800);

    const searchInput = await global.helper.findOrFail(
      "//input[contains(@placeholder,'Search apps and items')]",
      "Input búsqueda App Launcher"
    );

    await searchInput.sendKeys("Tasks");
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//one-app-launcher-menu-item//span[normalize-space()='Tasks']",
      "App Tasks"
    );

    await global.driver.wait(
      until.elementLocated(By.xpath("//h1//span[contains(.,'Tasks')]")),
      10000
    );

    await global.driver.navigate().refresh();

    await global.helper.safeFindAndClick(
      "//button[contains(@title,'Select a List View')]"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//lightning-base-combobox-item//span[normalize-space()='Open Tasks']"
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

    await global.helper.safeFindAndClick(taskXpath);
    await global.driver.navigate().refresh();
    await global.driver.sleep(1000);

    const commentsXpath =
      "(//span[normalize-space()='Comments']" +
      "/ancestor::div[contains(@class,'slds-form-element')]" +
      "//span[contains(@class,'uiOutputTextArea')])[1]";

    const commentsEl = await global.helper.findOrFail(
      commentsXpath,
      "Campo Comments"
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
      logger.info(
        "\nEjecutando TC28 — Validar horarios Territorio vs Médico | 28 de 36\n"
      );
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe no agendar cita y generar Task cuando no existen horarios disponibles", async () => {
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
      "Botón Guardar"
    );

    await saveBtn.click();
    await global.driver.sleep(3500);

    await goToTasks();

    const commentsText = await openFirstErrorTaskAndReadComments();

    logger.info(`Comments TC28: ${commentsText}`);

    assert.ok(
      commentsText.includes("Ya no existen horarios disponibles"),
      `Mensaje incorrecto en Comments: ${commentsText}`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
