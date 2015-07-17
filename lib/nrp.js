'use strict';

var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');

var onRequest = function(http, options) {
    return function(request, response) {
        request.headers.host = options.host;
        if (request.headers.referer) {
            var r = url.parse(request.headers.referer);
            r.host = options.host;
            request.headers.referer = url.format(r);
        }

        if (request.headers['x-forwarded-for']) {
            request.headers['x-forwarded-for'] += ', ' + request.connection.remoteAddress;
        } else {
            request.headers['x-forwarded-for'] = request.connection.remoteAddress;
        }

        var opts = {
            'host': options.host,
            'port': options.port,
            'method': request.method,
            'path': request.url,
            'headers': request.headers
        };

        var req = http.request(opts, function(res) {
            response.writeHead(res.statusCode, res.headers);
            res.pipe(response);
        });

        req.on('error', function(e) {
            response.writeHead(500);
            response.end(JSON.stringify(options, null, 4) + '\n\n' + e.toString());
        });

        request.pipe(req);
    };
};

var NRP = function(options) {
    if (!(this instanceof NRP)) {
        return new NRP(options);
    }

    options = options || {};

    if (!options.host) {
        throw new Error('options.host not exist!');
    }

    var opts = url.parse(options.host);

    opts.protocol = opts.protocol || 'http:';
    if (opts.protocol !== 'http:' && opts.protocol !== 'https:') {
        throw new Error('only "http"&"https" supported!');
    }

    if (!opts.host) {
        throw new Error('host invalid!');
    }

    var protocol = opts.protocol === 'http:' ? http : https;

    if (options.ssl) {
        this.proxy = https.createServer({
            key: fs.readFileSync(options.key),
            cert: fs.readFileSync(options.cert)
        }, onRequest(protocol, opts));
    } else {
        this.proxy = http.createServer(onRequest(protocol, opts));
    }

    this.proxy.on('error', function(e) {
        console.error('http(s).createServer error: ' + e);
    });

    return this;
};

NRP.prototype.listen = function() {
    var args = Array.prototype.slice.call(arguments);
    this.proxy.listen.apply(this.proxy, args);

    return this;
};

module.exports = NRP;
