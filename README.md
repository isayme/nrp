nrp
===
This is reverse proxy in Node.js.

Install
=======
```
npm install nrp2
```

Example
=======
Below is a reverse proxy example of `www.google.com`:
```
var NRP = require('nrp2');

var google = new NRP({
    host: 'www.google.com', // the DOMAIN that will be proxied
    port: 443,              // the PORT of the DOMAIN, default 80/443
    ssl: true,              // use HTTPS of not, default false
    key: 'nrp-key.pem',     // only used when SSL is true, see more detail below section
    cert: 'nrp-cert.pem',   // only used when SSL is true, see more detail below section
});

// the `listen` is same with [listen](https://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback) in `Node.js`.
google.listen(443);
```

key&cert files
==============
To proxy HTTPS website, you should provide both key & cert files.

You can use `nrp-key.pem` & `nrp-cert.pem` in `test` folder. But if you want create yours, please try commands:
```
$ openssl genrsa -out nrp-key.pem 1024
$ openssl req -new -key nrp-key.pem -out nrp-cert.csr
$ openssl x509 -req -in nrp-cert.csr -signkey nrp-key.pem -out nrp-cert.pem
```

Contact
=======
`Email`: `isaymeorg@gmail.com`
