var NRP = require('../lib/nrp.js');

var httpbin = new NRP({
    host: 'httpbin.org'
});


httpbin.listen(8000);

