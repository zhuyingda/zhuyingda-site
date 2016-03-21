'use strict';
var os = require('os');
var address = os.networkInterfaces().en0 ? os.networkInterfaces().en0[1].address : '127.0.0.1';

module.exports = {
    host: address
};