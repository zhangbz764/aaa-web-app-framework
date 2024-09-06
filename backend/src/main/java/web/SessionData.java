package web;

import wblut.geom.WB_Polygon;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

/**
 * different session for different client
 *
 * @author Baizhou Zhang zhangbz
 * @project typology-generator-web
 * @date 2023/4/18
 * @time 10:22
 */
public class SessionData {
    private AtomicLong lastUpdateTime = new AtomicLong(System.currentTimeMillis());

    private Map<String, WB_Polygon> siteMap;
    private Map<String, List<WB_Polygon>> plotMap;

    /* ------------- constructor ------------- */

    public SessionData() {

    }

    /* ------------- member function ------------- */

    public void updateLastUpdateTime() {
        this.lastUpdateTime.set(System.currentTimeMillis());
    }

    public AtomicLong getLastUpdateTime() {
        return lastUpdateTime;
    }

    /* ------------- setter & getter ------------- */

    public void setSiteMap(Map<String, WB_Polygon> siteMap) {
        this.siteMap = siteMap;
    }

    public Map<String, WB_Polygon> getSiteMap() {
        return siteMap;
    }

    public void setPlotMap(Map<String, List<WB_Polygon>> plotMap) {
        this.plotMap = plotMap;
    }

    public Map<String, List<WB_Polygon>> getPlotMap() {
        return plotMap;
    }
}

