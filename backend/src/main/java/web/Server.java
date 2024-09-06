package web;

import archijson.ArchiJSON;
import archijson.ArchiServer;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import geometry.BaseGeometry;
import io.socket.client.Socket;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * description
 *
 * @author Baizhou Zhang zhangbz
 * @project typology-generator-web
 * @date 2023/3/17
 * @time 17:18
 */
public class Server implements ArchiServer {
    private static final Logger logger = LogManager.getLogger(Server.class);

    private final Gson gson = new Gson();

    private final Map<String, SessionData> sessionDataMap;

    /* ------------- constructor ------------- */

    public Server() {
        String URL = "https://web.archialgo.com";
        String TOKEN = SensitiveInfo.TOKEN;
        String IDENTITY = SensitiveInfo.IDENTITY;

        ArchiServer.super.setup(URL, TOKEN, IDENTITY);


        this.sessionDataMap = new HashMap<>();
    }

    /* ------------- member function ------------- */

    /**
     * session cleanup task
     */
    public void startSessionCleanupTask(Socket socket) {
        logger.info("Session recycle system started.");
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

        scheduler.scheduleAtFixedRate(() -> {
            long currentTime = System.currentTimeMillis();
            // 遍历sessionMap，检查每个Session的更新时间
            if (!sessionDataMap.isEmpty()) {
                List<String> timeoutSessionID = new ArrayList<>();

                // check timeout session to a new list
                for (Map.Entry<String, SessionData> entry : sessionDataMap.entrySet()) {
                    AtomicLong lastUpdate = entry.getValue().getLastUpdateTime(); // 获取 AtomicLong
                    if (currentTime - lastUpdate.get() > 15 * 60 * 1000) { // 超过15分钟未更新
                        String id = entry.getKey();
                        timeoutSessionID.add(id);
                    }
                }

                // remove and send message to each session
                if (!timeoutSessionID.isEmpty()) {
                    StringBuilder log = new StringBuilder("Client time out. Session ");
                    for (String id : timeoutSessionID) {
                        sessionDataMap.remove(id);

                        // send information
                        ArchiJSON jsonS = new ArchiJSON();
                        JsonObject properties_S = new JsonObject();
                        properties_S.addProperty("clientStatus", ConstantInfo.ST_DISCONNECT);
                        jsonS.setProperties(properties_S);
                        ArchiServer.super.send(socket, "client", id, gson.toJson(jsonS));

                        log.append(id).append(", ");
                    }
                    log.append("removed at ").append(new Date(currentTime)).append(". Current session num: ").append(sessionDataMap.size());

                    logger.info(log.toString());
                }
            }
        }, 0, 1, TimeUnit.MINUTES); // 每隔1分钟执行一次检查任务
    }

    /**
     * override function
     * process when first connect to ArchiWeb
     *
     * @param socket web socket
     * @return void
     */
    @Override
    public void onConnect(Socket socket) {
        logger.info("Java backend connected at " + new Date(System.currentTimeMillis()));
        startSessionCleanupTask(socket);
    }

    /**
     * override function
     * process when receive messages from front-end
     *
     * @param socket web socket
     * @param id     client id
     * @param body   json body
     * @return void
     */
    @Override
    public void onReceive(Socket socket, String id, JsonObject body) {
        ArchiServer.super.onReceive(socket, id, body);

        // receiving ArchiJSON
        ArchiJSON jsonR = gson.fromJson(body, ArchiJSON.class);
        jsonR.parseGeometryElements(gson);

        // process and add geometries & properties into json
        ArchiJSON jsonS = new ArchiJSON();
        int clientStatus = jsonR.getProperties().get("clientStatus").getAsInt();

        if (clientStatus == ConstantInfo.ST_CONNECT) {
            // create new session
            SessionData s = new SessionData();
            s.updateLastUpdateTime();
            sessionDataMap.put(id, s);
            logger.info("Session " + id + " created at " + new Date(s.getLastUpdateTime().get()) + ". Current session num: " + sessionDataMap.size());


            // temp
            JsonObject properties_S = new JsonObject();
            properties_S.addProperty("clientStatus", ConstantInfo.ST_CONNECT);
            jsonS.setProperties(properties_S);
            ArchiServer.super.send(socket, "client", id, gson.toJson(jsonS));
        } else if (clientStatus == ConstantInfo.ST_EXCHANGE) {
            logger.info("Client " + id + " operating.");
            // find corresponding session data to process

            boolean sendFlag = false;
            sendFlag = processJson(jsonR, jsonS, gson, sessionDataMap.get(id));
            // sending ArchiJSON
            if (sendFlag) {
                ArchiServer.super.send(socket, "client", id, gson.toJson(jsonS));
            }
            logger.info("Session " + id + " updated.");
        }
    }

