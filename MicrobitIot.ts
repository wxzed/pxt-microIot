/*！
 * @file Obloq/Obloq.ts
 * @brief DFRobot's obloq makecode library.
 * @n [Get the module here](http://www.dfrobot.com.cn/goods-1577.html)
 * @n Obloq is a serial port of WIFI connection module, Obloq can connect 
 *    to Microsoft Azure IoT and other standard MQTT protocol IoT.
 *
 * @copyright	[DFRobot](http://www.dfrobot.com), 2016
 * @copyright	GNU Lesser General Public License
 *
 * @author [email](xiao.wu@dfrobot.com)
 * @version  V0.1
 * @date  2019-05-31
 */


//debug
const OBLOQ_DEBUG = false
const OBLOQ_MQTT_DEFAULT_SERVER = true
//DFRobot easy iot
const OBLOQ_MQTT_EASY_IOT_SERVER_CHINA = "iot.dfrobot.com.cn"
const OBLOQ_MQTT_EASY_IOT_SERVER_GLOBAL = "iot.dfrobot.com"
const OBLOQ_MQTT_EASY_IOT_PORT = 1883
//other iot
const OBLOQ_MQTT_USER_IOT_SERVER = "---.-----.---"
const OBLOQ_MQTT_USER_IOT_PORT = 0
//topic max number
const OBLOQ_MQTT_TOPIC_NUM_MAX = 5
//wrong type
const OBLOQ_ERROR_TYPE_IS_SUCCE = 0
const OBLOQ_ERROR_TYPE_IS_ERR = 1
const OBLOQ_ERROR_TYPE_IS_WIFI_CONNECT_TIMEOUT = -1
const OBLOQ_ERROR_TYPE_IS_WIFI_CONNECT_FAILURE = -2
const OBLOQ_ERROR_TYPE_IS_MQTT_SUBTOPIC_TIMEOUT = -3
const OBLOQ_ERROR_TYPE_IS_MQTT_CONNECT_TIMEOUT = -4
const OBLOQ_ERROR_TYPE_IS_MQTT_CONNECT_FAILURE = -5
const OBLOQ_ERROR_TYPE_IS_MQTT_SUBTOPIC_FAILURE = -6
//data type
const OBLOQ_STR_TYPE_IS_NONE = ""
const OBLOQ_BOOL_TYPE_IS_TRUE = true
const OBLOQ_BOOL_TYPE_IS_FALSE = false

/**
 *Obloq implementation method.
 */
//% weight=10 color=#008B00 icon="\uf1eb" block="MicrobitIot"
namespace MicrobitIot {
    let Topic0CallBack: Action = null;
    let Topic1CallBack: Action = null;
    let Topic2CallBack: Action = null;
    let Topic3CallBack: Action = null;
    let Topic4CallBack: Action = null;
    let Wifi_Status = 0x00
    let MicrobitIoT_Mode = 0x00
    let MQTT = 0x00
    let HTTP = 0x01

    let READ_STATUS = 0x00
    let SET_PARA = 0x01
    let RUN_COMMAND = 0x02

    /*set para*/
    let SETWIFI_NAME = 0x01
    let SETWIFI_PASSWORLD = 0x02
    let SETMQTT_SERVER = 0x03
    let SETMQTT_PORT = 0x04
    let SETMQTT_ID = 0x05
    let SETMQTT_PASSWORLD = 0x06
    let SETHTTP_IP = 0x07
    let SETHTTP_PORT = 0x08

    /*run command*/
    let SEND_PING = 0x01
    let CONNECT_WIFI = 0x02
    let RECONNECT_WIFI = 0x03
    let DISCONECT_WIFI = 0x04
    let CONNECT_MQTT = 0x05
    let SUB_TOPIC0 = 0x06
    let SUB_TOPIC1 = 0x07
    let SUB_TOPIC2 = 0x08
    let SUB_TOPIC3 = 0x09
    let SUB_TOPIC4 = 0x0A
    let PUB_TOPIC0 = 0x0B
    let PUB_TOPIC1 = 0x0C
    let PUB_TOPIC2 = 0x0D
    let PUB_TOPIC3 = 0x0E
    let PUB_TOPIC4 = 0x0F
    let GET_URL = 0x10
    let POST_URL = 0x11
    let PUT_URL = 0x12
    let GET_VERSION = 0x13


