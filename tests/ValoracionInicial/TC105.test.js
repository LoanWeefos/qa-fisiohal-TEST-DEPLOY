const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC105 — Validar que se muestre la información llenada por el usuario de la valoración inicial", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  const softErrors = [];

  function softAssertEquals(label, actual, expected) {
    if ((actual || "").trim() !== (expected || "").trim()) {
      softErrors.push(
        `${label}\n  Esperado: "${expected}"\n  Actual:   "${actual}"`
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
      logger.info("\nEjecutando TC105 — Validar que se muestre la información llenada por el usuario de la valoración inicial | 105 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Debe mostrar todos los campos con los valores previamente capturados", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext();

    /* ===============================
    FAMILIAR RESPONSABLE
 =============================== */

    softAssertEquals(
      "Nombre familiar responsable",
      await global.helper.getInputValue("Nombre_familiar_responsable"),
      "JUAN PEREZ"
    );

    softAssertEquals(
      "Parentesco",
      await global.helper.getSelectText("Parentesco_pl"),
      "Padre"
    );

    softAssertEquals(
      "Teléfono familiar responsable",
      await global.helper.getInputValue("N_mero_de_tel_fono_familiar_responsable"),
      "6621234567"
    );

    /* ===============================
       PREFERENCIAS
    =============================== */

    softAssertEquals(
      "Trato",
      await global.helper.getSelectText("Le_gusta_que_le_hablen_de_usted"),
      "Usted"
    );

    softAssertEquals(
      "Sobrenombre",
      await global.helper.getInputValue("C_mo_te_gusta_que_lo_te_llamen"),
      "TEST"
    );

    softAssertEquals(
      "Idioma",
      await global.helper.getSelectText("Idioma_de_preferencia"),
      "Español"
    );

    softAssertEquals(
      "Intensidad luz",
      await global.helper.getComboboxTextByAriaLabel(
        "Elija la intensidad de la luz preferente"
      ),
      "Medio"
    );

    softAssertEquals(
      "Conversar",
      await global.helper.getSelectText(
        "Durante_su_terapia_Le_gustar_a_conversar"
      ),
      "Feliz de platicar"
    );

    softAssertEquals(
      "Escuchar música",
      await global.helper.getSelectText(
        "Durante_su_terapia_Le_gustar_a_escuchar_m_sica"
      ),
      "Si"
    );

    softAssertEquals(
      "Género musical",
      await global.helper.getInputValue("Indique_el_g_nero"),
      "Rock"
    );

    softAssertEquals(
      "Artista",
      await global.helper.getInputValue("Indique_al_artista"),
      "Queen"
    );

    softAssertEquals(
      "Música ambiental",
      await global.helper.getInputValue("Indique_la_m_sica_ambiental"),
      "Instrumental"
    );

    await global.helper.clickNext();

    /* ===============================
       MÉDICOS
    =============================== */

    softAssertEquals(
      "Médico tratante",
      await global.helper.getInputValue("M_dico_tratante"),
      "DR TEST"
    );

    softAssertEquals(
      "Diagnóstico",
      await global.helper.getInputValue("Diagnostico_Motivo_Visita__c"),
      "Dolor lumbar"
    );

    softAssertEquals(
      "Desde cuándo",
      await global.helper.getInputValue("Padecimiento_Desde_Cuando__c"),
      "1 semana"
    );

    softAssertEquals(
      "Receta médica",
      await global.helper.getSelectText("Cuenta_con_Receta_m_dica"),
      "No"
    );

    softAssertEquals(
      "Alergias",
      await global.helper.getSelectText("Alergias"),
      "Si, Especificar"
    );

    softAssertEquals(
      "Detalle alergias",
      await global.helper.getInputValue("Especificar_alergias"),
      "TEST Alergia"
    );

    softAssertEquals(
      "Condiciones previas",
      await global.helper.getSelectText("Condiciones_m_dicas_previas"),
      "Diabetes"
    );

    softAssertEquals(
      "Marcapasos",
      await global.helper.getSelectText("Usted_usa_Marcapasos"),
      "No"
    );

    softAssertEquals(
      "Auxiliar auditivo",
      await global.helper.getSelectText("Usted_usa_Auxiliar_auditivo"),
      "No"
    );

    softAssertEquals(
      "Otro dispositivo",
      await global.helper.getComboboxTextByAriaLabel(
        "¿Cuenta con algún otro dispositivo médico?"
      ),
      "No"
    );

    softAssertEquals(
      "Toma medicamento",
      await global.helper.getSelectText("Actualmente_toma_alg_n_medicamento"),
      "Si"
    );

    softAssertEquals(
      "Nombre medicamento",
      await global.helper.getInputValue("Nombre_del_medicamento"),
      "TEST Medicamento"
    );

    await global.helper.clickNext();

    /* ===============================
       PATOLOGICOS
    =============================== */

    softAssertEquals(
      "Cirugía",
      await global.helper.getSelectText("Alguna_vez_te_han_hecho_una_cirug_a"),
      "Si"
    );

    softAssertEquals(
      "Tipo cirugía",
      await global.helper.getInputValue("Tipo_de_cirug_a_y_fecha"),
      "Apendicectomía 2020"
    );

    softAssertEquals(
      "Congénita",
      await global.helper.getSelectText(
        "Tienes_alguna_enfermedad_con_la_que_naciste_cong_nita"
      ),
      "Si"
    );

    softAssertEquals(
      "Congénita detalle",
      await global.helper.getInputValue("Enfermedad_cong_nita_cu_l"),
      "Cardiopatía congénita"
    );

    softAssertEquals(
      "Infancia",
      await global.helper.getSelectText(
        "Tuviste_alguna_enfermedad_importante_cuando_eras_ni_o_o_ni_a"
      ),
      "Si"
    );

    softAssertEquals(
      "Infancia detalle",
      await global.helper.getInputValue("Enfermedad_importante_en_la_infancia"),
      "Varicela severa"
    );

    softAssertEquals(
      "Transfusión",
      await global.helper.getSelectText(
        "Alguna_vez_te_han_hecho_una_transfusi_n_de_sangre"
      ),
      "Si"
    );

    softAssertEquals(
      "Transfusión detalle",
      await global.helper.getInputValue("Motivo_y_fecha_de_la_transfusi_n"),
      "Anemia 2018"
    );

    softAssertEquals(
      "Accidente",
      await global.helper.getSelectText(
        "Has_tenido_alg_n_accidente_fuerte_o_un_golpe_importante_como_ca_das_choques_frac"
      ),
      "Si"
    );

    softAssertEquals(
      "Accidente detalle",
      await global.helper.getInputValue(
        "Cu_ntame_qu_pas_cu_ndo_fue_y_si_tuviste_alguna_secuela_o_tratamiento"
      ),
      "Choque automovilístico 2019 sin secuelas"
    );

    /* ===============================
       NO PATOLOGICOS
    =============================== */

    softAssertEquals(
      "Fuma",
      await global.helper.getSelectText("Fumas_actualmente_o_has_fumado_antes"),
      "Si"
    );

    softAssertEquals(
      "Cigarrillos",
      await global.helper.getInputValue("Cigarrillos_por_d_a_y_desde_cu_ndo"),
      "3 diarios desde 2020"
    );

    softAssertEquals(
      "Alcohol",
      await global.helper.getSelectText("Tomas_bebidas_alcoh_licas"),
      "Si"
    );

    softAssertEquals(
      "Alcohol detalle",
      await global.helper.getInputValue("Cantidad_y_frecuencia_de_alcohol"),
      "2 cervezas fin de semana"
    );

    softAssertEquals(
      "Drogas",
      await global.helper.getSelectText(
        "Usas_alguna_droga_o_sustancia_recreativa_como_marihuana_coca_na_etc"
      ),
      "Si"
    );

    softAssertEquals(
      "Drogas detalle",
      await global.helper.getInputValue("Uso_de_drogas_o_sustancias_recreativas"),
      "Marihuana ocasional"
    );

    /* ===============================
       HEREDOFAMILIARES
    =============================== */

    softAssertEquals(
      "Cardio familiar",
      await global.helper.getSelectText(
        "Alguien_en_tu_familia_ha_tenido_enfermedades_del_coraz_n_o_cardiovasculares_como"
      ),
      "Si"
    );

    softAssertEquals(
      "Cardio detalle",
      await global.helper.getInputValue(
        "Qu_tipo_de_enfermedad_Qu_familiar_la_tuvo"
      ),
      "Hipertensión - Padre"
    );

    softAssertEquals(
      "Cancer familiar",
      await global.helper.getSelectText("Hay_antecedentes_de_c_ncer_en_tu_familia"),
      "Si"
    );

    softAssertEquals(
      "Cancer detalle",
      await global.helper.getInputValue(
        "Qu_tipo_de_c_ncer_Qu_familiar_lo_tuvo"
      ),
      "Cáncer de mama - Tía"
    );

    softAssertEquals(
      "Huesos",
      await global.helper.getSelectText(
        "Alg_n_familiar_ha_tenido_problemas_de_huesos_o_articulaciones_como_artritis_oste"
      ),
      "Si"
    );

    softAssertEquals(
      "Huesos detalle",
      await global.helper.getInputValue(
        "Qu_tipo_de_problema_Qu_familiar_lo_tuvo"
      ),
      "Artritis - Abuela"
    );

    softAssertEquals(
      "Metabolismo",
      await global.helper.getSelectText(
        "Alguien_en_tu_familia_tiene_problemas_hormonales_o_de_metabolismo_como_diabetes"
      ),
      "Si"
    );

    softAssertEquals(
      "Metabolismo detalle",
      await global.helper.getInputValue(
        "Qu_tipo_de_problema_Qu_familiar_la_tuvo"
      ),
      "Diabetes - Madre"
    );

    softAssertEquals(
      "Otra enfermedad",
      await global.helper.getSelectText(
        "Conoces_alguna_otra_enfermedad_importante_que_se_repita_en_tu_familia"
      ),
      "Si"
    );

    softAssertEquals(
      "Otra enfermedad detalle",
      await global.helper.getInputValue(
        "Cu_l_es_Qui_n_la_tiene_o_la_tuvo"
      ),
      "Hipotiroidismo - Hermana"
    );

    await global.helper.clickNext();

    /* ===============================
       RIESGO CAIDA
    =============================== */

    softAssertEquals(
      "Auxiliar marcha",
      await global.helper.getSelectText("Especificar_Auxiliares_de_marcha"),
      "Bastón"
    );

    const riesgoFields = [
      "Auxiliares_de_marcha",
      "Ha_sentido_recientemente_mareos_inestabilidad_o_dificultad_para_mantener_el_equi",
      "Est_tomando_alg_n_medicamento_que_le_cause_somnolencia_mareos_o_debilidad",
      "Siente_que_la_edad_ha_afectado_su_fuerza_equilibrio_o_capacidad_para_moverse_con",
      "Tiene_alguna_condici_n_o_lesi_n_que_le_dificulte_caminar_o_moverse_con_normalida",
      "Ha_experimentado_episodios_de_desorientaci_n_confusi_n_o_comportamientos_que_le",
      "Recientemente_le_han_realizado_estudios_o_procedimientos_card_acos_que_hayan_afe",
      "Tiene_dificultades_importantes_para_ver_incluso_con_el_uso_de_lentes",
      "Ha_sufrido_alguna_ca_da_en_los_ltimos_seis_meses"
    ];

    for (const f of riesgoFields) {
      softAssertEquals(
        `Riesgo caída ${f}`,
        await global.helper.getSelectText(f),
        "Si"
      );
    }

    await global.helper.clickNext();
    await global.helper.clickNext();

    /* ===============================
       DEPORTES
    =============================== */

    softAssertEquals(
      "Practica deporte",
      await global.helper.getSelectText(
        "Practica_alg_n_deporte_hobbie_o_realiza_alguna_actividad_recreativa_frecuente"
      ),
      "Si"
    );

    softAssertEquals(
      "Deporte",
      await global.helper.getInputValue("Deporte_hobbie_o_actividad_recreativa"),
      "Fútbol"
    );

    softAssertEquals(
      "Mejora",
      await global.helper.getSelectText(
        "Este_deporte_o_actividad_ayuda_a_mejorar_su_padecimiento"
      ),
      "Si, mejora mi movilidad / dolor"
    );

    softAssertEquals(
      "Afecta",
      await global.helper.getSelectText(
        "Su_lesi_n_ha_afectado_la_pr_ctica_de_este_deporte_o_actividad"
      ),
      "Si, ahora es más difícil practicarlo"
    );

    await global.helper.clickNext();
    
    await global.helper.assertNoMissingFields(softErrors);

  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});