var NRP = require('../lib/nrp.js');

var httpbin = new NRP({
    host: 'http://httpbin.org'
});


httpbin.listen(8000);
