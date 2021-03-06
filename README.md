nrp
===
A reverse proxy in Node.js.

Install
=======
```
npm install nrp2
```

Example
=======
Below is a reverse proxy example of `https://www.google.com`:

	var NRP = require('nrp2');
	
	var google = new NRP({
	    host: 'https://www.google.com', // the DOMAIN that will be proxied
	    ssl: true,              // use HTTPS or not, default false
	    key: 'nrp-key.pem',     // only used when SSL is true, see more detail below section
	    cert: 'nrp-cert.pem',   // only used when SSL is true, see more detail below section
	});
	
	// the `listen` is same with [listen](https://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback) in `Node.js`.
	google.listen(443);


key&cert files
==============
To proxy HTTPS website, you should provide both key & cert files.

You can use `nrp-key.pem` & `nrp-cert.pem` in `test` folder. But if you want create yours, please try commands:

	$ openssl genrsa -out nrp-key.pem 1024
	$ openssl req -new -key nrp-key.pem -out nrp-cert.csr
	$ openssl x509 -req -in nrp-cert.csr -signkey nrp-key.pem -out nrp-cert.pem


Contact
=======
`Email`: `isaymeorg@gmail.com`
