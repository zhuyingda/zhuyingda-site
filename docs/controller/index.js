'use strict';

var Base = require('./base.js');
var detector = require('detector');

module.exports = think.controller(Base, {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction: function(self){
    //auto render template file index_index.html
    var visitor = detector.parse(self.http.req.headers['user-agent']);
    if(visitor.device.name == "mac" || visitor.device.name=="pc"){
      return self.display();
    }
    return self.display('docs/index/mobile');
  }
});