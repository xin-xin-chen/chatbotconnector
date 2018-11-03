var util = require('./util');
var requestify = require('requestify');
var login_data = util.getDestinationLogin("successfactors");

var searchJobDepartments = function (request, response) {
  return new Promise(
    function (resolve, reject) {
      var aMessage = [];
      var aBtn = [];
      login_data.then(function (value) {
        requestify.request(value.destinationConfiguration.URL + "JobRequisition?$format=json&$filter=workHours ne 'null'&$top=5&$select=department", {
          method: 'GET',
          headers: {
            'Authorization': value.authTokens[0].type + " " + value.authTokens[0].value,
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          var body = response.getBody().d.results;
          for (var x = 0; x < body.length; x++) {
            var struct = {
              title: body[x].department,
              value: body[x].department
            }
            aBtn.push(struct);
          }
          aMessage.push({
            type: 'quickReplies',
            content: {
              title: 'For which department do you want to search?',
              buttons: aBtn
            }
          });
          return resolve(aMessage);
        });
      });
    });
}

var searchJob = function (request, response) {
  return new Promise(
    function (resolve, reject) {
      
      var aMessage = [];
      var aBtn = [];
      
      login_data.then(function (value) {
        requestify.request(value.destinationConfiguration.URL + "JobRequisition?$format=json&$filter=workHours ne 'null'&$top=5&$select=department", {
          method: 'GET',
          headers: {
            'Authorization': value.authTokens[0].type + " " + value.authTokens[0].value,
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          var body = response.getBody().d.results;
          for (var x = 0; x < body.length; x++) {
            var struct = {
              title: body[x].department,
              value: body[x].department
            }
            aBtn.push(struct);
          }
          aMessage.push({
            type: 'quickReplies',
            content: {
              title: 'For which department do you want to search?',
              buttons: aBtn
            }
          });
          return resolve(aMessage);
        });
      });
    });
}




module.exports = {
  searchJobDepartments,
  searchJob
}