    /*read para value*/
    let READ_PING = 0x01
    let READ_WIFISTATUS = 0x02
    let READ_IP = 0x03
    let READ_MQTTSTATUS = 0x04
    let READ_SUBSTATUS = 0x05
    let READ_TOPICDATA = 0x06
    let HTTP_REQUEST = 0x10
    let READ_VERSION = 0x12

    /*para status */
    let PING_ERR = 0x00
    let PING_OK = 0x01
    let WIFI_DISCONNECT = 0x00
    let WIFI_CONNECTING = 0x02
    let WIFI_CONNECTED = 0x03
    let MQTT_CONNECTED = 0x01
    let MQTT_CONNECTERR = 0x02
    let SUB_TOPIC_OK = 0x01
    let SUB_TOPIC_Ceiling = 0x02
    let SUB_TOPIC_ERR = 0x03

    let MicrobitIoTStatus = ""
    let MicrobitIoTData = ""
    let WIFI_NAME = ""
    let WIFI_PASSWORLD = ""
    let MQTT_SERVER = ""
    let MQTT_PORT = ""
    let MQTT_ID = ""
    let MQTT_PASSWORLD = ""
    let Topic_0 = ""
    let Topic_1 = ""
    let Topic_2 = ""
    let Topic_3 = ""
    let Topic_4 = ""
    let RECDATA = ""
    let HTTP_IP = ""
    let HTTP_PORT = ""
    let MicrobitIoT_IP = "0.0.0.0"

    export enum aMotors {
        //% blockId="M1" block="M1"
        M1 = 0,
        //% blockId="M2" block="M2"
        M2 = 1,
        //% blockId="ALL" block="ALL"
        ALL = 2
    }

    export enum aServos {
        //% blockId="S1" block="S1"
        S1 = 0,
        //% blockId="S2" block="S2"
        S2 = 1
    }

    export enum Dir {
        //% blockId="CW" block="CW"
        CW = 0x0,
        //% blockId="CCW" block="CCW"
        CCW = 0x1
    }

    export enum SERVERS {
        //% blockId=SERVERS_China block="China"
        China,
        //% blockId=SERVERS_Global block="Global"
        Global
    }

    export enum TOPIC {
        topic_0 = 0,
        topic_1 = 1,
        topic_2 = 2,
        topic_3 = 3,
        topic_4 = 4
    }

    export class PacketMqtt {
        public message: string;
    }

    //% weight=50
    //% blockId=MicrobitIoT_ServoRun block="Servo|%index|angle|%angle"
    //% angle.min=0 angle.max=180
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function MicrobitIoT_ServoRun(index: aServos, angle: number): void {
        let buf = pins.createBuffer(2);
        if (index == 0) {
            buf[0] = 0x14;
        }
        if (index == 1) {
            buf[0] = 0x15;
        }
        buf[1] = angle;
        pins.i2cWriteBuffer(0x10, buf);
    }

    //% weight=49
    //% blockId=MicrobitIoT_MotorRun block="Motor|%index|dir|%Dir|speed|%speed"
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function MicrobitIoT_MotorRun(index: aMotors, direction: Dir, speed: number): void {
        let buf = pins.createBuffer(3);
        if (index == 0) {
            buf[0] = 0x00;
        }else if (index == 1) {
            buf[0] = 0x02;
        } else if (index == 2){
            buf[0] = 0x00;
            buf[1] = direction;
            buf[2] = speed;
            pins.i2cWriteBuffer(0x10, buf);
            buf[0] = 0x02;
        }else{
        }
        buf[1] = direction;
        buf[2] = speed;
        pins.i2cWriteBuffer(0x10, buf);
    }
    //% weight=48
    //% blockId=MicrobitIoT_motorStop block="Motor stop|%motors"
    //% motors.fieldEditor="gridpicker" motors.fieldOptions.columns=2 
    export function MicrobitIoT_motorStop(motors: aMotors): void {
        let buf = pins.createBuffer(3);
        if (motors == 0) {
            buf[0] = 0x00;
        }else if (motors == 1) {
            buf[0] = 0x02;
        } else if (motors == 2){
            buf[0] = 0x00;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
            buf[0] = 0x02;
        }
        buf[1] = 0;
        buf[2] = 0;
        pins.i2cWriteBuffer(0x10, buf);
    }

