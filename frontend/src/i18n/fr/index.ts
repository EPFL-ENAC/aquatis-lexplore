export default {
    // --- Common ---
    backToHome: "Retour à l'accueil",
    back: 'Retour',
    live: 'LIVE',
    question: 'QUESTION',

    // --- 404 ---
    notFoundMessage: 'Oups, rien ici...',
    goHome: "Retour à l'accueil",

    // --- Header ---
    headerAirTemp: 'TEMP AIR',
    headerWaterTemp: 'TEMP EAU',
    headerWind: 'VENT',
    headerWave: 'VAGUE',

    // --- Home page ---
    homeEyebrow: 'BIENVENUE',
    homeTitle: 'Le Léman, en direct, sous tes yeux.',
    homeSubtitle:
        "Plonge à 100 mètres, suis le plancton heure par heure, et compare l'eau à l'air avec les données vraies de la plateforme scientifique Léxplore.",

    // --- Home nav cards ---
    homeLiveLabel: 'LIVE',
    homeLiveTitle: 'Plus de données en LIVE',
    homeLiveSubtitle: 'Température en profondeur, plancton, microalgues mesurés en direct.',
    homeDiscoveryLabel: 'DÉCOUVERTE',
    homeDiscoveryTitle: 'Découvre les changements du Léman',
    homeDiscoverySubtitle: "Comment l'eau, l'air, les vagues ont bougé ces 10 derniers jours.",
    homeGamesLabel: 'JEUX',
    homeGamesTitle: 'Deviens un Léxplorateur',
    homeGamesSubtitle:
        "L'aventure du plancton et Chaud-ou-Froid : deux jeux pour comprendre le lac.",

    // --- Live Data Picker ---
    livePickerEyebrow: '01 · LIVE',
    livePickerTitle: "Teste d'autres données en live!",
    livePickerSubtitle:
        'Choisis ce que tu veux observer dans le lac. Toutes les valeurs sont mesurées en ce moment par la plateforme Léxplore.',

    // --- Live Data nav ---
    liveNavTempDepth: 'Température en profondeur',
    liveNavTempDepthShort: 'Air → 100m',
    liveNavZooDepth: 'Profondeur du Zooplancton',
    liveNavZooDepthShort: 'Migration jour/nuit',
    liveNavAlgaeConc: 'Concentration des microalgues',

    // --- Temperature Over Depth (Live) ---
    tempDepthEyebrow: '01 · LIVE - Température en profondeur',
    tempDepthTitle: "Plus on descend, plus l'eau refroidit.",
    tempDepthAir: 'Air',
    tempDepthQ1: "Observes-tu une différence entre l'air et l'eau ?",
    tempDepthQ2: "Est-ce qu'il fait plus froid à 50 m ou à 100 m ?",

    // --- Zooplankton Depth (Live) ---
    zooDepthEyebrow: '01 · LIVE - Profondeur du Zooplancton',
    zooDepthTitle: 'Il monte la nuit, il descend le jour.',
    zooDepthSubtitle:
        'Le plancton animal bouge entre le fond et la surface pour manger et pour se cacher des poissons.',
    zooDepthQ1: 'À quelle profondeur vois-tu le plancton maintenant ?',

    // --- Algae Concentration (Live) ---
    algaeConcEyebrow: '01 · LIVE - Concentration des Microalgues',
    algaeConcTitle: 'Des forêts microscopiques.',
    algaeConcSubtitle:
        'Les microalgues du Léman sont appelées phytoplancton. La concentration grimpe en été, avec la lumière et la chaleur du soleil.',
    algaeConcQ1: 'À quelle profondeur la concentration de plancton est la plus haute ?',

    // --- Changes Picker ---
    changesPickerEyebrow: '02 · CHANGEMENTS',
    changesPickerTitle: 'Les changements dans le Léman',
    changesPickerSubtitle: 'Choisis ce que tu veux observer dans le lac.',

    // --- Changes nav ---
    changesNavWindTitle: "L'effet du vent sur le lac",
    changesNavWindShort: 'Vent',
    changesNavWindSubtitle:
        "Découvre comment le vent influence les mouvements de l'eau à la surface du Léman.",
    changesNavGrowthTitle: 'Est-ce que ça pousse?',
    changesNavGrowthShort: 'Croissance',
    changesNavGrowthSubtitle:
        'Observe comment la vie dans le lac évolue et si certains organismes se développent.',

    // --- Wind Change Page ---
    windChangeEyebrow: '02 · Découverte',
    windChangeTitle: "L'effet du vent sur le lac.",
    windChangeTrackAirTemp: "Température de l'air (°C)",
    windChangeTrackWaterTemp: "Température de l'eau (°C)",
    windChangeTrackWindDirection: 'Direction du vent',
    windChangeTrackWindSpeed: 'Vitesse du vent (km/h)', // TODO: Make sure this is km/h and not m/s
    windChangeTrackWaveHeight: 'Hauteur des vagues (m)',
    windChangeQ1: 'Observes-tu des changements ces derniers jours ?',
    windChangeQ2: "L'air est-il plus chaud ou plus froid que l'eau ?",

    // --- Chlorophyll Change Page ---
    chloroChangeEyebrow: '02 · Découverte',
    chloroChangeTitle: 'La lumière et la chlorophylle dans le lac.',
    chloroChangeTrackIrradiance: 'Irradiance',
    chloroChangeTrackAirTemp: "Température de l'air (°C)",
    chloroChangeTrackWaterTemp: "Température de l'eau (°C)",
    chloroChangeTrackChlorophyll: 'Chlorophylle A moyenne (0–20 m)',
    chloroChangeQ1: "Est-ce que l'eau se refroidit avec la pluie ?",
    chloroChangeQ2: "L'air est-il plus chaud ou plus froid que l'eau ?",

    // --- Game Picker ---
    gamePickerEyebrow: '03 · JEUX',
    gamePickerTitle: 'Jeu sur la vie dans le Léman',
    gamePickerSubtitle:
        'Choisis ce que tu veux observer dans le lac. Toutes les valeurs sont mesurées en ce moment par la plateforme Léxplore.',

    // --- Game nav ---
    gameNavPlanctonTitle: "L'aventure du Plancton",
    gameNavPlanctonShort: 'Migration jour/nuit',
    gameNavPlanctonSubtitle:
        'Suis le zooplancton qui monte et descend dans le lac, heure après heure.',
    gameNavTempTitle: 'Chaud ou Froid?',
    gameNavTempSubtitle:
        '3 mois de température, par profondeur. Trouve la zone qui ne se réchauffe jamais.',

    // --- Temperature Game ---
    tempGameEyebrow: '02 · Chaud ou Froid?',
    tempGameTitle: '2 ans de Léman, par profondeur.',
    tempGameSubtitle: 'Glisse sur la grille pour explorer.',
    tempGameProfileKicker: 'Au curseur → temp par profondeur',
    tempGameLoading: 'Chargement des températures…',
    tempGameQ1: 'Quelle est la période la plus chaude en profondeur?',
    tempGameQ2: "À quelle profondeur l'eau reste toujours plus froide que 10°C?",

    // --- Plankton Game ---
    planctonGameEyebrow: "01 · L'aventure du Plancton",
    planctonGameTitle: 'Bouge le curseur rouge.',
    planctonGameSubtitle: 'Observe le mouvement du zooplancton à travers la journée.',
    planctonGameQ1: "Est-ce qu'il est plus proche de la surface vers midi ou vers minuit ?",

    // --- Plots ---
    plotDepthProfileAria: 'Graphique de profil en profondeur',
    plotPlanktonAria: 'Profondeur du zooplancton',
    plotSurface: 'Surface',
    plotNoHeatmapData: 'Aucune donnée de carte thermique',
    plotDepthLabel: 'Profondeur',
    plotTemperatureLabel: 'Température',

    // --- PlotAppendix ---
    plotMeasuredOn: 'Mesuré le',
    plotLocation: 'Lac Léman',

    // --- QrCode ---
    qrLabel: 'En savoir plus',

    // --- Format fallbacks ---
    na: 'N/A',

    // --- Institutions ---
    instEawag: 'Eawag',
    instUnil: 'UNIL',
    instEpfl: 'EPFL',
    instUnige: 'Université de Genève',
    instCarrtel: 'CARRTEL',

    // --- PlanktonAdventurePlot depth labels ---
    planktonDepthSurface: 'Surface',
};
