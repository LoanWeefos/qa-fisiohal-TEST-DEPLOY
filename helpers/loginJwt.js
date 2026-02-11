const { Builder } = require("selenium-webdriver");
const edge = require("selenium-webdriver/edge");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const qs = require("querystring");
const logger = require("./logger");

const {
  CLIENT_ID,
  USERNAME,
  LOGIN_URL,
  PRIVATE_KEY_PATH,
} = require("./config");

const privateKey = process.env.SF_PRIVATE_KEY;

function createJwt(usernameOverride) {
  return jwt.sign(
    {
      iss: CLIENT_ID,
      sub: usernameOverride || USERNAME,
      aud: LOGIN_URL,
      exp: Math.floor(Date.now() / 1000) + 300,
    },
    privateKey,
    { algorithm: "RS256" }
  );
}


async function getAccessToken(usernameOverride) {
  const assertion = createJwt(usernameOverride);

  const response = await axios.post(
    `${LOGIN_URL}/services/oauth2/token`,
    qs.stringify({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return response.data;
}

async function loginJwt(retURL, usernameOverride = null) {
  const { access_token, instance_url } = await getAccessToken(usernameOverride);

  const loginUrl = retURL
    ? `${instance_url}/secur/frontdoor.jsp?sid=${access_token}&retURL=${retURL}`
    : `${instance_url}/secur/frontdoor.jsp?sid=${access_token}`;

  const options = new edge.Options();

  const isCI = process.env.CI === "true";
  
  options.addArguments(
    "--disable-popup-blocking",
    "--disable-infobars",
    "--log-level=3",
    "--silent"
  );
  
  if (isCI) {
    options.addArguments(
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1920,1080"
    );
  }

  const driver = await new Builder()
    .forBrowser("MicrosoftEdge")
    .setEdgeOptions(options)
    .build();

  await driver.get(loginUrl);

  await validarIdioma(driver);

  logger.info(
    `Login JWT exitoso como ${usernameOverride || USERNAME}`
  );

  return driver;
}

async function validarIdioma(driver) {

  await driver.wait(async () => {
    return await driver.executeScript(() => {
      return (
        window?.UserContext?.language ||
        (window?.$A && $A.get("$Locale.language"))
      );
    });
  }, 20000);

  const language = await driver.executeScript(() => {
    if (window?.UserContext?.language) {
      return window.UserContext.language;
    }

    if (window?.$A?.get) {
      return $A.get("$Locale.language");
    }

    return null;
  });

  logger.info(`Idioma detectado del usuario: ${language}`);

  if (!language || !language.startsWith("en")) {
    try { await driver.quit(); } catch (_) { }

    throw new Error(
      "La instancia debe estar en el idioma Inglés para correr los test"
    );
  }
}



module.exports = loginJwt;