    /*
    //% weight=47
    //% blockId=MicrobitIoT_motorStopAll block="Motor Stop All"
    export function MicrobitIoT_motorStopAll(): void {
        let buf = pins.createBuffer(3);
        buf[0] = 0x00;
        buf[1] = 0;
        buf[2] = 0;
        pins.i2cWriteBuffer(0x10, buf);
        buf[0] = 0x02;
        pins.i2cWriteBuffer(0x10, buf);
    }*/

    function MicrobitIoT_setPara(cmd: number, para: string): void {
        let buf = pins.createBuffer(para.length + 4);
        buf[0] = 0x1E
        buf[1] = SET_PARA
        buf[2] = cmd
        buf[3] = para.length
        for (let i = 0; i < para.length; i++)
            buf[i + 4] = para[i].charCodeAt(0)
        pins.i2cWriteBuffer(0x10, buf);
    }

    function MicrobitIoT_runCommand(cmd: number): void {
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E
        buf[1] = RUN_COMMAND
        buf[2] = cmd
        pins.i2cWriteBuffer(0x10, buf);
    }

    function MicrobitIoT_readStatus(para: number): number {
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E
        buf[1] = READ_STATUS
        buf[2] = para
        pins.i2cWriteBuffer(0x10, buf);
        let recbuf = pins.createBuffer(2)
        recbuf = pins.i2cReadBuffer(0x10, 2, false)
        return recbuf[1]
    }

    function MicrobitIoT_readValue(para: number): string {
        let buf = pins.createBuffer(3);
        let paraValue = 0x00
        let tempLen = 0x00
        let dataValue = ""
        buf[0] = 0x1E
        buf[1] = READ_STATUS
        buf[2] = para
        pins.i2cWriteBuffer(0x10, buf);
        MicrobitIoT_CheckStatus("READ_IP");
        return RECDATA
    }

