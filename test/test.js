var http = require('http');
var https = require('https');
var NRP = require('../index.js');
var assert = require('assert');

var p1 = NRP({
    host: 'http://httpbin.org',
});
p1.listen(8000);

var p2 = NRP({
    ssl: true,
    key: './test/nrp-key.pem',
    cert: './test/nrp-cert.pem',
    host: 'https://httpbin.org',
});
p2.listen(4443);

function get_test(done, http, port) {
  var req = http.request({
    path: '/user-agent',
    port: port,
    rejectUnauthorized: false,
    headers: {
      'user-agent': 'NRP Agent'
    }
  }, function(res) {
    var data = '';

    res.on('data', function(d) {
      data += d;
    });

    res.on('end', function() {
      var jd = JSON.parse(data);
      assert.equal(jd['user-agent'], 'NRP Agent');
      done();
    })
  });

  req.on('error', function(e) {
    assert.ifError(e);
    done();
  })
  req.end();
}

describe('HTTP GET', function() {
  it('user-agent should be `NRP Agent`', function(done) {
    get_test(done, http, 8000);
  });
});

describe('HTTPS GET', function() {
  it('user-agent should be `NRP Agent`', function(done) {
    get_test(done, https, 4443);
  });
});


function post_test(done, http, port) {
  var data = {
    'custname': 'isayme',
    'custtel': '88888888',
    'custemail': 'isaymeorg@gmail.com',
  }

  data = require('querystring').stringify(data);  
  var req = http.request({
    method: 'POST',
    path: '/post',
    rejectUnauthorized: false,
    port: port,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',  
      'Content-Length': data.length  
    }
  }, function(res) {
    var data = '';

    res.on('data', function(d) {
      data += d;
    });

    res.on('end', function() {
      var posts = JSON.parse(data);
      var forms = posts['form'];
      assert.equal(forms['custname'], 'isayme');
      assert.equal(forms['custtel'], '88888888');
      assert.equal(forms['custemail'], 'isaymeorg@gmail.com');
      done();
    });
  });

  req.on('error', function(e) {
    assert.ifError(e);
    done();
  })
  req.write(data);
  req.end();
}

describe('HTTP POST', function() {
  it('return data should include post data', function(done) {
    post_test(done, http, 8000);
  });
});

describe('HTTPS POST', function() {
  it('return data should include post data', function(done) {
    post_test(done, https, 4443);
  });
});
