var getDestinationLogin = function (destinationName) {
    return new Promise(
        function (resolve, reject) {
            var requestify = require('requestify');
            var Base64 = require('js-base64').Base64;
            var vcap_services = JSON.parse(process.env.VCAP_SERVICES)
            var destinationEnv = vcap_services.destination[0].credentials;
            var cliendId = destinationEnv.clientid;
            var clientSecret = destinationEnv.clientsecret;
            var uri = destinationEnv.uri;
            var url = destinationEnv.url;

            requestify.request(url + '/oauth/token', {
                method: 'POST',
                body: {
                    'client_id': cliendId,
                    'grant_type': 'client_credentials'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Base64.encode(cliendId + ":" + clientSecret)
                },
                dataType: 'form-url-encoded'
            }).then(function (response) {
                var token = response.getBody().access_token;

                requestify.request(uri + '/destination-configuration/v1/destinations/' + destinationName, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(function (response) {
                    var body = response.getBody()
                    return resolve(body);
                });
            });
        });
}

module.exports = {
    getDestinationLogin
}