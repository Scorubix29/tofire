namespace wifi {

    /**
     * Connect to WiFi using SSID and password
     * @param ssid WiFi SSID
     * @param password WiFi password
     */
    //% block="connect WiFi SSID %ssid|password %password"
    //% weight=90
    //% ssid.shadow="text" password.shadow="text"
    export function connectWiFi(ssid: string, password: string) {
        serial.redirect(SerialPin.P2, SerialPin.P1, BaudRate.BaudRate115200)
        serial.writeLine("AT+RST")
        basic.pause(2000)
        serial.writeLine("AT+CWMODE=1")
        basic.pause(1000)
        serial.writeLine(`AT+CWJAP="${ssid}","${password}"`)
        basic.pause(5000)
    }

    function sendToFirebase(sensor: string, value: number) {
        let data = `{"value": ${value}}`
        let length = data.length
        let host = "192.168.248.29"  // Replace with your PC IP
        let port = "8080"
        let path = `/update/${sensor}`

        serial.writeLine(`AT+CIPSTART="TCP","${host}",${port}`)
        basic.pause(1000)

        let req =
            `POST ${path} HTTP/1.1\r\n` +
            `Host: ${host}\r\n` +
            `Content-Type: application/json\r\n` +
            `Content-Length: ${length}\r\n\r\n` +
            data

        serial.writeLine(`AT+CIPSEND=${req.length}`)
        basic.pause(1000)
        serial.writeString(req)
        basic.pause(2000)
        serial.writeLine("AT+CIPCLOSE")
    }

    /**
     * Send data to Firebase through local proxy
     * @param sensor Sensor name/path
     * @param value Numeric value to send
     */
    //% block="send data sensor %sensor|value %value"
    //% weight=80
    //% sensor.shadow="text"
    export function sendData(sensor: string, value: number) {
        sendToFirebase(sensor, value)
    }
}
