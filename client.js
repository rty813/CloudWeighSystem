var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rty813',
    database: 'Cloud_Weigh',
});
function handleDisconnect() {
    connection.connect(function (err) {
        if (err) {
            console.log("进行数据库断线重连：" + new Date());
            setTimeout(handleDisconnect, 2000);   //2秒重连一次
            return;
        }
        console.log("连接数据库成功");
    });
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
handleDisconnect();

app.post('/', (req, res) => {
    var id = req.body.id;
    console.log('POST: ' + id);
    var sql = 'SELECT * FROM cloud_weigh WHERE DEVICE_ID = ?';

    connection.query(sql, id, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.end('Err: Select!');
            return;
        }
        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        res.end(JSON.stringify(result));
    });
});

app.listen(7878);