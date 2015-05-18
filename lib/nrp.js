var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');

var onRequest = function(http, options) {
    return function(request, response) {
        console.info(request.method + ' ' + request.url);

        request.headers.host = options.host;
        if (request.headers.referer) {
            var r = url.parse(request.headers.referer);
            r.host = options.host;
            request.headers.referer = url.format(r);
        }
        var opts = {
            'host': options.host,
            'port': options.port,
            'method': request.method,
            'path': request.url,
            'headers': request.headers,
        };

        var req = http.request(opts, function(res) {
            response.writeHead(res.statusCode, res.headers);
            res.pipe(response);
        });

        request.pipe(req);
    };
}

var NRP = function(options) {
    this.options = options;

    if (options.ssl) {
        options.port = options.port || 443;
        this.proxy = https.createServer({
                    key: fs.readFileSync(options.key),
                    cert: fs.readFileSync(options.cert)
                }, onRequest(https, options));
    } else {
        options.port = options.port || 80;
        this.proxy = http.createServer(onRequest(http, options));
    }

    this.proxy.on('error', function(e) {
        console.error(e);
    });

    return this;
};

NRP.prototype.listen = function(port) {
    port = port || 80;
    this.proxy.listen(port);

    return this;
};

module.exports = NRP;
