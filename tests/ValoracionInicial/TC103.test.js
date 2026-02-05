const assert = require("assert");
const { By, Key, until } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC103 — Ingresar como secretaria valores correctos en los campos de cada sección del componente de valoración inicial", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  const softErrors = [];

  function softAssertEquals(label, actual, expected) {
    if ((actual || "").trim() !== (expected || "").trim()) {
      softErrors.push(
        `${label} | Esperado: "${expected}" | Actual: "${actual}"`
      );
    }
  }

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "sony_2105@yahoo.com.mx.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC103 — Ingresar como secretaria valores correctos en los campos de cada sección del componente de valoración inicial | 103 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Guardado de campos correctamente y visibilidad de los campos", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext();

    /** ===============================
     * FAMILIAR RESPONSABLE
     =============================== */
    await global.helper.fillInput(
      "Nombre_familiar_responsable",
      "JUAN PEREZ"
    );

    await global.helper.fillSelectByText(
      "Parentesco_pl",
      "Padre"
    );

    await global.helper.fillInput(
      "N_mero_de_tel_fono_familiar_responsable",
      "6621234567"
    );

    /** ===============================
    * PREFERENCIAS DEL PACIENTE
    =============================== */
    await global.helper.fillSelectByText(
      "Le_gusta_que_le_hablen_de_usted",
      "Usted"
    );

    await global.helper.fillInput(
      "C_mo_te_gusta_que_lo_te_llamen",
      "TEST"
    );

    await global.helper.fillSelectByText(
      "Idioma_de_preferencia",
      "Español"
    );

    await global.helper.fillComboboxByAriaLabel(
      "Elija la intensidad de la luz preferente",
      "Medio"
    );

    await global.helper.fillSelectByText(
      "Durante_su_terapia_Le_gustar_a_conversar",
      "Feliz de platicar"
    );

    await global.helper.fillSelectByText(
      "Durante_su_terapia_Le_gustar_a_escuchar_m_sica",
      "Si"
    );

    await global.helper.fillInput(
      "Indique_el_g_nero",
      "Rock"
    );

    await global.helper.fillInput(
      "Indique_al_artista",
      "Queen"
    );

    await global.helper.fillInput(
      "Indique_la_m_sica_ambiental",
      "Instrumental"
    );

    await global.helper.clickNext();

    /** ===============================
     * ANTECEDENTES MÉDICOS GENERALES
     =============================== */
    await global.helper.fillInput(
      "M_dico_tratante",
      "DR TEST"
    );

    await global.helper.fillInput(
      "Diagnostico_Motivo_Visita__c",
      "Dolor lumbar"
    );

    await global.helper.fillInput(
      "Padecimiento_Desde_Cuando__c",
      "1 semana"
    );

    await global.helper.fillSelectByText(
      "Cuenta_con_Receta_m_dica",
      "No"
    );

    await global.helper.fillSelectByText(
      "Alergias",
      "Si, Especificar"
    );

    await global.helper.fillInput(
      "Especificar_alergias",
      "TEST Alergia"
    );

    await global.helper.fillSelectByText(
      "Condiciones_m_dicas_previas",
      "Diabetes"
    );

    await global.helper.fillSelectByText(
      "Usted_usa_Marcapasos",
      "No"
    );

    await global.helper.fillSelectByText(
      "Usted_usa_Auxiliar_auditivo",
      "No"
    );

    await global.helper.fillComboboxByAriaLabel(
      "¿Cuenta con algún otro dispositivo médico?",
      "No"
    );

    await global.helper.fillSelectByText(
      "Actualmente_toma_alg_n_medicamento",
      "Si"
    );

    await global.helper.fillInput(
      "Nombre_del_medicamento",
      "TEST Medicamento"
    );

    await global.helper.clickNext();

    /** ===============================
     * ANTECEDENTES PERSONALES PATOLÓGICOS
     =============================== */
    await global.helper.fillSelectByText(
      "Alguna_vez_te_han_hecho_una_cirug_a",
      "Si"
    );

    await global.helper.fillInput(
      "Tipo_de_cirug_a_y_fecha",
      "Apendicectomía 2020"
    );

    await global.helper.fillSelectByText(
      "Tienes_alguna_enfermedad_con_la_que_naciste_cong_nita",
      "Si"
    );

    await global.helper.fillInput(
      "Enfermedad_cong_nita_cu_l",
      "Cardiopatía congénita"
    );

    await global.helper.fillSelectByText(
      "Tuviste_alguna_enfermedad_importante_cuando_eras_ni_o_o_ni_a",
      "Si"
    );

    await global.helper.fillInput(
      "Enfermedad_importante_en_la_infancia",
      "Varicela severa"
    );

    await global.helper.fillSelectByText(
      "Alguna_vez_te_han_hecho_una_transfusi_n_de_sangre",
      "Si"
    );

    await global.helper.fillInput(
      "Motivo_y_fecha_de_la_transfusi_n",
      "Anemia 2018"
    );

    await global.helper.fillSelectByText(
      "Has_tenido_alg_n_accidente_fuerte_o_un_golpe_importante_como_ca_das_choques_frac",
      "Si"
    );

    await global.helper.fillInput(
      "Cu_ntame_qu_pas_cu_ndo_fue_y_si_tuviste_alguna_secuela_o_tratamiento",
      "Choque automovilístico 2019 sin secuelas"
    );

    /** ===============================
     * ANTECEDENTES NO PATOLÓGICOS
     =============================== */
    await global.helper.fillSelectByText(
      "Fumas_actualmente_o_has_fumado_antes",
      "Si"
    );

    await global.helper.fillInput(
      "Cigarrillos_por_d_a_y_desde_cu_ndo",
      "3 diarios desde 2020"
    );

    await global.helper.fillSelectByText(
      "Tomas_bebidas_alcoh_licas",
      "Si"
    );

    await global.helper.fillInput(
      "Cantidad_y_frecuencia_de_alcohol",
      "2 cervezas fin de semana"
    );

    await global.helper.fillSelectByText(
      "Usas_alguna_droga_o_sustancia_recreativa_como_marihuana_coca_na_etc",
      "Si"
    );

    await global.helper.fillInput(
      "Uso_de_drogas_o_sustancias_recreativas",
      "Marihuana ocasional"
    );


    /** ===============================
     * ANTECEDENTES HEREDOFAMILIARES
     =============================== */
    await global.helper.fillSelectByText(
      "Alguien_en_tu_familia_ha_tenido_enfermedades_del_coraz_n_o_cardiovasculares_como",
      "Si"
    );

    await global.helper.fillInput(
      "Qu_tipo_de_enfermedad_Qu_familiar_la_tuvo",
      "Hipertensión - Padre"
    );

    await global.helper.fillSelectByText(
      "Hay_antecedentes_de_c_ncer_en_tu_familia",
      "Si"
    );

    await global.helper.fillInput(
      "Qu_tipo_de_c_ncer_Qu_familiar_lo_tuvo",
      "Cáncer de mama - Tía"
    );

    await global.helper.fillSelectByText(
      "Alg_n_familiar_ha_tenido_problemas_de_huesos_o_articulaciones_como_artritis_oste",
      "Si"
    );

    await global.helper.fillInput(
      "Qu_tipo_de_problema_Qu_familiar_lo_tuvo",
      "Artritis - Abuela"
    );

    await global.helper.fillSelectByText(
      "Alguien_en_tu_familia_tiene_problemas_hormonales_o_de_metabolismo_como_diabetes",
      "Si"
    );

    await global.helper.fillInput(
      "Qu_tipo_de_problema_Qu_familiar_la_tuvo",
      "Diabetes - Madre"
    );

    await global.helper.fillSelectByText(
      "Conoces_alguna_otra_enfermedad_importante_que_se_repita_en_tu_familia",
      "Si"
    );

    await global.helper.fillInput(
      "Cu_l_es_Qui_n_la_tiene_o_la_tuvo",
      "Hipotiroidismo - Hermana"
    );

    await global.helper.clickNext();

    /** ===============================
     * RIESGO DE CAÍDA
     =============================== */
    await global.helper.fillSelectByText(
      "Auxiliares_de_marcha",
      "Si"
    );

    await global.helper.fillSelectByText(
      "Especificar_Auxiliares_de_marcha",
      "Bastón"
    );

    const riesgoFields = [
      "Ha_sentido_recientemente_mareos_inestabilidad_o_dificultad_para_mantener_el_equi",
      "Est_tomando_alg_n_medicamento_que_le_cause_somnolencia_mareos_o_debilidad",
      "Siente_que_la_edad_ha_afectado_su_fuerza_equilibrio_o_capacidad_para_moverse_con",
      "Tiene_alguna_condici_n_o_lesi_n_que_le_dificulte_caminar_o_moverse_con_normalida",
      "Ha_experimentado_episodios_de_desorientaci_n_confusi_n_o_comportamientos_que_le",
      "Recientemente_le_han_realizado_estudios_o_procedimientos_card_acos_que_hayan_afe",
      "Si_est_embarazada_se_encuentra_en_las_ltimas_etapas_de_la_gestaci_n_y_ha_notado",
      "Tiene_dificultades_importantes_para_ver_incluso_con_el_uso_de_lentes",
      "Ha_pasado_largos_periodos_sin_comer_sintiendo_debilidad_o_mareo_al_ponerse_de_pi",
      "Ha_notado_que_al_levantarse_r_pidamente_de_una_silla_o_cama_siente_mareo_o_aturd",
      "Ha_estado_en_reposo_por_un_tiempo_prolongado_y_siente_que_ha_perdido_fuerza_para",
      "Suele_evitar_pedir_ayuda_para_levantarse_caminar_o_hacer_actividades_aunque_sien",
      "Ha_sufrido_alguna_ca_da_en_los_ltimos_seis_meses",
      "Ha_donado_sangre_recientemente_y_ha_sentido_debilidad_o_mareo_despu_s_del_proced"
    ];

    for (const name of riesgoFields) {
      await global.helper.fillSelectByText(name, "Si");
    }

    await global.helper.clickNext();

    /** ===============================
     * PADECIMIENTO ACTUAL
     =============================== */
    await global.helper.clickNext();

    /** =============================== 
     * DEPORTES Y HOBBIES
     =============================== */
    await global.helper.fillSelectByText(
      "Practica_alg_n_deporte_hobbie_o_realiza_alguna_actividad_recreativa_frecuente",
      "Si"
    );

    await global.helper.fillInput(
      "Deporte_hobbie_o_actividad_recreativa",
      "Fútbol"
    );

    await global.helper.fillSelectByText(
      "Este_deporte_o_actividad_ayuda_a_mejorar_su_padecimiento",
      "Si, mejora mi movilidad / dolor"
    );

    await global.helper.fillSelectByText(
      "Su_lesi_n_ha_afectado_la_pr_ctica_de_este_deporte_o_actividad",
      "Si, ahora es más difícil practicarlo"
    );

    await global.helper.clickNext();

    await global.helper.goToAccountBySearch(expected.AccountName);

    for (let i = 0; i < 10; i++) {
      await driver.executeScript("window.scrollBy(0, 700)");
      await driver.sleep(250);
    }

    softAssertEquals(
      "¿Le gusta que le hablen de usted?",
      await global.helper.getReadonlyValueByLabel("¿Le gusta que le hablen de usted?"),
      "Usted"
    );

    softAssertEquals(
      "¿Cómo te gusta que lo / te llamen?",
      await global.helper.getReadonlyValueByLabel("¿Cómo te gusta que lo / te llamen?"),
      "TEST"
    );

    softAssertEquals(
      "Idioma de preferencia",
      await global.helper.getReadonlyValueByLabel("Idioma de preferencia"),
      "Español"
    );

    softAssertEquals(
      "Intensidad luz",
      await global.helper.getReadonlyValueByLabel(
        "Elija la intensidad de la luz de su preferencia"
      ),
      "Medio"
    );

    softAssertEquals(
      "¿Le gustaría conversar?",
      await global.helper.getReadonlyValueByLabel("¿Le gustaría conversar?"),
      "Feliz de platicar"
    );

    softAssertEquals(
      "¿Le gustaría escuchar música?",
      await global.helper.getReadonlyValueByLabel("¿Le gustaría escuchar música?"),
      "Si"
    );

    softAssertEquals(
      "Indique Género",
      await global.helper.getReadonlyValueByLabel("Indique Género"),
      "Rock"
    );

    softAssertEquals(
      "Indique Artista",
      await global.helper.getReadonlyValueByLabel("Indique Artista"),
      "Queen"
    );

    softAssertEquals(
      "Música ambiental",
      await global.helper.getReadonlyValueByLabel("Música ambiental"),
      "Instrumental"
    );

    softAssertEquals(
      "Nombre familiar responsable",
      await global.helper.getReadonlyValueByLabel("Nombre familiar responsable"),
      "JUAN PEREZ"
    );

    softAssertEquals(
      "Parentesco",
      await global.helper.getReadonlyValueByLabel("Parentesco"),
      "Padre"
    );

    softAssertEquals(
      "Número de teléfono familiar responsable",
      await global.helper.getReadonlyValueByLabel("Número de teléfono familiar responsable"),
      "6621234567"
    );

    await global.driver.navigate().refresh();

    await global.helper.safeFindAndClick(
      "//lightning-button-menu//button[@title='More Tabs']",
      "Botón More Tabs"
    );

    await global.driver.sleep(500);

    await global.helper.safeFindAndClick(
      "//lightning-menu-item//span[normalize-space()='Expediente Clínico']",
      "Tab Expediente Clínico"
    );

    await global.driver.wait(
      until.elementLocated(
        By.xpath("//table//tr[@role='row']")
      ),
      15000,
      "No cargó la tabla de Expediente Clínico"
    );

    const rows = await global.driver.findElements(By.xpath("//tbody/tr"));
    assert.ok(rows.length > 0, "No hay expedientes");

    const firstRow = rows[0];
    const expLink = await firstRow.findElement(
      By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      expLink
    );
    await global.driver.sleep(3000);

    await global.driver.navigate().refresh();

    for (let i = 0; i < 10; i++) {
      await driver.executeScript("window.scrollBy(0, 700)");
      await driver.sleep(250);
    }

    // =============================
    // MÉDICOS GENERALES
    // =============================
    softAssertEquals("Médico tratante",
      await global.helper.getReadonlyValueByLabel("Médico tratante"),
      "DR TEST"
    );

    softAssertEquals("Diagnóstico o motivo de la visita",
      await global.helper.getReadonlyValueByLabel("Diagnóstico o motivo de la visita"),
      "Dolor lumbar"
    );

    softAssertEquals("Desde cuándo presenta el padecimiento",
      await global.helper.getReadonlyValueByLabel("Desde cuándo presenta el padecimiento"),
      "1 semana"
    );

    softAssertEquals("Cuenta con receta médica",
      await global.helper.getReadonlyValueByLabel("Cuenta con receta médica"),
      "No"
    );

    softAssertEquals("Alergias",
      await global.helper.getReadonlyValueByLabel("Alergias"),
      "Si, Especificar"
    );

    softAssertEquals("Especificar alergias",
      await global.helper.getReadonlyValueByLabel("Especificar alergias"),
      "TEST Alergia"
    );

    softAssertEquals("Condiciones médicas previas",
      await global.helper.getReadonlyValueByLabel("Condiciones médicas previas"),
      "Diabetes"
    );

    softAssertEquals("¿Usa Marcapasos o auxiliar auditivo?",
      await global.helper.getReadonlyValueByLabel("¿Usa Marcapasos o auxiliar auditivo?"),
      "No"
    );

    softAssertEquals("Otro dispositivo médico",
      await global.helper.getReadonlyValueByLabel("Otro dispositivo médico"),
      "No"
    );

    softAssertEquals("¿Está tomando algún medicamento?",
      await global.helper.getReadonlyValueByLabel("¿Está tomando algún medicamento"),
      "Si"
    );

    softAssertEquals("Nombre del medicamento",
      await global.helper.getReadonlyValueByLabel("Nombre del medicamento"),
      "TEST Medicamento"
    );

    // =============================
    // PERSONALES PATOLÓGICOS
    // =============================
    softAssertEquals("Alguna vez te han hecho una cirugía",
      await global.helper.getReadonlyValueByLabel("Alguna vez te han hecho una cirugía"),
      "Si"
    );

    softAssertEquals("Tipo de cirugía y fecha",
      await global.helper.getReadonlyValueByLabel("Tipo de cirugía y fecha"),
      "Apendicectomía 2020"
    );

    softAssertEquals("Enfermedad congénita",
      await global.helper.getReadonlyValueByLabel("Enfermedad congénita"),
      "Si"
    );

    softAssertEquals("Cuál enfermedad congénita",
      await global.helper.getReadonlyValueByLabel("Enfermedad congénita (cuál)"),
      "Cardiopatía congénita"
    );

    softAssertEquals("Enfermedad importante en la infancia",
      await global.helper.getReadonlyValueByLabel("Enfermedad importante en la infancia"),
      "Si"
    );

    softAssertEquals("Detalle enfermedad infancia",
      await global.helper.getReadonlyValueByLabel("Detalle enfermedad infancia"),
      "Varicela severa"
    );

    softAssertEquals("Transfusión de sangre",
      await global.helper.getReadonlyValueByLabel("Transfusión de sangre"),
      "Si"
    );

    softAssertEquals("Motivo y fecha de la transfusión",
      await global.helper.getReadonlyValueByLabel("Motivo y fecha de la transfusión"),
      "Anemia 2018"
    );

    softAssertEquals("Accidente o golpe importante",
      await global.helper.getReadonlyValueByLabel("Accidente o golpe importante"),
      "Si"
    );

    softAssertEquals("Detalle accidente",
      await global.helper.getReadonlyValueByLabel("Detalles del accidente"),
      "Choque automovilístico 2019 sin secuelas"
    );

    // =============================
    // NO PATOLÓGICOS
    // =============================
    softAssertEquals("Fuma actualmente o ha fumado",
      await global.helper.getReadonlyValueByLabel("Fuma actualmente o ha fumado"),
      "Si"
    );

    softAssertEquals("Cigarrillos por día y desde cuándo",
      await global.helper.getReadonlyValueByLabel("Cigarrillos por día y desde cuándo"),
      "3 diarios desde 2020"
    );

    softAssertEquals("Toma bebidas alcohólicas",
      await global.helper.getReadonlyValueByLabel("Toma bebidas alcohólicas"),
      "Si"
    );

    softAssertEquals("Cantidad y frecuencia de alcohol",
      await global.helper.getReadonlyValueByLabel("Cantidad y frecuencia de alcohol"),
      "2 cervezas fin de semana"
    );

    softAssertEquals("Uso de drogas o sustancias recreativas",
      await global.helper.getReadonlyValueByLabel("Uso de drogas o sustancias recreativas"),
      "Si"
    );

    softAssertEquals("Detalle uso drogas",
      await global.helper.getReadonlyValueByLabel("Sustancia y frecuencia de uso"),
      "Marihuana ocasional"
    );

    // =============================
    // HEREDOFAMILIARES
    // =============================
    softAssertEquals("Antecedentes familiares cardiovasculares",
      await global.helper.getReadonlyValueByLabel("Antecedentes familiares cardiovasculares"),
      "Si"
    );

    softAssertEquals("Qué tipo enfermedad cardiovascular",
      await global.helper.getReadonlyValueByLabel("Cardiovascular (tipo)"),
      "Hipertensión - Padre"
    );

    softAssertEquals("Antecedentes familiares de cáncer",
      await global.helper.getReadonlyValueByLabel("Antecedentes familiares de cáncer"),
      "Si"
    );

    softAssertEquals("Tipo cáncer familiar",
      await global.helper.getReadonlyValueByLabel("Cáncer (tipo)"),
      "Cáncer de mama - Tía"
    );

    softAssertEquals("Antecedentes familiares huesos",
      await global.helper.getReadonlyValueByLabel("Antecedentes familiares de huesos"),
      "Si"
    );

    softAssertEquals("Problema huesos familiar",
      await global.helper.getReadonlyValueByLabel("Huesos o articulaciones (tipo)"),
      "Artritis - Abuela"
    );

    softAssertEquals("Antecedentes hormonales/metabólicos",
      await global.helper.getReadonlyValueByLabel("Antecedentes hormonales/metabólicos"),
      "Si"
    );

    softAssertEquals("Problema metabólico familiar",
      await global.helper.getReadonlyValueByLabel("Hormonales o metabólicos (tipo)"),
      "Diabetes - Madre"
    );

    softAssertEquals("Otra enfermedad familiar importante",
      await global.helper.getReadonlyValueByLabel("Otra enfermedad familiar importante"),
      "Si"
    );

    softAssertEquals("Detalle otra enfermedad familiar",
      await global.helper.getReadonlyValueByLabel("Otra enfermedad familiar importante"),
      "Hipotiroidismo - Hermana"
    );

    // =============================
    // RIESGO CAÍDA
    // =============================
    softAssertEquals("Auxiliares de marcha",
      await global.helper.getReadonlyValueByLabel("Auxiliares de marcha"),
      "Si"
    );

    softAssertEquals("¿Ha sentido mareos?",
      await global.helper.getReadonlyValueByLabel("¿Ha sentido recientemente mareos, inesta"),
      "Si"
    );

    softAssertEquals("¿Está tomando medicamento que cause mareos?",
      await global.helper.getReadonlyValueByLabel("¿Está tomando algún medicamento que le c"),
      "Si"
    );

    softAssertEquals("¿Siente que la edad ha afectado?",
      await global.helper.getReadonlyValueByLabel("¿Siente que la edad ha afectado su fuerz"),
      "Si"
    );

    softAssertEquals("¿Tiene condición o lesión?",
      await global.helper.getReadonlyValueByLabel("¿Tiene alguna condición o lesión que le"),
      "Si"
    );

    softAssertEquals("¿Ha experimentado desorientación?",
      await global.helper.getReadonlyValueByLabel("¿Ha experimentado episodios de desorient"),
      "Si"
    );

    softAssertEquals("Procedimientos cardíacos recientes",
      await global.helper.getReadonlyValueByLabel("¿Recientemente le han realizado estudios"),
      "Si"
    );

    softAssertEquals("¿Tiene dificultades importantes para ver?",
      await global.helper.getReadonlyValueByLabel("¿Tiene dificultades importantes para ver"),
      "Si"
    );

    softAssertEquals("¿Ha sufrido alguna caída últimos meses?",
      await global.helper.getReadonlyValueByLabel("¿Ha sufrido alguna caída en los últimos"),
      "Si"
    );

    // =============================
    // DEPORTES
    // =============================
    softAssertEquals("Practica deporte",
      await global.helper.getReadonlyValueByLabel("Practica algún deporte frecuentemente"),
      "Si"
    );

    softAssertEquals("Deporte",
      await global.helper.getReadonlyValueByLabel("Deporte hobbie o actividad recreativa"),
      "Fútbol"
    );

    softAssertEquals("Mejora padecimiento",
      await global.helper.getReadonlyValueByLabel("Actividad ayuda a mejorar"),
      "Si, mejora mi movilidad / dolor"
    );

    softAssertEquals("Lesión afecta práctica",
      await global.helper.getReadonlyValueByLabel("Lesión afecta la actividad"),
      "Si, ahora es más difícil practicarlo"
    );

    await global.helper.assertNoMissingFields(softErrors);
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});