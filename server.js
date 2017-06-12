var express = require('express');
var app = express();
const threshold = 100;
global.sensorValue = 100;
// global.switchValue = false;


app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});


app.get('/check_sensor', function (req, res) {
   res.send({
     triggered: sensorValue > threshold
   });
})

// app.post('/toggle_switch/:value', function (req, res) {
//   switchValue = (req.params.value == 'true');
//   res.send({
//     success: true,
//     switchValue: switchValue
//   });
// })

app.post('/update_sensor/:value', function (req, res) {
  sensorValue = req.params.value;
  res.send({
    success: true,
    sensorValue: sensorValue
  });
})

app.post('/shut_down', function (req, res) {
  //TODO send to arduino

  //for demo purposes, reset the sensorValue
  sensorValue = 0
  res.send({
    success: true
  });
})

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("listening at http://%s:%s", host, port)

})
