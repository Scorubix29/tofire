namespace wifi {

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

    export function connectWiFi(ssid: string, password: string) {
        serial.redirect(SerialPin.P0, SerialPin.P1, BaudRate.BaudRate115200)
        serial.writeLine("AT+RST")
        basic.pause(2000)
        serial.writeLine("AT+CWMODE=1")
        basic.pause(1000)
        serial.writeLine(`AT+CWJAP="${ssid}","${password}"`)
        basic.pause(5000)
    }

    export function sendData(sensor: string, value: number) {
        sendToFirebase(sensor, value)
    }
}
