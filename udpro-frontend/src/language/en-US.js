/**
 * description
 *
 * @author Baizhou Zhang zhangbz
 * @project SIMForms
 * @date 2023/10/19
 * @time 12:48
 */
export default {
    copyright1: 'Inst. AAA, S-Arch, SEU | Nanjing Digital Prosperity Co., LTD',
    copyright2: 'Nanjing SHUDING Technology Co., LTD',
    copyright3: 'Inst. AAA Studio, AESEU',
    info:'May 11 2024 - User signup & login.',
    author:'by B.Zhang, Y.Mo, B.Li, Y.Wang, C.Zhang, J.Shi',

    // global
    confirm: 'Confirm',
    cancel: 'Cancel',
    generate: 'Generate',
    save: 'Save',
    random: 'Random',
    logout: 'Logout',
    loginFirst:'Please login / signup first.',

    // global banner & hint
    init1: 'SIMForms connecting',
    init2: 'Please wait...',
    generatingPlots: 'Confirming site...',
    generatingModel: 'Generating model...',
    clearingScene: 'Clearing Scene...',

    waitRequest: 'Please wait until the latest request is processed.',
    unknownProblem: 'Unknown problem. Please try refreshing the page or contact the administrator.',
    invalidSite: 'Invalid or missing site. Please check and try again.',
    divisionFail: 'Failed to import. Please check your site and try again.',
    invalidParam: 'Invalid parameters. Please adjust and try again.',
    generateTimeout: 'Server time out. Please adjust the parameters and try again.',
    generateFailed: 'Failed to generate. Please try other parameters or refresh the page.',
    diffusionBusy: 'Server is busy. Please try again later.',
    diffusionFail: 'Unknown error. Please try again later or contact the administrator.',
    diffusionNetwork: 'Network Error. Please try generate again.',
    diffusionDownload: 'The image will download soon, please wait patiently!',
    clientTimeout1: 'You have been inactive for a while.',
    clientTimeout2: 'Server connection lost. Please refresh the page.',

    globalHint1:'Rotate: RMB',
    globalHint2:'Pan: Shift + RMB',
    globalHint3:'Zoom: Mouse Wheel',
    globalHint4:'Drag: LMB',

    rendererHint:'Adjust render box with sliders.',

    // side navi drawer
    appOptions: 'SIMForms Options',

    // 0 Manual book
    manualBookHint: 'You can always open manual book from here.',
    prev: 'Prev',
    next: 'Next',
    manual_book: 'SIMForms Manual Book',

    stepTitle0: 'Basic Operation',
    description01: '(1) Rotate -- RMB, Pan -- Shift+RMB, Zoom -- Mouse Wheel',
    description02: '(2) The manual book and language switch buttons are displayed in the upper right corner.',
    description03: '(3) The right side drawer is the parameter options and indicators display board.',
    stepTitle1: 'Site Settings',
    description11: '(1) You can choose to import the site file or customize a site by yourself, or experience the sample site directly.',
    description12: '(2) Confirmation is required after the site is set up. SIMForms will check the geometries of the site.',
    stepTitle2: 'Model Generator',
    description21: '(1) If multiple plots were imported, you can select between different bases through "LMB double-click".',
    description22: '(2) Select one style from the Style Database. Currently SIMForms offers a total of 23 styles including multi-level and high-rise buildings.',
    description23: '(3) After style selection, you can adjust the parameters in the side drawer and click "Generate" to get the 3D building model.',
    stepTitle3: 'AI Renderer',
    description31: '(1) You can choose the proper rendering angle in the 3D scene and open the render panel. SIMForms provides several camera parameters to set.',
    description32: '(2) Adjust the aspect ratio of the render image on the right, and a dashed preview box appears over the original scene.',
    description33: '(3) Select a base style in the middle menu and click "Generate". A few moments later you can get the generated concept image. Advanced parameters are provided for professional users.',
    description34: '(4) You can view and compare up to 5 renderings. You can choose your favorite pictures to download and save.',


    // site
    siteSettings: 'Site Settings',
    importSite: 'Import Options',
    edgeNum: 'Edge Num',
    confirmSite: 'Confirm Site',
    reassignSite: 'Reassign Site',

    // site dialog
    dialogTitle: 'Import Options',
    importMode: 'Open File',
    customMode: 'Start Sketching',
    templateMode: 'Try Sample Site',

    importTitle: 'File Upload',
    customTitle: 'Custom Sketching',
    importDesc1: '(1) Create a new layer named "simforms-site" in your site file and draw a closed site outline in this layer.',
    importDesc2: '(2) Clean up useless information and save it as a DXF format file with a size of no more than 5MB.',
    importDesc3: '(3) Or you can upload the plot division result from ANYSite application',
    customDesc1: '(1) Mouse drag control points to define the shape.',
    customDesc2: '(2) The number of control points can be set in the side menu.',
    customDesc3: '(3) Invalid cases such as small area or self-intersecting will not be imported.',

    // generator
    modelGenerator: 'Model Generator',
    openStyleBase: 'Open Style Database',
    redLineBack: 'Setback Distance',
    floorHeight: 'Storey Height',
    farExpect: 'FAR Expectation',

    // style base
    styleBaseTitle: 'Style Database',
    multiStorey: 'Multi-Storey Building Styles',
    highRise: 'High-Rise Building Styles',

    // AI renderer
    aiRenderer: 'AI Renderer',
    cameraPreset: 'Camera Preset',
    isometric: 'Isometric',
    cameraFOV: 'Camera FOV',
    openRenderPanel: 'Open AI Renderer Panel',

    // AI renderer panel
    aiPanelTitle: 'AI Render',
    emptyHint: 'Rendered image will show here...',
    baseStyle: 'Base Style',
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter',
    nature: 'Nature',
    minimalism: 'Minimalism',
    daytime: 'Daytime',
    nighttime: 'Nighttime',

    materials: 'Materials',
    concrete: 'Concrete',
    steel: 'Steel',
    wood: 'Wood',
    glass: 'Glass',

    scenePrev: 'Scene Preview',
    previewW: 'Preview W',
    previewH: 'Preview H',
    imageSize: 'Image Size (px)',

    advSettings: 'Advanced Settings',
    generateSeed: 'Generate Seed',
    samplingMethod: 'Sampling Methods',
    samplingSteps: 'Sampling Steps',
    conditionScale: 'Conditioning Scale',


    // Indicators board
    dataBoardTitle: 'Indicators Board',
    siteArea: 'Site Area',
    buildingHeight: 'Building Height',
    buildingDensity: 'Building Density',
    buildingAreaTotal: 'Total Building Area',
    far: 'FAR',
    surfaceArea: 'Surface Area',
    shapeCoeff: 'Shape Coefficient',
    southArea: 'South-facing Area',
}