    function MicrobitIoT_ParaRunCommand(cmd: number, data: string): void {
        let buf = pins.createBuffer(data.length + 4)
        buf[0] = 0x1E
        buf[1] = RUN_COMMAND
        buf[2] = cmd
        buf[3] = data.length
        for (let i = 0; i < data.length; i++)
            buf[i + 4] = data[i].charCodeAt(0)
        pins.i2cWriteBuffer(0x10, buf);
    }
    function MicrobitIoT_CheckStatus(cmd: string): void {
        while (true) {
            if (MicrobitIoTStatus == cmd) {
                serial.writeString("OKOK\r\n");
                return;
            }
            basic.pause(50);
        }
    }
    /**
     * Two parallel stepper motors are executed simultaneously(DegreeDual).
     * @param SSID to SSID ,eg: "yourSSID"
     * @param PASSWORD to PASSWORD ,eg: "yourPASSWORD"
     * @param IOT_ID to IOT_ID ,eg: "yourIotId"
     * @param IOT_PWD to IOT_PWD ,eg: "yourIotPwd"
     * @param IOT_TOPIC to IOT_TOPIC ,eg: "yourIotTopic"
    */
    //% weight=100
    //% blockExternalInputs=1
    //% blockId=MicrobitIoT_MQTT block="Micro:IoT setup mqtt|Wi-Fi: |name: %SSID| password：%PASSWORD| IOT_ID: %IOT_ID| IOT_PWD :%IOT_PWD| IoT service:|(default topic_0) Topic: %IOT_TOPIC| start connection:| server: %SERVERS"
    export function MicrobitIoT_MQTT(SSID: string, PASSWORD: string,
        IOT_ID: string, IOT_PWD: string,
        IOT_TOPIC: string, servers: SERVERS):
        void {
        MicrobitIoT_Mode = MQTT
        MicrobitIoT_setPara(SETWIFI_NAME, SSID)
        MicrobitIoT_setPara(SETWIFI_PASSWORLD, PASSWORD)
        if (servers == SERVERS.China) {
            MicrobitIoT_setPara(SETMQTT_SERVER, OBLOQ_MQTT_EASY_IOT_SERVER_CHINA)
        } else {
            MicrobitIoT_setPara(SETMQTT_SERVER, OBLOQ_MQTT_EASY_IOT_SERVER_GLOBAL)
        }
        MicrobitIoT_setPara(SETMQTT_PORT, "1883")
        MicrobitIoT_setPara(SETMQTT_ID, IOT_ID)
        MicrobitIoT_setPara(SETMQTT_PASSWORLD, IOT_PWD)
        MicrobitIoT_runCommand(CONNECT_WIFI)
        MicrobitIoT_CheckStatus("WiFiConnected");
        /*
        while (MicrobitIoT_readStatus(READ_WIFISTATUS) != WIFI_CONNECTED) {
            basic.pause(200)
        }*/
        serial.writeString("wifi conneced ok\r\n");
        Wifi_Status = WIFI_CONNECTED
        MicrobitIoT_runCommand(CONNECT_MQTT);
        MicrobitIoT_CheckStatus("MQTTConnected");
        serial.writeString("mqtt connected\r\n");
        /*
        while (MicrobitIoT_readStatus(READ_MQTTSTATUS) != MQTT_CONNECTED) {
            basic.pause(200)
        }*/
        Topic_0 = IOT_TOPIC
        MicrobitIoT_ParaRunCommand(SUB_TOPIC0, IOT_TOPIC);
        MicrobitIoT_CheckStatus("SubTopicOK");
        serial.writeString("sub topic ok\r\n");
        /*    
        while (MicrobitIoT_readStatus(READ_SUBSTATUS) != SUB_TOPIC_OK) {
            basic.pause(200)
        }*/

    }

    //% weight=200
    //% blockId=MicrobitIoT_add_topic
    //% block="subscribe additional %top |: %IOT_TOPIC"
    //% top.fieldEditor="gridpicker" top.fieldOptions.columns=2
    //% advanced=true
    export function MicrobitIoT_add_topic(top: TOPIC, IOT_TOPIC: string): void {
        MicrobitIoT_ParaRunCommand((top+0x06), IOT_TOPIC);
        /*
        while (MicrobitIoT_readStatus(READ_SUBSTATUS) != SUB_TOPIC_OK) {
            basic.pause(200)
        }*/
        MicrobitIoT_CheckStatus("SubTopicOK");
        
    }
    /**
     * @param Mess to Mess ,eg: "mess"
     */
    //% weight=99
    //% blockId=MicrobitIoT_SendMessage block="Send Message %string| to |%TOPIC"
    export function MicrobitIoT_SendMessage(Mess: string, Topic: TOPIC): void {
        let topic = 0
        switch (Topic) {
            case TOPIC.topic_0:
                topic = PUB_TOPIC0
                break;
            case TOPIC.topic_1:
                topic = PUB_TOPIC1
                break;
            case TOPIC.topic_2:
                topic = PUB_TOPIC2
                break;
            case TOPIC.topic_3:
                topic = PUB_TOPIC3
                break;
            case TOPIC.topic_4:
                topic = PUB_TOPIC4
                break;
            default:
                break;

        }
        MicrobitIoT_ParaRunCommand(topic, Mess)

    }

    function MicrobitIoT_callback(top: TOPIC, a: Action): void {
        switch (top) {
            case TOPIC.topic_0:
                Topic0CallBack = a;
                break;
            case TOPIC.topic_1:
                Topic1CallBack = a;
                break;
            case TOPIC.topic_2:
                Topic2CallBack = a;
                break;
            case TOPIC.topic_3:
                Topic3CallBack = a;
                break;
            case TOPIC.topic_4:
                Topic4CallBack = a;
                break;
            default:
                break;
        }
    }

