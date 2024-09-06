/**
 * alert factory
 *
 * @author Baizhou Zhang zhangbz
 * @project SIMForms
 * @date 2023/10/15
 * @time 11:00
 */

import {component} from "@inst-aaa/archiweb-core/src/components/component";
import {COLORS} from "@/gui/constantInfo";

class CustomAlertFactory {

    /* global */
    static showAlertWaitRequest() {
        component.CustomAlert.alertLabel = "waitRequest"
        component.CustomAlert.timeout = 3000
        component.CustomAlert.color = COLORS.SECONDARY_ALT
        component.CustomAlert.icon = 'mdi-dots-circle'
        component.CustomAlert.snackbarVisible = true
    }
    static showAlertUnknown() {
        component.CustomAlert.alertLabel = "unknownProblem"
        component.CustomAlert.timeout = 5000
        component.CustomAlert.color = COLORS.WARNING
        component.CustomAlert.icon = 'mdi-alert-circle-outline'
        component.CustomAlert.snackbarVisible = true
    }


    /* site importer */
    static showAlertInvalidSite() {
        component.CustomAlert.alertLabel = "invalidSite"
        component.CustomAlert.timeout = 3000
        component.CustomAlert.color = COLORS.SECONDARY_ALT
        component.CustomAlert.icon = 'mdi-dots-circle'
        component.CustomAlert.snackbarVisible = true
    }
    static showAlertDivisionFailed() {
        component.CustomAlert.alertLabel = "divisionFail"
        component.CustomAlert.timeout = 5000
        component.CustomAlert.color = COLORS.WARNING
        component.CustomAlert.icon = 'mdi-alert-circle-outline'
        component.CustomAlert.snackbarVisible = true
    }

    /* volume generator */
    static showAlertInvalidParam() {
        component.CustomAlert.alertLabel = "invalidParam"
        component.CustomAlert.timeout = 3000
        component.CustomAlert.color = COLORS.SECONDARY_ALT
        component.CustomAlert.icon = 'mdi-dots-circle'
        component.CustomAlert.snackbarVisible = true
    }
    static showAlertGenerateTimeout() {
        component.CustomAlert.alertLabel = "generateTimeout"
        component.CustomAlert.timeout = 5000
        component.CustomAlert.color = COLORS.WARNING
        component.CustomAlert.icon = 'mdi-alert-circle-outline'
        component.CustomAlert.snackbarVisible = true
    }
    static showAlertGenerateFailed() {
        component.CustomAlert.alertLabel = "generateFailed"
        component.CustomAlert.timeout = 5000
        component.CustomAlert.color = COLORS.WARNING
        component.CustomAlert.icon = 'mdi-alert-circle-outline'
        component.CustomAlert.snackbarVisible = true
    }

    /* diffusion renderer */
    static showAlertDiffusionBusy() {
        component.CustomAlert.alertLabel = "diffusionBusy"
        component.CustomAlert.timeout = 3000
        component.CustomAlert.color = COLORS.SECONDARY_ALT
        component.CustomAlert.icon = 'mdi-dots-circle'
        component.CustomAlert.snackbarVisible = true
    }
    static showAlertDiffusionFailed() {
        component.CustomAlert.alertLabel = "diffusionFail"
        component.CustomAlert.timeout = 5000
        component.CustomAlert.color = COLORS.WARNING
        component.CustomAlert.icon = 'mdi-alert-circle-outline'
        component.CustomAlert.snackbarVisible = true
    }
    static showAlertDiffusionNetwork() {
        component.CustomAlert.alertLabel = "diffusionNetwork"
        component.CustomAlert.timeout = 5000
        component.CustomAlert.color = COLORS.WARNING
        component.CustomAlert.icon = 'mdi-alert-circle-outline'
        component.CustomAlert.snackbarVisible = true
    }

    static showAlertDiffusionDownload() {
        component.CustomAlert.alertLabel = "diffusionDownload"
        component.CustomAlert.timeout = 3000
        component.CustomAlert.color = COLORS.PRIMARY
        component.CustomAlert.icon = 'mdi-cloud-check-variant-outline'
        component.CustomAlert.snackbarVisible = true
    }

}

export {CustomAlertFactory}