/**
 * description
 *
 * @author Baizhou Zhang zhangbz
 * @project SIMForms
 * @date 2023/8/14
 * @time 17:31
 */

/* eslint-disable no-unused-vars,no-case-declarations */
import {token} from "@/sensitiveInfo";
import {GuiEvents} from "@/gui/guiEvents";
import {VolumeGenerator} from "@/modules/volumeGenerator";
import {LAYER} from "@/gui/constantInfo";
import {SiteImporter} from "@/modules/siteImporter";
import {DiffusionRenderer} from "@/modules/diffusionRenderer";
import * as ARCH from "@inst-aaa/archiweb-core";

/* -------- necessities -------- */

const archijson = new ARCH.ArchiJSON(token);
const vp = new ARCH.Viewport('container-style-generator', true,
    {
        drag: false,
        selection: true,
        transformer: true,
        environment: true,
    }
);
const mt = new ARCH.MaterialFactory();

const si = new SiteImporter(vp, mt)
const vg = new VolumeGenerator(vp, mt)
const dr = new DiffusionRenderer(vp)
const guiEvents = new GuiEvents(archijson, vp, si, vg, dr);

/* -------- main entry -------- */
function main() {
    vp.environment.axesUpdate(true)
    // vp.environment.gridUpdate(10)
    vp.setCameraPosition([350, -350, 350], [0, 0, 0])

    vp.transformer.control.showZ = false
    vp.transformer.checkDeleteSelected = function () {

    }

    // setup layers
    Object.keys(LAYER).forEach(name => {
        vp.addLayer(LAYER[name])
    })
    vp.changeLayer(LAYER.LY_DEFAULT_VIEW)

    guiEvents.initGUI()

    // setup receiving
    guiEvents.receiveJson(archijson);
}

export {
    main
}