    //% weight=98
    //% blockGap=60
    //% blockId=obloq_mqtt_callback_user_more block="on %top |received"
    //% top.fieldEditor="gridpicker" top.fieldOptions.columns=2
    export function MicrobitIoT_MQTT_Event(top: TOPIC, cb: (message: string) => void) {
        MicrobitIoT_callback(top, () => {
            const packet = new PacketMqtt()
            packet.message = RECDATA
            cb(packet.message)
        });
    }


    /**
     * Two parallel stepper motors are executed simultaneously(DegreeDual).
     * @param SSID to SSID ,eg: "yourSSID"
     * @param PASSWORD to PASSWORD ,eg: "yourPASSWORD"
     * @param IP to IP ,eg: "0.0.0.0"
     * @param PORT to PORT ,eg: 80
    */
    //% weight=80
    //% blockId=MicrobitIoT_http_setup
    //% block="Micro:IoT setup http | Wi-Fi: | name: %SSID| password: %PASSWORD| http config: | ip: %IP| port: %PORT| start connection"
    export function MicrobitIoT_http_setup(SSID: string, PASSWORD: string,
        IP: string, PORT: number):
        void {
        MicrobitIoT_Mode = HTTP
        MicrobitIoT_setPara(SETWIFI_NAME, SSID)
        MicrobitIoT_setPara(SETWIFI_PASSWORLD, PASSWORD)
        MicrobitIoT_setPara(SETHTTP_IP, IP)
        MicrobitIoT_setPara(SETHTTP_PORT, PORT.toString())
        MicrobitIoT_runCommand(CONNECT_WIFI)
        MicrobitIoT_CheckStatus("WiFiConnected");
        Wifi_Status = WIFI_CONNECTED
    }

    function MicrobitIoT_http_wait_request(time: number) :string{
        if(time < 100){
            time = 100
        }
        let timwout = time / 100
        let _timeout = 0
        while(true){
            basic.pause(100)
            if (MicrobitIoTStatus == "HTTP_REQUEST"){
                return RECDATA
            } else if (MicrobitIoTStatus == "HTTP_REQUESTFailed"){
                return "requestFailed"
            }
            _timeout += 1
            if (_timeout > timwout){
                return "timeOut"
            }
        }
    }
    /**
     * The HTTP get request.url(string):URL:time(ms): private long maxWait
     * @param time set timeout, eg: 10000
    */
    //% weight=79
    //% blockId=MicroitIoT_http_get
    //% block="http(get) | url %url| timeout(ms) %time"
    //% advanced=false
    export function MicrobitIoT_http_get(url: string, time: number): string {
        MicrobitIoT_ParaRunCommand(GET_URL, url)
        return MicrobitIoT_http_wait_request(time);
    }

    /**
     * The HTTP post request.url(string): URL; content(string):content
     * time(ms): private long maxWait
     * @param time set timeout, eg: 10000
    */
    //% weight=78
    //% blockId=MicrobitIoT_http_post
    //% block="http(post) | url %url| content %content| timeout(ms) %time"
    export function MicrobitIoT_http_post(url: string, content: string, time: number): string {
        let tempStr = ""
        tempStr = url + "," + content;
        MicrobitIoT_ParaRunCommand(POST_URL, tempStr)
        return MicrobitIoT_http_wait_request(time);
    }

    /**
     * The HTTP put request,Obloq.put() can only be used for http protocol!
     * url(string): URL; content(string):content; time(ms): private long maxWait
     * @param time set timeout, eg: 10000
    */
    //% weight=77
    //% blockId=MicrobitIoT_http_put
    //% block="http(put) | url %url| content %content| timeout(ms) %time"
    export function MicrobitIoT_http_put(url: string, content: string, time: number): string {
        let tempStr = ""
        tempStr = url + "," + content;
        MicrobitIoT_ParaRunCommand(PUT_URL, tempStr)
        return MicrobitIoT_http_wait_request(time);
    }

    /**
     * Get IP address.
    */
    //% weight=51
    //% blockId=MicrobitIoT_wifi_ipconfig
    //% block="ipconfig"
    //% advanced=true
    export function MicrobitIoT_wifi_ipconfig(): string {
        return MicrobitIoT_IP;
        //MicrobitIoT_readValue(READ_IP)
    }


