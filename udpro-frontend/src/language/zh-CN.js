/**
 * description
 *
 * @author Baizhou Zhang zhangbz
 * @project vSIMForms
 * @date 2023/10/19
 * @time 12:48
 */
export default {
    copyright1: '东南大学建筑学院 建筑运算与应用研究所 | 南京数鼎科技有限公司',
    copyright2: '南京数鼎科技有限公司',
    copyright3: '东南大学建筑设计研究院有限公司 建筑运算与应用联合教授工作室',
    info: '2024/05/11 - 用户注册与登录',
    author: 'by 张柏洲, 莫怡晨, 李飚, 王炎钰, 张超, 史季',

    // global
    confirm: '确认',
    cancel: '取消',
    generate: '生成',
    save: '保存',
    random: '随机',
    logout: '安全退出',
    loginFirst:'请先登录/注册',

    // global banner & hint
    init1: 'SIMForms 正在连接',
    init2: '请耐心等待...',
    generatingPlots: '正在确认基地...',
    generatingModel: '正在生成模型...',
    clearingScene: '正在清空场景...',

    waitRequest: '请等待上一次请求处理完毕。',
    unknownProblem: '未知错误，请刷新页面或联系管理员。',
    invalidSite: '无效或缺少基地形状，请检查后重试。',
    divisionFail: '无法导入基地，请检查模型并重试。',
    invalidParam: '无效参数，请调整并重试。',
    generateTimeout: '运算超时，请调整参数并重试。',
    generateFailed: '生成模型出错，请尝试其他参数或刷新页面。',
    diffusionBusy: '服务器正忙，请稍后再试。',
    diffusionFail: '未知错误，请稍后重试或联系管理员。',
    diffusionNetwork: '网络错误，请重试。',
    diffusionDownload: '图片即将下载，请耐心等待！',
    clientTimeout1: '您已长时间未操作。',
    clientTimeout2: '服务器断开连接，请刷新页面。',

    // 0 manual book
    manualBookHint: '你可以随时从这里打开使用说明。',
    prev: '上一条',
    next: '下一条',
    manual_book: 'SIMForms 操作说明',

    stepTitle0: '基础操作',
    description01: '(1) 旋转--鼠标右键；平移--Shift+鼠标右键；缩放--鼠标滚轮。',
    description02: '(2) 右上角为操作手册与语言切换按钮。',
    description03: '(3) 右侧边栏为参数选项与指标显示面板。',
    stepTitle1: '基地设置',
    description11: '(1) 可选择导入基地文件或是自行绘制基地，亦可直接体验样例基地。',
    description12: '(2) 基地设置完毕后需进行确认。SIMForms将对基地的图元进行检查。',
    stepTitle2: '模型生成',
    description21: '(1) 若导入多个基地，可通过“鼠标左键双击”来在不同基地之间选择切换。',
    description22: '(2) 在样式库菜单中选择需要的样式，目前提供多层与高层共计23中样式。',
    description23: '(3) 选择样式后在侧边栏调节生成参数，点击“生成”即可获得三维建筑模型。',
    stepTitle3: 'AI渲染',
    description31: '(1) 在三维场景中选择合适的渲染角度并打开渲染面板。SIMForms提供部分相机参数可供设置。',
    description32: '(2) 在右侧调节渲染图像的长宽比和大小，虚线预览框会显示在原始场景上。',
    description33: '(3) 在中间的基准样式菜单选择一种并点击“生成”，等待片刻后即可获得概念图生成结果。提供了部分高级参数供专业人士调节。',
    description34: '(4) 最大支持5张渲染图的查看比较。可选择您喜欢的图片下载保存。',

    // side navi drawer
    appOptions: 'SIMForms 选项',

    // site
    siteSettings: '基地设置',
    importSite: '导入选项',
    edgeNum: '边线数量',
    confirmSite: '确认基地',
    reassignSite: '重置基地',

    // site dialog
    dialogTitle: '导入选项',
    importMode: '打开文件',
    customMode: '开始绘制',
    templateMode: '体验样例基地',

    importTitle: '文件上传',
    customTitle: '自由绘制',
    importDesc1: '(1) 在基地文件中新建"simforms-site"图层并在该图层中精确绘制闭合的基地轮廓',
    importDesc2: '(2) 清理无用信息并保存为DXF格式文件，建议文件大小不超过5MB',
    importDesc3: '(3) 或者你也可以上传ANYSite应用生成的基地剖分',
    customDesc1: '(1) 鼠标点击并拖拽控制点以定义基地形状',
    customDesc2: '(2) 菜单栏可选择控制点数量',
    customDesc3: '(3) 面积过小或线段自交等无效情况将无法被导入',

    // generator
    modelGenerator: '模型生成',
    openStyleBase: '打开样式库',
    redLineBack: '红线退界',
    floorHeight: '层高',
    farExpect: '容积率需求',

    // style base
    styleBaseTitle: '样式库',
    multiStorey: '多层建筑样式',
    highRise: '高层建筑样式',

    // AI renderer
    aiRenderer: 'AI渲染',
    cameraPreset: '相机预设',
    isometric: '轴测',
    cameraFOV: '相机视野',
    openRenderPanel: 'AI渲染面板',

    // AI renderer panel
    aiPanelTitle: 'AI渲染器',
    emptyHint: '图片显示区域',
    baseStyle: '基准样式',
    spring: '春',
    summer: '夏',
    autumn: '秋',
    winter: '冬',
    nature: '自然',
    minimalism: '极简',
    daytime: '日光',
    nighttime: '夜景',

    materials: '材料选择',
    concrete: '混凝土',
    steel: '钢',
    wood: '木',
    glass: '玻璃',

    scenePrev: '场景预览',
    previewW: '预览宽度',
    previewH: '预览高度',
    imageSize: '图像尺寸(px)',

    advSettings: '高级设置',
    generateSeed: '生成种子',
    samplingMethod: '采样方法',
    samplingSteps: '采样步数',
    conditionScale: '控制强度',


    // Indicators board
    dataBoardTitle: '指标面板',
    siteArea: '基地面积',
    buildingHeight: '建筑高度',
    buildingDensity: '建筑密度',
    buildingAreaTotal: '建筑总面积',
    far: '容积率',
    surfaceArea: '外表皮面积',
    shapeCoeff: '体形系数',
    southArea: '南向立面面积',
}