var http = require('http');
var https = require('https');
var NRP = require('../lib/nrp.js');

var p1 = new NRP({
    host: 'httpbin.org',
    port: 80
});

p1.listen(80);

var p2 = new NRP({
    ssl: true,
    key: './nrp-key.pem',
    cert: './nrp-cert.pem',
    host: 'httpbin.org',
    port: 443
});
p2.listen(443);

var req1 = http.request({
  host: '127.0.0.1',
  path: '/user-agent',
  headers: {
    'user-agent': 'NRP agent1'
  }
}, function(res) {
  var data = '';

  res.on('data', function(d) {
    data += d;
  });

  res.on('end', function() {
    var jd = JSON.parse(data);

    console.log('HTTP test return: ' + (jd['user-agent'] === 'NRP agent1'));
  })
});
req1.end();

var req2 = https.request({
  host: '127.0.0.1',
  path: '/user-agent',
  port: 443,
  rejectUnauthorized: false,
  headers: {
    'user-agent': 'NRP agent2'
  }
}, function(res) {
  var data = '';

  res.on('data', function(d) {
    data += d;
  });

  res.on('end', function() {
    var jd = JSON.parse(data);

    console.log('HTTPS test return: ' + (jd['user-agent'] === 'NRP agent2'));
  })
});
req2.end();

console.log('press Ctrl+C to exit the test.')