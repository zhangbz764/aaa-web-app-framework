package web;

/**
 * description
 *
 * @author Baizhou Zhang zhangbz
 * @project SIMForms
 * @date 2023/8/15
 * @time 11:23
 */
public final class ConstantInfo {
    public static final int ST_CONNECT = 10000;
    public static final int ST_EXCHANGE = 10001;
    public static final int ST_DISCONNECT = 10002;
    public static final int ST_EXCEPTION = 10003;
    public static final int ST_TIMEOUT = 10004;


    public static final int FN_CONFIRM_SITE = 107;
    public static final int FN_GENERATE_VOLUMES = 205;
    public static final int FN_DIFF_PANEL_CONFIRM = 3017;

    // layers
    public static final String LY_DEFAULT_VIEW = "Default View";
    public static final String LY_LOCKED_GEOS = "Locked Geos";
    public static final String LY_SITE_ENV = "Site Environments";
    public static final String LY_SITE_REDLINE = "simforms-site";
    public static final String LY_SITE_PLOTS = "Site Plots";
    public static final String LY_VOLUME_GEN = "Generated Volumes";
}
