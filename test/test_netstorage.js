// Original author: Astin Choi <achoi@akamai.com>

// Copyright 2016 Akamai Technologies http://developer.akamai.com.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const assert = require('assert'),
  fs = require('fs'),
  Netstorage = require('../lib/netstorage');
// Netstorage = require('netstorageapi'),
// secrets = require('./spike/secrets');

const config = JSON.parse(fs.readFileSync(__dirname + '/api-config.json'))
var NS_HOSTNAME = config.NS_HOSTNAME;
var NS_KEYNAME = config.NS_KEYNAME;
var NS_KEY = config.NS_KEY;
var NS_CPCODE = config.NS_CPCODE;

var ns = new Netstorage(NS_HOSTNAME, NS_KEYNAME, NS_KEY, true);
var temp_ns_dir = `/${NS_CPCODE}/nst_${Date.now()}`;
var temp_file = `nst_${Date.now()}.txt`;
var temp_ns_file = `${temp_ns_dir}/${temp_file}`;
const mtime_now = Math.floor(new Date().getTime() / 1000);

describe('### Netstorage test ###', function() {
  this.slow(5000)
  after(function(done) {
    try {
      fs.unlinkSync(`${__dirname}/${temp_file}`);
      fs.unlinkSync(`${__dirname}/../${temp_file}_rename`)
    } catch (err) {
      console.log(err)
    } finally {
      done();
    }

  });

  describe(`ns.dir("/${NS_CPCODE}", callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.dir(`/${NS_CPCODE}`, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        return done()
      });
    });
  });

  describe(`ns.list("/${NS_CPCODE}", { "max_entries": 5 }, callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.list(`/${NS_CPCODE}`, { "max_entries": 5 }, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        assert.equal(body.list.file.length, 5);
        done();
      });
    });
  });

  describe(`ns.mkdir("${temp_ns_dir}", callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.mkdir(temp_ns_dir, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe(`ns.upload("${__dirname}/${temp_file}", "${temp_ns_file}", callback);`, function() {
    it('should return 200 OK', function(done) {
      fs.writeFileSync(`${__dirname}/${temp_file}`, 'Hello, Netstorage API World!', 'utf8');
      ns.upload(`${__dirname}/${temp_file}`, temp_ns_file, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe(`ns.du("${temp_ns_dir}", callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.du(temp_ns_dir, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe(`ns.mtime("${temp_ns_file}", ${mtime_now}, callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.mtime(temp_ns_file, mtime_now, (error, response, body) => {
        if (error) {
          throw error
        }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe(`ns.stat("${temp_ns_file}", callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.stat(temp_ns_file, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe(`ns.symlink("${temp_ns_file}", "${temp_ns_file}_lnk", callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.symlink(temp_ns_file, `${temp_ns_file}_lnk`, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe(`ns.rename("${temp_ns_file}", "${temp_ns_file}_rename", callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.rename(temp_ns_file, `${temp_ns_file}_rename`, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe(`ns.download("${temp_ns_file}_rename", callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.download(`${temp_ns_file}_rename`, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe(`ns.delete("${temp_ns_file}_rename", callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.delete(`${temp_ns_file}_rename`, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe(`ns.delete("${temp_ns_file}_lnk", callback);`, function() {
    it('should return 200 OK', function(done) {
      ns.delete(`${temp_ns_file}_lnk`, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe(`ns.rmdir("${temp_ns_dir}", callback);`, function() {
    it('should return 200', function(done) {
      ns.rmdir(temp_ns_dir, (error, response, body) => {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });
});


describe('### Error test ###', function() {

  describe(`ns.dir("invalid ns path", callback);`, function() {
    it('should get Error object', function(done) {
      ns.dir("Invalid ns path", (error, response, body) => {
        if (error) {
          assert.equal(error.message, '[Netstorage Error] Invalid netstorage path');
        }
        done();
      });
    });
  });

  describe(`ns.list("invalid ns path", { "max_entries": 5 }, callback);`, function() {
    it('should get Error object', function(done) {
      ns.list("Invalid ns path", { "max_entries": 5 }, (error, response, body) => {
        if (error) {
          assert.equal(error.message, '[Netstorage Error] Invalid netstorage path');
        }
        done();
      });
    });
  });

  describe(`ns.list("/${NS_CPCODE}", { badObj: true }, callback);`, function() {
    it('should get Error object', function(done) {
      ns.list(`/${NS_CPCODE}`, { "max_entries": 5 }, (error, response, body) => {
        if (error) {
          assert.equal(error.message, '[Netstorage Error] Invalid netstorage path');
        }
        done();
      });
    });
  });

  describe(`ns.upload("invalid local path", "${temp_ns_file}" callback);`, function() {
    it('should get Error object', function(done) {
      ns.upload("Invalid local path", temp_ns_file, (error, response, body) => {
        if (error) {
          assert.equal(error instanceof Error, true);
        }
        done();
      });
    });
  });

  describe(`ns.download("/123456/directory/", "${__dirname}/${temp_file}" callback);`, function() {
    it('should get Error object', function(done) {
      ns.upload("/123456/directory/", `${__dirname}/${temp_file}`, (error, response, body) => {
        if (error) {
          assert.equal(error instanceof Error, true);
        }
        done();
      });
    });
  });

});


// function DoneWrap(done) {
//   var self   = this;
//   var called = false;
//
//   this.trigger = function (params) {
//     if (called) {
//         // console.warn("done has already been called");
//         // console.trace();
//         return;
//     }
//     done.apply(self, arguments);
//     called = true;
//   };
// }