    /**
     * Send the ping.time(ms): private long maxWait
     * @param time to timeout, eg: 10000
    */
    //% weight=49
    //% blockId=Obloq_send_ping
    //% block="sendPing"
    //% advanced=true
    export function MicrobitIoT_send_ping(): boolean {
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E;
        buf[1] = RUN_COMMAND;
        buf[2] = SEND_PING;
        pins.i2cWriteBuffer(0x10, buf);
        MicrobitIoT_CheckStatus("PingOK");
        /*
        while (true) {
            if (MicrobitIoTStatus == "PingOK") {
                break;
            }
            basic.pause(50);
        }*/
        return true;
    }


    /**
     * Get the software version.time(ms): private long maxWait
     * @param time to timeout, eg: 10000
    */
    //% weight=50
    //% blockId=MicrobitIoT_get_version
    //% block="get version"
    //% advanced=true
    export function MicrobitIoT_get_version(): string {
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E;
        buf[1] = RUN_COMMAND;
        buf[2] = GET_VERSION;
        pins.i2cWriteBuffer(0x10, buf);
        MicrobitIoT_CheckStatus("READ_VERSION");
        return RECDATA
    }


    /**
     * Heartbeat request.time(ms): private long maxWait
     * @param time to timeout, eg: 10000
    */
    //% weight=48
    //% blockId=MicrobitIoT_get_heartbeat
    //% block="get heartbeat"
    //% advanced=true
    export function MicrobitIoT_get_heartbeat(): boolean {
        return true
    }

    /**
     * Stop the heartbeat request.
    */
    //% weight=47
    //% blockId=MicrobitIoT_stop_heartbeat
    //% block="stop heartbeat"
    //% advanced=true
    export function MicrobitIoT_stop_heartbeat(): boolean {
        return true
    }

    function MicrobitIoT_GetData(len: number): void {
        RECDATA = ""
        let tempbuf = pins.createBuffer(1)
        tempbuf[0] = 0x22
        pins.i2cWriteBuffer(0x10, tempbuf);
        let tempRecbuf = pins.createBuffer(len)
        tempRecbuf = pins.i2cReadBuffer(0x10, len, false)
        for (let i = 0; i < len; i++) {
            RECDATA += String.fromCharCode(tempRecbuf[i])
        }
    }

