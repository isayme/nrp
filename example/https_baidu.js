var NRP = require('../lib/nrp.js');

var httpbin = new NRP({
    ssl: true,
    key: './test/nrp-key.pem',
    cert: './test/nrp-cert.pem',
    host: 'https://www.baidu.com'
});


httpbin.listen(443);
