const { By, until, Key } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const { allure } = require("allure-mocha/runtime");
const assert = require("assert");

class browser {
  constructor(driver) {
    this.driver = driver;
    this.missingFields = [];
  }

  _registerMissing(msg) {
    if (!this.missingFields) this.missingFields = [];
    this.missingFields.push(msg);
  }

  async takeErrorScreenshot(prefix = "error") {
    try {
      const baseDir = path.resolve(__dirname, "../screenshots");

      const cleanPrefix = String(prefix)
        .replace(/[^a-z0-9_\- ]/gi, "")
        .replace(/ /g, "_");

      const dir = path.join(baseDir, cleanPrefix);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");

      const fecha = `${pad(now.getDate())}-${pad(
        now.getMonth() + 1
      )}-${now.getFullYear()}`;
      const hora = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(
        now.getSeconds()
      )}`;

      const filename = `${prefix}_${fecha}_${hora}.png`;
      const fullPath = path.join(dir, filename);

      const base64 = await this.driver.takeScreenshot();
      fs.writeFileSync(fullPath, base64, "base64");
      logger.info(`Screenshot guardado: ${fullPath}`);

      allure.attachment(
        `Screenshot - ${prefix}`,
        Buffer.from(base64, "base64"),
        "image/png"
      );

      return fullPath;
    } catch (err) {
      logger.warn(`Error al tomar screenshot: ${err.message}`);
      throw new Error(err.message);
    }
  }

  async safeFindAndClick(xpath, label, timeout = 15000) {
    try {
      logger.debug(`Intentando click → ${xpath}`);

      const elementToClick = await this.driver.wait(
        until.elementLocated(By.xpath(xpath)),
        timeout
      );

      await this.driver.wait(until.elementIsVisible(elementToClick), timeout);
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        elementToClick
      );
      await this.driver.sleep(250);
      await this.driver.executeScript("arguments[0].click();", elementToClick);

      logger.info(`Click OK → ${xpath}`);
      await this.driver.sleep(300);
    } catch (err) {
      logger.error(`safeFindAndClick ERROR → ${xpath} | ${err.message}`);
      await this.takeErrorScreenshot("safeFindAndClick");
      throw new Error(`Falló al hacer click en ${label} - ${xpath}`);
    }
  }

  async checkWeHitASnag() {
    try {
      const dialog = await this.driver.wait(
        until.elementLocated(By.css("div[aria-label='We hit a snag.']")),
        4000
      );

      const list = await dialog.findElements(By.css(".errorsList li"));
      const errorMessages = [];

      for (const item of list) {
        errorMessages.push(await item.getText());
      }

      logger.warn(`Campos con error: ${errorMessages.join(", ")}`);

      const close = await dialog.findElement(
        By.css("button[title='Close error dialog']")
      );

      await close.click();
      await this.driver.sleep(300);

      return errorMessages;
    } catch (err) {
      const msg = err.message || "";

      const normal =
        msg.includes("no such element") ||
        msg.includes("Timeout") ||
        msg.includes("could not be located");

      if (normal) return [];

      logger.error(`Error REAL en checkWeHitASnag(): ${msg}`);
      await this.takeErrorScreenshot("checkWeHitASnag_error_real");
      return [`REAL ERROR: ${msg}`];
    }
  }

  async checkErrorToast(timeout = 5000) {
    try {
      const toast = await this.driver.wait(
        until.elementLocated(
          By.xpath(
            "//div[contains(@class,'slds-notify') and contains(@class,'toast') and contains(@class,'error')]"
          )
        ),
        timeout
      );

      return !!toast;
    } catch (err) {
      return false;
    }
  }

  async checkSuccessToast(timeout = 8000) {
    const xpath =
      "//div[contains(@class,'forceToastMessage')]//span[contains(@class,'toastMessage')]";

    try {
      const toast = await this.driver.wait(
        until.elementLocated(By.xpath(xpath)),
        timeout
      );

      await this.driver.wait(until.elementIsVisible(toast), timeout);

      const toastText = (await toast.getAttribute("innerText")).trim();

      logger.info(`Toast Salesforce: "${toastText}"`);

      return toastText;
    } catch {
      logger.warn("No se detectó toast dentro del tiempo asignado.");
      return "";
    }
  }

  async goToApp(appLabel = "FisioHal") {
    await this.safeFindAndClick(
      "//button[contains(@title,'App Launcher')]",
      "App Launcher"
    );
    await this.driver.sleep(600);

    const searchXpath =
      "//input[@type='search' and contains(@placeholder,'Search apps and items')]";

    const searchInput = await this.findOrFail(
      searchXpath,
      "Search App Launcher"
    );

    await searchInput.clear();
    await searchInput.sendKeys(appLabel);
    await this.driver.sleep(600);

    await this.safeFindAndClick(
      `//a[contains(@data-label,'${appLabel}')]`,
      `App ${appLabel}`
    );
    await this.driver.sleep(1000);
  }

  async closeAllConsoleTabsIfAny() {
    while (true) {
      await this.driver.sleep(3000);
      const closeButtons = await this.driver.findElements(
        By.xpath("//button[starts-with(@title,'Close ')]")
      );

      if (closeButtons.length === 0) {
        break;
      }

      try {
        await this.driver.executeScript(
          "arguments[0].click();",
          closeButtons[0]
        );
        await this.driver.sleep(500);
      } catch (e) {
        await this.driver.sleep(300);
      }
    }
  }

  async goToAccount(name) {
    await this.goToApp();
    await this.goToApp("Accounts");
    await this.closeAllConsoleTabsIfAny();

    await this.safeFindAndClick(
      "//a[contains(@title,'Accounts')]",
      "Tab Accounts"
    );
    await this.driver.sleep(1000);

    const row = `//table//a[normalize-space()='${name}']`;
    await this.safeFindAndClick(row, `Cuenta ${name}`);
    await this.driver.sleep(1200);
  }

  async openCreateForm() {
    const btn =
      "//button[contains(.,'Crear Citas Hospitalizacion') or contains(.,'Crear Citas Hospitalización')]";

    await this.safeFindAndClick(btn, "Botón Crear Citas Hospitalización");
    await this.driver.sleep(2000);
  }

  async isButtonDisabled(btn) {
    const isDisabled = await btn.getAttribute("disabled");
    const isAriaDisabled = await btn.getAttribute("aria-disabled");
    return isDisabled !== null || isAriaDisabled === "true";
  }

  async selectArea(area) {
    const areaXpath =
      "//label[contains(.,'Área de Atención')]/following::input[1]";

    await this.safeFindAndClick(areaXpath, "Campo Área de Atención");
    await this.driver.sleep(250);

    const areaInput = await global.driver.findElement(By.xpath(areaXpath));
    await areaInput.sendKeys(Key.CONTROL, "a");
    await this.driver.sleep(50);
    await areaInput.sendKeys(Key.BACK_SPACE);
    await this.driver.sleep(150);

    await areaInput.sendKeys(area);
    await this.driver.sleep(300);

    const areaOpt = `//lightning-base-combobox-item//span[@title='${area}']`;
    await this.safeFindAndClick(areaOpt, `Opción Área ${area}`);
    await this.driver.sleep(250);
  }

  async selectTherapyAndAdd(therapy) {
    await this.safeFindAndClick("//button[@name='therapy']", "Botón Terapia");
    await this.driver.sleep(250);

    const therapyOpt = `//lightning-base-combobox-item//span[@title='${therapy}']`;
    await this.safeFindAndClick(therapyOpt, `Opción Terapia ${therapy}`);
    await this.driver.sleep(250);

    const addBtn = await this.driver.findElement(
      By.xpath("//button[normalize-space()='Agregar']")
    );

    const disabled = await this.isButtonDisabled(addBtn);
    if (disabled) {
      throw new Error("El botón 'Agregar' está deshabilitado.");
    }

    await this.safeFindAndClick(
      "//button[normalize-space()='Agregar']",
      "Botón Agregar"
    );
    await this.driver.sleep(400);
  }

  async selectFrequency(value) {
    await this.safeFindAndClick(
      "//button[@name='Frequency']",
      "Botón Frecuencia"
    );
    await this.driver.sleep(250);

    const opt = `//lightning-base-combobox-item[@data-value='${value}'] | //span[normalize-space()='${value}']`;
    await this.safeFindAndClick(opt, `Opción Frecuencia ${value}`);
    await this.driver.sleep(250);
  }

  async setDate(day, monthLabel, year) {
    await this.safeFindAndClick(
      "//label[normalize-space()='Fecha']/following::input[1]",
      "Campo Fecha"
    );
    await this.driver.sleep(250);

    const yearCombo = await this.driver.findElement(
      By.xpath("//select[contains(@class,'slds-select')]")
    );
    await yearCombo.click();

    await this.safeFindAndClick(
      `//select[contains(@class,'slds-select')]/option[@value='${year}']`,
      `Año ${year}`
    );
    await this.driver.sleep(200);

    let visibleMonth = await this.driver
      .findElement(By.xpath("//lightning-calendar//h2"))
      .getText();

    let tries = 0;
    while (!visibleMonth.includes(monthLabel) && tries < 12) {
      await this.safeFindAndClick(
        "//button[@title='Next Month']",
        "Botón Mes Siguiente"
      );
      await this.driver.sleep(200);
      visibleMonth = await this.driver
        .findElement(By.xpath("//lightning-calendar//h2"))
        .getText();
      tries++;
    }

    const fixedMonth = monthLabel === "December" ? "12" : "01";
    const dayXpath = `//td[@data-value='${year}-${fixedMonth}-${String(
      day
    ).padStart(2, "0")}']`;

    let items = await this.driver.findElements(By.xpath(dayXpath));
    if (items.length === 0) {
      items = await this.driver.findElements(
        By.xpath(`//td/span[normalize-space()='${day}']`)
      );
    }

    if (items.length === 0) {
      throw new Error(
        `No se pudo seleccionar el día ${day} (${monthLabel} ${year})`
      );
    }

    await items[0].click();
    await this.driver.sleep(200);
  }

  async findOrFail(xpath, label, timeout = 15000) {
    try {
      const elementToFind = await this.driver.wait(
        until.elementLocated(By.xpath(xpath)),
        timeout
      );
      return elementToFind;
    } catch (e) {
      await this.takeErrorScreenshot(`not_found`);
      throw new assert.AssertionError({
        message: `El elemento no se encuentra ${label} - ${xpath}`,
        actual: "NO ENCONTRADO",
        expected: "ENCONTRADO",
        operator: "findOrFail",
      });
    }
  }

  async goToAccounts() {
    await this.goToApp();
    await this.goToApp("Accounts");
    await this.closeAllConsoleTabsIfAny();

    await this.safeFindAndClick(
      "//a[contains(@title,'Accounts')]",
      "Tab Accounts"
    );
    await this.driver.sleep(1000);
  }

  async clickNewAccount() {
    const newBtn = "//div[@role='toolbar']//button[normalize-space()='New']";
    await this.safeFindAndClick(newBtn, "Botón Nueva Cuenta");
    await this.driver.sleep(1000);
  }

  async fillInputByLabel(label, value) {
    const xpath = `//label[normalize-space()='${label}']/following::input[1]`;
    const input = await this.findOrFail(xpath, label);

    await input.clear();
    await this.driver.sleep(100);
    await input.sendKeys(value);
    await this.driver.sleep(200);
  }

  async saveForm() {
    const saveBtn =
      "//button[normalize-space()='Save' or normalize-space()='Guardar']";

    await this.safeFindAndClick(saveBtn, "Botón Guardar");
    await this.driver.sleep(1500);
  }

  async openFirstAppointment() {
    await this.driver.navigate().refresh();
    await this.driver.sleep(1500);
    await global.helper.closeSplitViewIfOpen();

    await this.safeFindAndClick(
      "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
      "Pestaña Citas"
    );
    await this.driver.sleep(2500);

    const rows = await this.driver.findElements(By.xpath("//tbody/tr"));
    if (!rows.length) {
      throw new Error("Este usuario no tiene citas agendadas.");
    }

    const firstRow = rows[0];
    const citaLink = await firstRow.findElement(
      By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
    );

    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      citaLink
    );
    await this.driver.sleep(3000);

    return { rowsCount: rows.length };
  }

  async goToAccountBySearch(accountName) {
    await this.goToApp();
    await this.closeAllConsoleTabsIfAny();

    await this.safeFindAndClick(
      "//button[contains(@class,'search-button') and @aria-label='Search']",
      "Botón Search"
    );

    const inputXpath =
      "//input[@type='search' and @placeholder='Search...' and contains(@class,'slds-input')]";

    const input = await this.driver.wait(
      until.elementLocated(By.xpath(inputXpath)),
      15000
    );
    await this.driver.wait(until.elementIsVisible(input), 15000);

    await input.sendKeys(accountName);

    const resultXpath = `//search_dialog-instant-result-item
    [.//span[@title='${accountName}']]
    [.//span[contains(normalize-space(.),'Account')]]`;

    const result = await this.driver.wait(
      until.elementLocated(By.xpath(resultXpath)),
      15000
    );
    await this.driver.wait(until.elementIsVisible(result), 15000);

    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      result
    );

    await this.driver.sleep(2000);
  }

  async goToFilesTab() {
    const directTab = await this.driver.findElements(
      By.xpath("//a[normalize-space()='Archivos']")
    );

    if (directTab.length > 0 && await directTab[0].isDisplayed()) {
      await directTab[0].click();
      await this.driver.sleep(1500);
      return;
    }

    const moreBtn = await this.findOrFail(
      "//button[@title='More Tabs' or .//span[text()='Tabs']]",
      "Botón More Tabs"
    );

    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      moreBtn
    );
    await moreBtn.click();
    await this.driver.sleep(800);

    const archivosMenu = await this.findOrFail(
      "//a[@role='menuitem']//span[normalize-space()='Archivos']",
      "Menú Archivos"
    );

    await archivosMenu.click();
    await this.driver.sleep(1500);
  }

  async clickNext(times = 1, delayMs = 800) {
    for (let i = 0; i < times; i++) {
      await this.safeFindAndClick("//button[normalize-space()='Next']", "Boton Next");
      await this.driver.sleep(delayMs);
    }
  }

  async fillInput(name, value, label = name) {
    const input = await this.findOptional(
      `//input[@name='${name}']`
    );

    if (!input) {
      this._registerMissing(`Input: ${label}`);
      return null;
    }

    try {
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        input
      );

      await this.driver.executeScript(
        "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",
        input
      );

      if (value !== null && value !== undefined) {
        await input.sendKeys(String(value));
      }
    } catch (e) { }

    return input;
  }

  async fillSelectByText(name, visibleText, label = name) {
    const select = await this.findOptional(
      `//select[@name='${name}']`
    );

    if (!select) {
      this._registerMissing(`Select: ${label}`);
      return null;
    }

    try {
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        select
      );

      await select.sendKeys(String(visibleText));
      await this.driver.sleep(250);
    } catch (e) { }

    return select;
  }

  async fillComboboxByAriaLabel(ariaLabel, optionText) {
    const btn = await this.findOptional(
      `//button[@role='combobox' and @aria-label="${ariaLabel}"]`
    );

    if (!btn) {
      this._registerMissing(`Combobox: ${ariaLabel}`);
      return null;
    }

    try {
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        btn
      );
      await btn.click();
      await this.driver.sleep(400);

      const opt = await this.findOptional(
        `//lightning-base-combobox-item[@role='option' and @data-value='${optionText}']`
      );

      if (!opt) {
        this._registerMissing(`Combobox option: ${ariaLabel} -> ${optionText}`);
        return null;
      }

      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        opt
      );
      await opt.click();
      await this.driver.sleep(300);
    } catch (e) { }
  }

  async getInputValue(name) {
    const input = await this.findOptional(
      `//input[@name='${name}']`
    );

    if (!input) {
      this._registerMissing(`Input: ${name}`);
      return "";
    }

    try {
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        input
      );
      await this.driver.sleep(200);
    } catch (e) { }

    return ((await input.getAttribute("value")) || "").trim();
  }


  async getSelectText(name) {
    const select = await this.findOptional(
      `//select[@name='${name}']`
    );

    if (!select) {
      this._registerMissing(`Select: ${name}`);
      return "";
    }

    try {
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        select
      );
      await this.driver.sleep(200);
    } catch (e) { }

    const value = await select.getAttribute("value");

    if (!value || value === "FlowImplicit__DefaultTextChoiceName") return "";

    const option = await select.findElement(
      By.xpath(`.//option[@value='${value}']`)
    );

    return (await option.getText()).trim();
  }


  async getComboboxTextByAriaLabel(ariaLabel) {
    const button = await this.findOptional(
      `//button[@role='combobox' and @aria-label='${ariaLabel}']`
    );

    if (!button) {
      this._registerMissing(`Combobox: ${ariaLabel}`);
      return "";
    }

    try {
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        button
      );
      await this.driver.sleep(200);
    } catch (e) { }

    const span = await button.findElement(
      By.xpath(".//span[contains(@class,'slds-truncate')]")
    );

    return (await span.getText()).trim();
  }

  assertNoMissingFields(softErrors) {
    if (this.missingFields.length > 0) {
      if (softErrors.length > 0) {
        throw new Error(
          "Campos no encontrados:\n" +
          this.missingFields.map(f => ` - ${f}`).join("\n") +
          "\n\nERRORES DE VALIDACIÓN:\n" +
          softErrors.map(e => "• " + e).join("\n")
        );
      } else {
        throw new Error(
          "Campos no encontrados:\n" +
          this.missingFields.map(f => ` - ${f}`).join("\n")
        );
      }
    }
  }

  async findOptional(xpath) {
    const els = await this.driver.findElements(By.xpath(xpath));
    return els.length > 0 ? els[0] : null;
  }

  async closeSplitViewIfOpen(timeout = 8000) {
    const toggleXpath =
      "//button[contains(@class,'slds-split-view__toggle-button') and contains(@class,'split-toggle')]";

    try {
      const btn = await this.driver.wait(
        until.elementLocated(By.xpath(toggleXpath)),
        timeout
      );

      await this.driver.wait(until.elementIsVisible(btn), timeout);

      const expanded = await btn.getAttribute("aria-expanded");

      if (expanded === "true") {
        await btn.click();

        await this.driver.wait(async () => {
          const v = await btn.getAttribute("aria-expanded");
          return v === "false";
        }, timeout);
        ;
      }
    } catch (err) {
      logger.warn(
        "No se encontró / no se pudo cerrar Split View (puede que no aplique en esta vista)"
      );
    }
  }

  async getReadonlyValueByLabel(label) {

    const xpath =
      `//span[normalize-space()='${label}']` +
      `/ancestor::div[contains(@class,'slds-form-element')]` +
      `//lightning-formatted-text`;

    const el = await this.findOptional(xpath);

    if (!el) {
      this._registerMissing(`Campo guardado no aparece en el objeto: ${label}`);
      return "";
    }

    try {
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        el
      );
      await this.driver.sleep(150);
    } catch (e) { }

    const txt = await this.driver.executeScript(
      "return arguments[0].innerText || arguments[0].textContent || ''",
      el
    );

    return (txt || "").trim();
  }

}


module.exports = browser;
