/**
 * description
 *
 * @author Baizhou Zhang zhangbz
 * @project SIMForms
 * @date 2023/8/14
 * @time 17:43
 */
import {component} from "@inst-aaa/archiweb-core/src/components/component";
import {COLORS, DTID, FNID, LAYER, STID} from "./constantInfo";
import {identity_ud} from "@/sensitiveInfo";
import {CustomAlertFactory} from "./customAlertFactory";

const GuiEvents = function (
    archijson,
    viewport,
    siteImporter,
    volumeGenerator,
    diffusionRenderer
) {
    /* -------- events manager -------- */
    function addVGSelectionEvents() {
        viewport.dom.addEventListener('dblclick', vgDblClickEvent)
    }

    function removeVGSelectionEvents() {
        viewport.dom.removeEventListener('dblclick', vgDblClickEvent)
    }

    const vgDblClickEvent = (event) => {
        volumeGenerator.setSelect(event)
        if (volumeGenerator.getSelectionUpdate()) {
            updateVGParams(volumeGenerator.getParameters())
            updateDataBoardAll(volumeGenerator.getMetrics())
            volumeGenerator.setSelectionUpdate(false)
        }
    }

    /* -------- GUI items -------- */

    let guiItems = {
        // site importer
        [FNID.FN_START_SITE_IMPORT]: {
            type: 'button', label: "importSite", color: COLORS.SECONDARY, outlined: true,
            paramFunctionID: FNID.FN_START_SITE_IMPORT, disabled: false,
            icon: 'mdi-file-cog-outline',
            value: function () {
                component.DialogImportSite.copyIcon = 'mdi-content-copy'
                component.DialogImportSite.copyIconColor = 'gray'
                component.DialogImportSite.dialog = true
            }
        },
        [FNID.FN_IMPORT_MODE]: {
            type: 'button', label: "importMode", outlined: true,
            paramFunctionID: FNID.FN_IMPORT_MODE, disabled: false,
            icon: 'mdi-file-import-outline',
            value: function () {
                siteImporter.setSiteMode(0)
                siteImporter.setSiteTransDraggingChanged(false)
                updateGUI(FNID.FN_START_SITE_IMPORT)
                component.DialogImportSite.dialog = false

                siteImporter.importDXF()
                viewport.changeLayer(LAYER.LY_DEFAULT_VIEW)
            }
        },
        [FNID.FN_CUSTOM_MODE]: {
            type: 'button', label: "customMode", icon: 'mdi-draw',
            paramFunctionID: FNID.FN_CUSTOM_MODE,
            value: function () {
                siteImporter.setSiteTransDraggingChanged(false)
                siteImporter.setSiteMode(1)
                siteImporter.setSiteTransDraggingChanged(true)
                updateGUI(FNID.FN_CUSTOM_MODE)
                component.DialogImportSite.dialog = false

                siteImporter.generateSite()
                viewport.changeLayer(LAYER.LY_SITE_INTERACT)
            }
        },
        [FNID.FN_TEMPLATE_MODE]: {
            type: 'button', label: "templateMode", outlined: true,
            paramFunctionID: FNID.FN_TEMPLATE_MODE, disabled: false,
            icon: 'mdi-lightbulb-variant-outline',
            value: function () {
                siteImporter.setSiteMode(2)
                siteImporter.setSiteTransDraggingChanged(true)
                updateGUI(FNID.FN_START_SITE_IMPORT)
                component.DialogImportSite.dialog = false

                siteImporter.importTemplate()
                viewport.changeLayer(LAYER.LY_DEFAULT_VIEW)
            }
        },
        [FNID.FN_EDGE_NUM]: {
            type: 'slider', label: "edgeNum",
            paramFunctionID: FNID.FN_EDGE_NUM, disabled: false,
            value: 4, min: 3, max: 7, step: 1, ticks: 'always',
            onChange: function (val) {
                siteImporter.setSiteTransDraggingChanged(false)
                siteImporter.setSiteTransDraggingChanged(true)
                siteImporter.setEdgeNum(val)
                siteImporter.generateSite()
                viewport.changeLayer(LAYER.LY_SITE_INTERACT)
            }
        },
        [FNID.FN_CONFIRM_SITE]: {
            type: 'button', label: "confirmSite", color: COLORS.PRIMARY, outlined: false,
            paramFunctionID: FNID.FN_CONFIRM_SITE, disabled: false,
            icon: 'mdi-check',
            value: function () {
                guiEventReactor(FNID.FN_CONFIRM_SITE)
            }
        },
        [FNID.FN_REASSIGN_SITE]: {
            type: 'button', label: "reassignSite", color: COLORS.SECONDARY, outlined: true,
            paramFunctionID: FNID.FN_REASSIGN_SITE, disabled: false,
            icon: 'mdi-close',
            value: function () {
                component.OverlayProcessing.overlayBegin(2)
                siteImporter.setSiteMode(0)
                volumeGenerator.clearAllShapes()
                removeVGSelectionEvents()
                clearDataBoardAll()
                updateGUI(FNID.FN_REASSIGN_SITE)
                component.OverlayProcessing.overlayEnd()
            }
        },

        // volume generator
        [FNID.FN_STYLE_MENU]: {
            type: 'button', label: "openStyleBase", color: COLORS.SECONDARY, outlined: true,
            paramFunctionID: FNID.FN_STYLE_MENU, disabled: true,
            icon: 'mdi-database-cog-outline',
            value: function () {
                component.StyleMenu.openMenuDialog()
            }
        },
        [FNID.FN_STYLE_MENU_CONFIRM]: {
            type: 'button', label: "confirm", color: COLORS.SECONDARY, outlined: false,
            paramFunctionID: FNID.FN_STYLE_MENU_CONFIRM, disabled: false,
            icon: 'mdi-check',
            value: function () {
                component.StyleMenu.confirmSelect()
            }
        },
        [FNID.FN_STYLE_MENU_CANCEL]: {
            type: 'button', label: "cancel", outlined: false,
            paramFunctionID: FNID.FN_STYLE_MENU_CANCEL, disabled: false,
            icon: 'mdi-cancel',
            value: function () {
                component.StyleMenu.cancelSelect()
            }
        },
        [FNID.FN_REDLINE]: {
            type: 'slider', label: "redLineBack",
            paramFunctionID: FNID.FN_REDLINE, disabled: true,
            value: 7, min: 5, max: 20, step: 0.5, unit: "m",
            onChange: function (val) {
                volumeGenerator.setRedLineBack(val)
            }
        },
        [FNID.FN_FLOOR_DEPTH]: {
            type: 'slider', label: "floorHeight",
            paramFunctionID: FNID.FN_FLOOR_DEPTH, disabled: true,
            value: 4, min: 2.4, max: 6, step: 0.2, unit: "m",
            onChange: function (val) {
                volumeGenerator.setFloorDepth(val)
            }
        },
        [FNID.FN_FAR]: {
            type: 'slider', label: "farExpect",
            paramFunctionID: FNID.FN_FAR, disabled: true,
            value: 4, min: 0.5, max: 15, step: 0.5,
            onChange: function (val) {
                volumeGenerator.setFAR(val)
            }
        },
        [FNID.FN_GENERATE_VOLUMES]: {
            type: 'button', label: "generate", color: COLORS.PRIMARY, outlined: false, block: true,
            paramFunctionID: FNID.FN_GENERATE_VOLUMES, disabled: true,
            icon: 'mdi-city-variant-outline',
            value: function () {
                guiEventReactor(FNID.FN_GENERATE_VOLUMES)
            }
        },

        // diffusion renderer
        [FNID.FN_CAM_PRESET]: {
            type: 'slider', label: 'cameraPreset',
            paramFunctionID: FNID.FN_CAM_PRESET, disabled: true,
            value: 0, min: 0, max: 9, step: 1, ticks: 'always',
            onChange: function (val) {
                if (viewport.multiCamera.viewOp !== val) {
                    viewport.multiCamera.view[val](viewport.multiCamera.viewOp);
                    viewport.signals.optionChanged.dispatch();
                }
            }
        },
        [FNID.FN_CAM_ISOMETRIC]: {
            type: 'switch', label: "isometric",
            paramFunctionID: FNID.FN_CAM_ISOMETRIC, disabled: true,
            value: false,
            onChange: function (val) {
                if (val) viewport.multiCamera.toggleOrthographic();
                else viewport.multiCamera.togglePerspective();
                viewport.signals.optionChanged.dispatch();
            }
        },
        [FNID.FN_CAM_FOV]: {
            type: 'slider', label: "cameraFOV",
            paramFunctionID: FNID.FN_CAM_FOV, disabled: true,
            value: 45, min: 0, max: 90, step: 1,
            onChange: function (val) {
                viewport.multiCamera.setFov(val);
                viewport.signals.optionChanged.dispatch();
            }
        },
        [FNID.FN_OPEN_DIFFUSION_PANEL]: {
            type: 'button', label: "openRenderPanel", color: COLORS.PRIMARY, outlined: false, block: true,
            paramFunctionID: FNID.FN_OPEN_DIFFUSION_PANEL, disabled: true,
            icon: 'mdi-magic-staff',
            value: function () {
                diffusionRenderer.convertCurrentScreen()
                component.RenderWindow.openDiffusionDialog(
                    diffusionRenderer.getSceneData(),
                    diffusionRenderer.getValidSceneRatio()
                )
            }
        },
        [FNID.FN_PREVIEW_WIDTH]: {
            type: 'range slider', label: "previewW",
            paramFunctionID: FNID.FN_PREVIEW_WIDTH, disabled: false,
            value: [0, 1], min: 0, max: 1, step: 0.02,
            onChange: function (val) {
                diffusionRenderer.setPreviewWRange(val)
            }
        },
        [FNID.FN_PREVIEW_HEIGHT]: {
            type: 'range slider', label: "previewH",
            paramFunctionID: FNID.FN_PREVIEW_HEIGHT, disabled: false,
            value: [0, 1], min: 0, max: 1, step: 0.02,
            onChange: function (val) {
                diffusionRenderer.setPreviewHRange(val)
            }
        },
        [FNID.FN_IMG_SIZE]: {
            type: 'slider', label: 'imageSize',
            paramFunctionID: FNID.FN_IMG_SIZE, disabled: false,
            value: 5, min: 1, max: 7, step: 1, ticks: 'always',
            thumbLabel: 'always', thumbSize: 26,
            onChange: function (val) {
                diffusionRenderer.setImgSizeLevel(val)
            }
        },
        [FNID.FN_GENERATE_SEED]: {
            type: 'slider', label: "generateSeed",
            paramFunctionID: FNID.FN_GENERATE_SEED, disabled: false,
            value: -1, min: -1, max: 100, step: 1,
            onChange: function (val) {
                diffusionRenderer.setSeed(val)
            }
        },
        [FNID.FN_SAMPLING_METHOD]: {
            type: 'slider', label: 'samplingMethod',
            paramFunctionID: FNID.FN_SAMPLING_METHOD,
            value: 0, min: 0, max: 5, step: 1,
            ticks: true,
            onChange: function (val) {
                diffusionRenderer.setMethod(val)
            }
        },
        [FNID.FN_SAMPLING_STEPS]: {
            type: 'slider', label: "samplingSteps",
            paramFunctionID: FNID.FN_SAMPLING_STEPS, disabled: false,
            value: 20, min: 10, max: 50, step: 1,
            onChange: function (val) {
                diffusionRenderer.setSteps(val)
            }
        },
        [FNID.FN_CONDITIONING_SCALE]: {
            type: 'slider', label: "conditionScale",
            paramFunctionID: FNID.FN_CONDITIONING_SCALE, disabled: false,
            value: 0.95, min: 0, max: 2, step: 0.05,
            onChange: function (val) {
                diffusionRenderer.setScale(val)
            }
        },
        [FNID.FN_DIFF_PANEL_CONFIRM]: {
            type: 'button', label: "generate", outlined: false, color: COLORS.SECONDARY,
            paramFunctionID: FNID.FN_DIFF_PANEL_CONFIRM, disabled: false,
            icon: 'mdi-check',
            value: function () {
                guiEventReactor(FNID.FN_DIFF_PANEL_CONFIRM)
            }
        },
        [FNID.FN_DIFF_PANEL_CANCEL]: {
            type: 'button', label: "cancel", outlined: false,
            paramFunctionID: FNID.FN_DIFF_PANEL_CANCEL, disabled: false,
            icon: 'mdi-cancel',
            value: function () {
                component.RenderWindow.dialog = false
            }
        },
        [FNID.FN_DIFF_PANEL_DOWNLOAD]: {
            type: 'button', label: "Save Image", outlined: false,
            paramFunctionID: FNID.FN_DIFF_PANEL_DOWNLOAD, disabled: false,
            icon: 'mdi-download',
            value: function () {
                CustomAlertFactory.showAlertDiffusionDownload()
                component.RenderWindow.downloadCurrImg()
            }
        },
    }

    let dataDisplay = {
        [DTID.DT_SITE_AREA]: {label: 'siteArea', value: 0, unit: "㎡"},
        [DTID.DT_BUILDING_HEIGHT]: {label: 'buildingHeight', value: 0, unit: "m"},
        [DTID.DT_BUILDING_DENSITY]: {label: 'buildingDensity', value: 0, unit: ""},
        [DTID.DT_BUILDING_AREA_TOTAL]: {label: 'buildingAreaTotal', value: 0, unit: "㎡"},
        [DTID.DT_FAR]: {label: 'far', value: 0, unit: ""},
        [DTID.DT_SURFACE_AREA]: {label: 'surfaceArea', value: 0, unit: "㎡"},
        [DTID.DT_SHAPE_COEFFICIENT]: {label: 'shapeCoeff', value: 0, unit: ""},
        [DTID.DT_SOUTH_AREA]: {label: 'southArea', value: 0, unit: "㎡"},
    }

    /* -------- GUI updates -------- */

    /**
     * initialize GUI card
     */
    this.initGUI = function () {
        component.SideNaviDrawer.options = [
            {
                type: 'group',
                icon: 'mdi-selection-marker',
                label: 'siteSettings',
                active: false,
                items: [
                    guiItems[FNID.FN_START_SITE_IMPORT],
                    guiItems[FNID.FN_CONFIRM_SITE]
                ]
            },
            {
                type: 'group',
                icon: 'mdi-office-building-cog-outline',
                label: 'modelGenerator',
                active: false,
                items: [
                    guiItems[FNID.FN_STYLE_MENU],
                    guiItems[FNID.FN_REDLINE],
                    guiItems[FNID.FN_FLOOR_DEPTH],
                    guiItems[FNID.FN_FAR],
                    guiItems[FNID.FN_GENERATE_VOLUMES],
                ]
            },
            {
                type: 'group',
                icon: 'mdi-palette-outline',
                label: 'aiRenderer',
                active: false,
                items: [
                    guiItems[FNID.FN_CAM_PRESET],
                    guiItems[FNID.FN_CAM_ISOMETRIC],
                    guiItems[FNID.FN_CAM_FOV],
                    guiItems[FNID.FN_OPEN_DIFFUSION_PANEL],
                ]
            },
        ]

        component.SideNaviDrawer.dataBoard = [
            dataDisplay[DTID.DT_SITE_AREA],
            dataDisplay[DTID.DT_BUILDING_HEIGHT],
            dataDisplay[DTID.DT_BUILDING_DENSITY],
            dataDisplay[DTID.DT_BUILDING_AREA_TOTAL],
            dataDisplay[DTID.DT_FAR],
            dataDisplay[DTID.DT_SURFACE_AREA],
            dataDisplay[DTID.DT_SHAPE_COEFFICIENT],
            dataDisplay[DTID.DT_SOUTH_AREA],
        ]

        component.DialogImportSite.cardButtons = [
            guiItems[FNID.FN_IMPORT_MODE],
            guiItems[FNID.FN_CUSTOM_MODE],
        ]

        component.DialogImportSite.templateButton = guiItems[FNID.FN_TEMPLATE_MODE]

        component.StyleMenu.buttons = [
            guiItems[FNID.FN_STYLE_MENU_CONFIRM],
            guiItems[FNID.FN_STYLE_MENU_CANCEL],
        ]

        component.RenderWindow.imgSettings = [
            guiItems[FNID.FN_PREVIEW_WIDTH],
            guiItems[FNID.FN_PREVIEW_HEIGHT],
            guiItems[FNID.FN_IMG_SIZE],
        ]

        component.RenderWindow.advancedSettings = [
            guiItems[FNID.FN_GENERATE_SEED],
            guiItems[FNID.FN_SAMPLING_METHOD],
            guiItems[FNID.FN_SAMPLING_STEPS],
            guiItems[FNID.FN_CONDITIONING_SCALE],
        ]

        component.RenderWindow.buttons = [
            guiItems[FNID.FN_DIFF_PANEL_CONFIRM],
            guiItems[FNID.FN_DIFF_PANEL_CANCEL],
            guiItems[FNID.FN_DIFF_PANEL_DOWNLOAD],
        ]
    }

    /**
     * update GUI because events
     * @param fnid
     */
    function updateGUI(fnid) {
        switch (fnid) {
            default:
                break
            case FNID.FN_START_SITE_IMPORT:
                component.SideNaviDrawer.options[0].items = [
                    guiItems[FNID.FN_START_SITE_IMPORT],
                    guiItems[FNID.FN_CONFIRM_SITE]
                ]
                break
            case FNID.FN_CUSTOM_MODE:
                component.SideNaviDrawer.options[0].items = [
                    guiItems[FNID.FN_START_SITE_IMPORT],
                    guiItems[FNID.FN_EDGE_NUM],
                    guiItems[FNID.FN_CONFIRM_SITE]
                ]
                break
            case FNID.FN_CONFIRM_SITE:
                component.SideNaviDrawer.options[0].items = [
                    guiItems[FNID.FN_REASSIGN_SITE],
                ]
                component.SideNaviDrawer.options[0].active = false

                component.SideNaviDrawer.options[1].items.forEach(it => it.disabled = false)
                component.SideNaviDrawer.options[1].active = true
                break
            case FNID.FN_REASSIGN_SITE:
                component.SideNaviDrawer.options[0].items = [
                    guiItems[FNID.FN_START_SITE_IMPORT],
                    guiItems[FNID.FN_CONFIRM_SITE],
                ]
                component.SideNaviDrawer.options[1].items.forEach(it => it.disabled = true)
                component.SideNaviDrawer.options[2].items.forEach(it => it.disabled = true)
                break
            case FNID.FN_GENERATE_VOLUMES:
                component.SideNaviDrawer.options[2].items.forEach(it => it.disabled = false)
                break
        }
    }

    function updateVGParams(params) {
        // StyleMenu
        component.StyleMenu.selectedIndex = params.styleID
        component.StyleMenu.lastSelectedIndex = params.styleID

        // SideNaviDrawer
        guiItems[FNID.FN_REDLINE].value = params.redLineBack
        guiItems[FNID.FN_FLOOR_DEPTH].value = params.floorDepth
        guiItems[FNID.FN_FAR].value = params.FAR_exp

        component.SideNaviDrawer.options[1].items = [
            guiItems[FNID.FN_STYLE_MENU],
            guiItems[FNID.FN_REDLINE],
            guiItems[FNID.FN_FLOOR_DEPTH],
            guiItems[FNID.FN_FAR],
            guiItems[FNID.FN_GENERATE_VOLUMES],
        ]
    }

    /**
     * update all metrics when generate model
     * @param property
     */
    function updateDataBoardAll(property) {
        dataDisplay[DTID.DT_SITE_AREA].value = property.siteArea
        dataDisplay[DTID.DT_BUILDING_HEIGHT].value = property.buildingHeight
        dataDisplay[DTID.DT_BUILDING_DENSITY].value = property.buildingDensity
        dataDisplay[DTID.DT_BUILDING_AREA_TOTAL].value = property.buildingAreaTotal
        dataDisplay[DTID.DT_FAR].value = property.FAR
        dataDisplay[DTID.DT_SURFACE_AREA].value = property.surfaceArea
        dataDisplay[DTID.DT_SHAPE_COEFFICIENT].value = property.shapeCoeff
        dataDisplay[DTID.DT_SOUTH_AREA].value = property.southArea

        component.SideNaviDrawer.dataBoard = [
            dataDisplay[DTID.DT_SITE_AREA],
            dataDisplay[DTID.DT_BUILDING_HEIGHT],
            dataDisplay[DTID.DT_BUILDING_DENSITY],
            dataDisplay[DTID.DT_BUILDING_AREA_TOTAL],
            dataDisplay[DTID.DT_FAR],
            dataDisplay[DTID.DT_SURFACE_AREA],
            dataDisplay[DTID.DT_SHAPE_COEFFICIENT],
            dataDisplay[DTID.DT_SOUTH_AREA],
        ]
    }

    /**
     * clear metrics
     */
    function clearDataBoardAll() {
        dataDisplay[DTID.DT_SITE_AREA].value = 0
        dataDisplay[DTID.DT_BUILDING_HEIGHT].value = 0
        dataDisplay[DTID.DT_BUILDING_DENSITY].value = 0
        dataDisplay[DTID.DT_BUILDING_AREA_TOTAL].value = 0
        dataDisplay[DTID.DT_FAR].value = 0
        dataDisplay[DTID.DT_SURFACE_AREA].value = 0
        dataDisplay[DTID.DT_SHAPE_COEFFICIENT].value = 0
        dataDisplay[DTID.DT_SOUTH_AREA].value = 0

        component.SideNaviDrawer.dataBoard = [
            dataDisplay[DTID.DT_SITE_AREA],
            dataDisplay[DTID.DT_BUILDING_HEIGHT],
            dataDisplay[DTID.DT_BUILDING_DENSITY],
            dataDisplay[DTID.DT_BUILDING_AREA_TOTAL],
            dataDisplay[DTID.DT_FAR],
            dataDisplay[DTID.DT_SURFACE_AREA],
            dataDisplay[DTID.DT_SHAPE_COEFFICIENT],
            dataDisplay[DTID.DT_SOUTH_AREA],
        ]
    }

    /* -------- inner functions: json -------- */

    /**
     * execute different function reacted from different GUI event
     * @param functionID
     */
    function guiEventReactor(functionID) {
        let geoElements_S = [];
        let properties_S = {
            functionID: functionID
        };

        switch (functionID) {
            default:
                break
            case FNID.FN_CONFIRM_SITE:
                if (siteImporter.constructJSON_site(geoElements_S)) {
                    viewport.changeLayer(LAYER.LY_DEFAULT_VIEW)
                    siteImporter.setSiteTransDraggingChanged(false)
                    component.OverlayProcessing.overlayBegin(0)
                    sendJson_vg(archijson, geoElements_S, properties_S)
                } else {
                    geoElements_S = []
                    CustomAlertFactory.showAlertInvalidSite()
                }
                break
            case FNID.FN_GENERATE_VOLUMES:
                if (volumeGenerator.validateSelSite()) {
                    volumeGenerator.setStyleID(component.StyleMenu.selectedIndex)
                    component.OverlayProcessing.overlayBegin(1)
                    volumeGenerator.constructJSON_Param(properties_S)
                    sendJson_vg(archijson, geoElements_S, properties_S)
                } else {
                    CustomAlertFactory.showAlertInvalidParam()
                }
                break
            case FNID.FN_DIFF_PANEL_CONFIRM:
                if (component.RenderWindow.renderingOverlay === false) {
                    // component.RenderWindow.showRender = false
                    component.RenderWindow.renderingOverlay = true
                    diffusionRenderer.setStyle(component.RenderWindow.selectedBaseStyleIndex)
                    diffusionRenderer.setMaterialTags(component.RenderWindow.selectedMaterials)
                    sendJson_vg(archijson, geoElements_S, properties_S)
                    diffusionRenderer.constructJSON_diffParams(properties_S)
                    component.RenderWindow.triggerFakeProgress(true, diffusionRenderer.getImgRatio())
                    sendJson_sd(archijson, geoElements_S, properties_S)
                } else {
                    CustomAlertFactory.showAlertWaitRequest()
                }
                break
        }
    }

    /**
     * send ArchiJSON
     * @param archijson
     * @param geoElements_S
     * @param properties_S
     */
    function sendJson_vg(archijson, geoElements_S, properties_S) {
        properties_S.clientStatus = STID.ST_EXCHANGE
        archijson.sendArchiJSON(
            identity_ud,
            geoElements_S,
            properties_S
        );
    }

    /**
     * send ArchiJSON
     * @param archijson
     * @param geoElements_S
     * @param properties_S
     */
    function sendJson_sd(archijson, geoElements_S, properties_S) {
        properties_S.clientStatus = STID.ST_EXCHANGE
        archijson.sendArchiJSON(
            'sd-generate',
            geoElements_S,
            properties_S
        );
    }

    /**
     * on receiving ArchiJSON
     * @param archijson
     */
    this.receiveJson = function (archijson) {
        archijson.onSetup = function () {
            component.OverlayInit.overlay = true
            archijson.sendArchiJSON(
                identity_ud,
                [],
                {clientStatus: STID.ST_CONNECT}
            );
        }

        archijson.onReceive = function (body) {
            const geoElements_R = body.geometryElements
            const properties_R = body.properties

            if (properties_R.msg === undefined || properties_R.msg === 'succeed') {
                if (properties_R.clientStatus === STID.ST_CONNECT) {
                    component.StyleMenu.initStyleCardByBack(properties_R.ms_title, properties_R.hr_title)
                    component.OverlayInit.overlay = false
                    // component.DialogManualBook.dialog = true
                } else if (properties_R.clientStatus === STID.ST_DISCONNECT) {
                    component.DialogTimeout.dialog = true
                } else if (properties_R.clientStatus === STID.ST_TIMEOUT) {
                    const functionID = properties_R.functionID;
                    switch (functionID) {
                        default:
                            break
                        case FNID.FN_CONFIRM_SITE:
                            component.OverlayProcessing.overlayEnd()
                            CustomAlertFactory.showAlertDivisionFailed()
                            break
                        case FNID.FN_GENERATE_VOLUMES:
                            component.OverlayProcessing.overlayEnd()
                            CustomAlertFactory.showAlertGenerateTimeout()
                            break
                    }
                } else if (properties_R.clientStatus === STID.ST_EXCEPTION) {
                    const functionID = properties_R.functionID;
                    switch (functionID) {
                        default:
                            break
                        case FNID.FN_CONFIRM_SITE:
                            component.OverlayProcessing.overlayEnd()
                            CustomAlertFactory.showAlertDivisionFailed()
                            break
                        case FNID.FN_GENERATE_VOLUMES:
                            component.OverlayProcessing.overlayEnd()
                            CustomAlertFactory.showAlertGenerateFailed()
                            break
                    }
                } else if (properties_R.clientStatus === STID.ST_EXCHANGE) {
                    const functionID = properties_R.functionID;

                    switch (functionID) {
                        default:
                            break
                        case FNID.FN_CONFIRM_SITE:
                            viewport.signals.sceneChanged.active = false;
                            siteImporter.setSite()
                            volumeGenerator.initSetup(siteImporter.getSites())
                            updateDataBoardAll(volumeGenerator.getMetrics())
                            removeVGSelectionEvents()
                            addVGSelectionEvents()
                            viewport.signals.sceneChanged.active = true;
                            component.OverlayProcessing.overlayEnd()
                            updateGUI(FNID.FN_CONFIRM_SITE)
                            break
                        case FNID.FN_GENERATE_VOLUMES:
                            viewport.signals.sceneChanged.active = false;
                            volumeGenerator.parseJSON_volumes(geoElements_R, properties_R)
                            updateDataBoardAll(volumeGenerator.getMetrics())
                            viewport.signals.sceneChanged.active = true;
                            component.OverlayProcessing.overlayEnd()
                            updateGUI(FNID.FN_GENERATE_VOLUMES)
                            break
                        case FNID.FN_DIFF_PANEL_CONFIRM:
                            component.RenderWindow.triggerFakeProgress(false)

                            setTimeout(function () {
                                component.RenderWindow.renderingOverlay = false
                                diffusionRenderer.parseJSON_render(properties_R)
                                component.RenderWindow.updateRenderData(diffusionRenderer.getSceneCutData(), diffusionRenderer.getRenderData())
                                component.RenderWindow.showRender = true
                            }, 1000);
                            break
                    }
                } else {
                    component.OverlayProcessing.overlayEnd()
                    CustomAlertFactory.showAlertUnknown()
                }
            } else {
                // from diffusion server
                if (properties_R.msg === 'unknown error, trying to restart pipeline') {
                    CustomAlertFactory.showAlertDiffusionFailed()
                } else if (properties_R.msg === 'upload failed') {
                    component.RenderWindow.renderingOverlay = false
                    CustomAlertFactory.showAlertDiffusionNetwork()
                } else if (properties_R.msg === 'server is busy') {
                    component.RenderWindow.renderingOverlay = false
                    CustomAlertFactory.showAlertDiffusionBusy()
                }
            }
        }
    }
}

export {GuiEvents}