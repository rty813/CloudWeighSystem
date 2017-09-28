var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rty813',
    database: 'Cloud_Weigh',
});

var net = require('net');
var HOST = '0.0.0.0';
var PORT = 6969;

net.createServer(function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    connection.connect();
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ": " + data);
        if (data[data.length - 1] != 35) {
            err('Err: unexcepted end', sock);
            return;
        }
        data = data.toString().substring(0, data.length - 1);
        var arr = new Array();
        arr = data.toString().split(',');

        if (arr.length != 20) {
            err('Err: Length!', sock);
            return;
        }

        var value = new Array(19);
        for (let i = 0; i < arr.length; i++) {
            switch (i) {
                case 0:
                    if (arr[0] != 'MD') {
                        err('Err: MD!', sock);
                        return;
                    }
                    break;
                case 1:
                    if (arr[i].length != 6) {
                        err('Err: id length', sock);
                        return;
                    }
                    value[0] = parseInt(arr[i]);
                    if (parseInt(value[0] / 10000) != 19) {
                        err('Err: id must start with 19!', sock);
                        return;
                    }
                    break;
                case 2:
                    if (arr[i] != '310') {
                        err('Err: version', sock);
                        return;
                    }
                    value[1] = parseInt(arr[i]);
                    break;
                case 3:
                    if (arr[i].length != 1) {
                        err('Err: status length!', sock);
                        return;
                    }
                    value[2] = parseInt(arr[i]);
                    break;
                case 4:
                    if (arr[i].length == 0) {
                        err('Err: PM2.5 NOT NULL', sock);
                    }
                    value[3] = parseFloat(arr[i]);
                    if ((value[3] < 0) || (value[3] > 500)) {
                        err('Err: PM2.5 is out of range!', sock);
                        return;
                    }
                    break;
                case 5:
                    if (arr[i].length == 0) {
                        err('Err: PM10 NOT NULL', sock);
                    }
                    value[4] = parseFloat(arr[i]);
                    if ((value[4] < 0) || (value[4] > 2000)) {
                        err('Err: PM10 is out of range!', sock);
                        return;
                    }
                    break;
                case 6:
                    value[5] = parseFloat(arr[i]);
                    if ((value[5] < 0) || (value[5] > 20)) {
                        err('Err: TSP is out of range!', sock);
                        return;
                    }
                    break;
                case 7:
                    if (arr[i].length == 0) {
                        err('Err: NOISE NOT NULL', sock);
                    }
                    value[6] = parseFloat(arr[i]);
                    if ((value[6] > 130) || (value[6] < 30)) {
                        err('Err: Noise is out of range!', sock);
                        return;
                    }
                    break;
                case 8:
                    if (arr[i].length == 0) {
                        err('Err: TEMP NOT NULL', sock);
                    }
                    value[7] = parseFloat(arr[i]);
                    if ((value[7] > 70) || (value[7] < -30)) {
                        err('Err: Temp is out of range!', sock);
                        return;
                    }
                    break;
                case 9:
                    if (arr[i].length == 0) {
                        err('Err: HUMI NOT NULL', sock);
                    }
                    value[8] = parseFloat(arr[i]);
                    if ((value[8] > 100) || (value[8] < 0)) {
                        err('Err: Humi is out of range!', sock);
                        return;
                    }
                    break;
                case 10:
                    if (arr[i].length == 0) {
                        err('Err: AIR_SPEED NOT NULL', sock);
                    }
                    value[9] = parseFloat(arr[i]);
                    if ((value[9] > 60) || (value[9] < 0)) {
                        err('Err: Air-Speed is out of range!', sock);
                        return;
                    }
                    break;
                case 11:
                    if (arr[i].length == 0) {
                        err('Err: AIR_DIRECTION NOT NULL', sock);
                    }
                    value[10] = parseFloat(arr[i]);
                    if ((value[10] > 360) || (value[10] < 0)) {
                        err('Err: Wind-Direction is out of range!', sock);
                        return;
                    }
                    break;
                case 12:
                    value[11] = parseFloat(arr[i]);
                    if ((value[11] > 1100) || (value[11] < 500)) {
                        if (value[11] != 0) {
                            err('Err: Pressure is out of range!', sock);
                            return;
                        }
                    }
                    break;
                case 13:
                    value[12] = arr[i];
                    break;
                case 14:
                    value[13] = arr[i];
                    break;
                case 15:
                    value[14] = arr[i];
                    break;
                case 16:
                    value[15] = arr[i];
                    break;
                case 17:
                    value[16] = arr[i];
                    break;
                case 18:
                    value[17] = arr[i];
                    break;
                case 19:
                    value[18] = arr[i];
                    break;
            }
            if (arr[i].length == 0) {
                value[i - 1] = null;
                continue;
            }
        }
        var addSql = 'INSERT INTO cloud_weigh(DEVICE_ID,VERSION,STATUS,PM2_5,PM10,TSP,NOISE,TEMP,HUMI,AIR_SPEED,AIR_DIRECTION,PRESSURE,OTHER1,OTHER2,OTHER3,OTHER4,OTHER5,LATITUDE,LONGITUDE) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        connection.query(addSql, value, (err, result) => {
            if (err) {
                console.log('Err: Insert - ', err.message);
                sock.write('Err: Insert!');
            } else {
                console.log('Suceess!');
                sock.write('Success!');
            }
        });
    });
    sock.on("close", function(data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        connection.end();
    });
}).listen(PORT, HOST);
console.log('Server listening on ' + HOST + ':' + PORT);

function err(msg, sock) {
    console.log(msg);
    sock.write(msg);
}