    /* ------------- json processing ------------- */

    /**
     * process and add geometries & properties into json
     * depends on different function ID
     *
     * @param jsonR ArchiJSON received
     * @param jsonS ArchiJSON to send
     * @param gson  Gson instance
     * @return void
     */
    public boolean processJson(ArchiJSON jsonR, ArchiJSON jsonS, Gson gson, SessionData session) {
        // >>> 1. parse function ID from ArchiJSON-received
        int functionID = jsonR.getProperties().get("functionID").getAsInt();
        List<BaseGeometry> geoElements_R = jsonR.getGeometries();
        JsonObject properties_R = jsonR.getProperties();

        // >>> 2. create empty "containers" for the ArchiJSON-to-send
        List<JsonElement> geoElements_S = new ArrayList<>();
        JsonObject properties_S = new JsonObject();

        // >>> 3. deal with different function ID
        boolean sendFlag = false; // a flag to judge if this step should send an ArchiJSON
        switch (functionID) {
            case ConstantInfo.FN_CONFIRM_SITE:
                ExecutorService executor1 = Executors.newSingleThreadExecutor();
                Future<Void> future1 = executor1.submit(() -> {


                    properties_S.addProperty("clientStatus", ConstantInfo.ST_EXCHANGE);
                    return null;
                });
                try {
                    future1.get(10, TimeUnit.SECONDS);
                } catch (TimeoutException e) {
                    // 超时
                    logger.warn("Code execution time exceeded 10 seconds.");
                    System.out.println("Code execution time exceeded 10 seconds.");
                    future1.cancel(true); // 终止执行
                    properties_S.addProperty("clientStatus", ConstantInfo.ST_TIMEOUT);
                } catch (Exception e) {
                    // 其他异常
                    properties_S.addProperty("clientStatus", ConstantInfo.ST_EXCEPTION);
                    e.printStackTrace();
                    logger.error(e.getMessage());
                } finally {
                    executor1.shutdownNow(); // 关闭线程池
                }
                session.updateLastUpdateTime();
                sendFlag = true;
                break;
            case ConstantInfo.FN_GENERATE_VOLUMES:
                ExecutorService executor2 = Executors.newSingleThreadExecutor();
                Future<Void> future2 = executor2.submit(() -> {


                    properties_S.addProperty("clientStatus", ConstantInfo.ST_EXCHANGE);
                    return null;
                });
                boolean cancelSuccess = true;
                try {
                    future2.get(10, TimeUnit.SECONDS);
                } catch (TimeoutException e) {
                    // 超时
                    logger.warn("Code execution time exceeded 10 seconds.");
                    System.out.println("Code execution time exceeded 10 seconds.");
                    cancelSuccess = future2.cancel(true); // 终止执行
                    if (!cancelSuccess) {
                        logger.error("Cannot interrupt the code !!!");
                        System.out.println("Cannot interrupt the code !!!");
                    }
                    properties_S.addProperty("clientStatus", ConstantInfo.ST_TIMEOUT);
                } catch (Exception e) {
                    // 其他异常
                    properties_S.addProperty("clientStatus", ConstantInfo.ST_EXCEPTION);
                    e.printStackTrace();
                    logger.error(e.getMessage());
                } finally {
                    executor2.shutdownNow(); // 关闭线程池
                }

                session.updateLastUpdateTime();
                sendFlag = cancelSuccess;
                break;
            case ConstantInfo.FN_DIFF_PANEL_CONFIRM:
                session.updateLastUpdateTime();
                break;
            default:
                break;
        }

        // >>> 4. set geometries & properties to the ArchiJSON-to-send
        if (sendFlag) {
            properties_S.addProperty("functionID", functionID); // always put in same function ID for identification
            properties_S.addProperty("identity", "udpro-java-backend");
            jsonS.setGeometryElements(geoElements_S);
            jsonS.setProperties(properties_S);
        }
        return sendFlag;
    }

}
