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

    /*read para value*/
    let READ_PING = 0x01
    let READ_WIFISTATUS = 0x02
    let READ_IP = 0x03
    let READ_MQTTSTATUS = 0x04
    let READ_SUBSTATUS = 0x05
    let READ_TOPICDATA = 0x06

    /*para status */
    let PING_ERR = 0x00
    let PING_OK = 0x01
    let WIFI_DISCONNECT = 0x00
    let WIFI_CONNECTING = 0x02
    let WIFI_CONNECTED = 0x03
    let MQTT_CONNECTED = 0x01
    let MQTT_CONNECTERR = 0x02
    let SUB_TOPIC_OK = 0x01
    let SUB_TOPIC_ERR = 0x02


    let WIFI_NAME = ""
    let WIFI_PASSWORLD = ""
    let MQTT_SERVER = ""
    let MQTT_PORT = ""
    let MQTT_ID = ""
    let MQTT_PASSWORLD = ""
    let Topic_0 = ""

    export enum aMotors {
        //% blockId="M1" block="M1"
        M1 = 0,
        //% blockId="M2" block="M2"
        M2 = 1
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

    function sumString(num: number): string {
        let str = "";
        if (num < 0x0A) {
            str += num.toString();
        } else {
            switch (num) {
                case 0x0A:
                    str += "a";
                    break;
                case 0x0B:
                    str += "b";
                    break;
                case 0x0C:
                    str += "c";
                    break;
                case 0x0D:
                    str += "d";
                    break;
                case 0x0E:
                    str += "e";
                    break;
                case 0x0F:
                    str += "f";
                    break;
                default:
                    break;

            }
        }
        return str;
    }
    function numberToString(tempbuf: number[], len: number): string {
        let ret = "";
        let temp = 0;
        for (let i = 0; i < len; i++) {
            temp = (tempbuf[i] & 0xF0) >> 4;
            ret += sumString(temp);
            temp = (tempbuf[i] & 0x0F);
            ret += sumString(temp);
        }
        return ret;
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
        }
        if (index == 1) {
            buf[0] = 0x02;
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
        }
        if (motors == 1) {
            buf[0] = 0x02;
        }
        buf[1] = 0;
        buf[2] = 0;
        pins.i2cWriteBuffer(0x10, buf);
    }

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
    }

    function  MicrobitIoT_setPara(cmd :number,para :string):void{
        let buf = pins.createBuffer(para.length + 4);
        buf[0] = 0x1E
        buf[1] = SET_PARA
        buf[2] = cmd
        buf[3] = para.length
        for (let i = 0; i < para.length; i++)
            buf[i + 4] = para[i].charCodeAt(0)
        pins.i2cWriteBuffer(0x10, buf);
    }

    function MicrobitIoT_runCommand(cmd :number):void{
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E
        buf[1] = RUN_COMMAND
        buf[2] = cmd
        pins.i2cWriteBuffer(0x10, buf);
    }

    function MicrobitIoT_readStatus(para :number):number{
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E
        buf[1] = READ_STATUS
        buf[2] = para
        pins.i2cWriteBuffer(0x10, buf);
        let recbuf = pins.createBuffer(2) 
        recbuf = pins.i2cReadBuffer(0x10, 2, false)
        return recbuf[1]
    }
    function MicrobitIoT_ParaRunCommand(cmd :number, data :string):void{
        let buf = pins.createBuffer(data.length + 4)
        buf[0] = 0x1E
        buf[1] = RUN_COMMAND
        buf[2] = cmd
        buf[3] = data.length
        for(let i = 0; i < data.length; i++)
            buf[i + 4] = data[i].charCodeAt(0)
        pins.i2cWriteBuffer(0x10, buf);
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
        MicrobitIoT_send_ping();
        MicrobitIoT_send_ping();
        MicrobitIoT_send_ping();
        MicrobitIoT_setPara(SETWIFI_NAME, SSID)
        MicrobitIoT_setPara(SETWIFI_PASSWORLD, PASSWORD)
        if (servers == SERVERS.China){
            MicrobitIoT_setPara(SETMQTT_SERVER, OBLOQ_MQTT_EASY_IOT_SERVER_CHINA)
        }else{
            MicrobitIoT_setPara(SETMQTT_SERVER, OBLOQ_MQTT_EASY_IOT_SERVER_GLOBAL)
        }
        MicrobitIoT_setPara(SETMQTT_PORT, "1883")
        MicrobitIoT_setPara(SETMQTT_ID, IOT_ID)
        MicrobitIoT_setPara(SETMQTT_PASSWORLD, IOT_PWD)
        MicrobitIoT_runCommand(CONNECT_WIFI)
        while (MicrobitIoT_readStatus(READ_WIFISTATUS) != 0x03){
            basic.pause(200)
        }
        MicrobitIoT_runCommand(CONNECT_MQTT);
        while (MicrobitIoT_readStatus(READ_MQTTSTATUS) != MQTT_CONNECTED) {
            basic.pause(200)
        }
        MicrobitIoT_ParaRunCommand(SUB_TOPIC0, IOT_TOPIC);
        while (MicrobitIoT_readStatus(READ_SUBSTATUS) != SUB_TOPIC_OK) {
            basic.pause(200)
        }

    }

    //% weight=200
    //% blockId=MicrobitIoT_add_topic
    //% block="subscribe additional %top |: %IOT_TOPIC"
    //% top.fieldEditor="gridpicker" top.fieldOptions.columns=2
    //% advanced=true
    export function MicrobitIoT_add_topic(top: TOPIC, IOT_TOPIC: string): void {

    }
    /**
     * @param Mess to Mess ,eg: "mess"
     */
    //% weight=99
    //% blockId=MicrobitIoT_SendMessage block="Send Message %string| to |%TOPIC"
    export function MicrobitIoT_SendMessage(Mess: string, Topic: TOPIC): void {

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
        return ""
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
        return ""
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
        return ""
    }

    /**
     * Get IP address.
    */
    //% weight=51
    //% blockId=MicrobitIoT_wifi_ipconfig
    //% block="ipconfig"
    //% advanced=true
    export function MicrobitIoT_wifi_ipconfig(): string {
        return ""
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
        return OBLOQ_BOOL_TYPE_IS_FALSE
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
        return OBLOQ_STR_TYPE_IS_NONE
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
        return OBLOQ_BOOL_TYPE_IS_FALSE
    }

    /**
     * Stop the heartbeat request.
    */
    //% weight=47
    //% blockId=MicrobitIoT_stop_heartbeat
    //% block="stop heartbeat"
    //% advanced=true
    export function MicrobitIoT_stop_heartbeat(): boolean {
        return OBLOQ_BOOL_TYPE_IS_FALSE
    }

} 