    function MicrobitIoT_InquireStatus(): void {
        let buf = pins.createBuffer(3)
        let tempId = 0
        let tempStatus = 0
        buf[0] = 0x1E
        buf[1] = READ_STATUS
        buf[2] = 0x06
        pins.i2cWriteBuffer(0x10, buf);
        let recbuf = pins.createBuffer(2)
        recbuf = pins.i2cReadBuffer(0x10, 2, false)
        tempId = recbuf[0]
        tempStatus = recbuf[1]
        /*
        serial.writeString("tempId=")
        serial.writeNumber(tempId)
        serial.writeString("\r\ntempStatus=")
        serial.writeNumber(tempStatus)
        serial.writeString("\r\n")*/

        switch (tempId) {
            case READ_PING:
                if (tempStatus == PING_OK) {
                    MicrobitIoTStatus = "PingOK"
                } else {
                    MicrobitIoTStatus = "PingERR"
                }
                break;
            case READ_WIFISTATUS:
                if (tempStatus == WIFI_CONNECTING) {
                    serial.writeString("WIFI_CONNECTING\r\n")
                    MicrobitIoTStatus = "WiFiConnecting"
                } else if (tempStatus == WIFI_CONNECTED) {
                    serial.writeString("WIFI_CONNECTED\r\n")
                    MicrobitIoTStatus = "WiFiConnected"
                } else if (tempStatus == WIFI_DISCONNECT) {
                    serial.writeString("WIFI_CONNECTED\r\n")
                    MicrobitIoTStatus = "WiFiDisconnect"
                } else {
                    serial.writeString("else\r\n");
                }
                break;
            case READ_MQTTSTATUS:
                if (tempStatus == MQTT_CONNECTED) {
                    MicrobitIoTStatus = "MQTTConnected"
                } else if (tempStatus == MQTT_CONNECTERR) {
                    MicrobitIoTStatus = "MQTTConnectERR"
                }
                break;
            case READ_SUBSTATUS:
                if (tempStatus == SUB_TOPIC_OK) {
                    MicrobitIoTStatus = "SubTopicOK"
                } else if (tempStatus == SUB_TOPIC_Ceiling) {
                    MicrobitIoTStatus = "SubTopicCeiling"
                } else {
                    MicrobitIoTStatus = "SubTopicERR"
                }
                break;
            case READ_IP:
                MicrobitIoTStatus = "READ_IP"
                MicrobitIoT_GetData(tempStatus)
                MicrobitIoT_IP = RECDATA
                //serial.writeString(MicrobitIoT_IP)
                break;
            case SUB_TOPIC0:
                MicrobitIoTStatus = "READ_TOPICDATA"
                MicrobitIoT_GetData(tempStatus)
                if (Topic0CallBack != null) {
                    Topic0CallBack();
                }
                serial.writeString("sub_topic\r\n");
                break;
            case SUB_TOPIC1:
                serial.writeString("SUB_TOPIC1");
                MicrobitIoTStatus = "READ_TOPICDATA"
                MicrobitIoT_GetData(tempStatus)
                if (Topic1CallBack != null) {
                    Topic1CallBack();
                }
                break;
            case SUB_TOPIC2:
                serial.writeString("SUB_TOPIC2");
                MicrobitIoTStatus = "READ_TOPICDATA"
                MicrobitIoT_GetData(tempStatus)
                if (Topic2CallBack != null) {
                    Topic2CallBack();
                }
                break;
            case SUB_TOPIC3:
                serial.writeString("SUB_TOPIC3");
                MicrobitIoTStatus = "READ_TOPICDATA"
                MicrobitIoT_GetData(tempStatus)
                if (Topic3CallBack != null) {
                    Topic3CallBack();
                }
                break;
            case SUB_TOPIC4:
                serial.writeString("SUB_TOPIC4");
                MicrobitIoTStatus = "READ_TOPICDATA"
                MicrobitIoT_GetData(tempStatus)
                if (Topic4CallBack != null) {
                    Topic4CallBack();
                }
                break;
            case HTTP_REQUEST:
                serial.writeString("HTTP_REQUEST");
                MicrobitIoTStatus = "HTTP_REQUEST"
                MicrobitIoT_GetData(tempStatus)
                break;
            case READ_VERSION:
                serial.writeString("get version\r\n")
                MicrobitIoTStatus = "READ_VERSION"
                MicrobitIoT_GetData(tempStatus)
                break;
            default:
                break;
        }
        basic.pause(200);
    }
    basic.forever(function () {
        MicrobitIoT_InquireStatus();
    })



        /**
     * OLED
     */
    //% blockId=oled_show_text
    //% weight=99
    //% line.min=0 line.max=7
    //% text.defl="DFRobot"
    //% block="OLED show line %line|text %text"
    //% shim=OLED::showText
    //% subcategory="OLED"
    export function showUserText(line: number, text: string): void {
        return;
    }
    /**
     * initialises the i2c OLED display
     * @param line line num (8 pixels per line), eg: 0
     * @param n value , eg: 2019
     */
    //% blockId=oled_show_number
    //% weight=98
    //% line.min=0 line.max=7
    //% block="OLED show line %line|number %n"
    //% shim=OLED::showNumber
    //% subcategory="OLED"
    export function showUserNumber(line: number, n: number): void {
        return;
    }

    /**
     * clears the screen.
     */
    //% blockId=oled_clear_screen
    //% block="clear OLED display"
    //% icon="\uf1ec" 
    //% shim=OLED::clearDisplay
    //% subcategory="OLED"
    export function clear(): void {
        return;
    }

    //% blockId=oled_draw_Line
    //% block="OLED draw line start x1%x1|y1%y1| end x2%x2|y2%y2"
    //% icon="\uf1ec" 
    //% shim=OLED::drawLine
    //% subcategory="OLED"
    export function drawUserLine(x1: number, y1: number, x2: number, y2: number):void{
        return;
    }
    

} 