/*
* bot.js
*
* In this file:
* - received message from a connected channel will be transformed with Recast.AI SDK
* - received message from test command will be processed by Recast.AI
*   You can run this command for testing:
*   curl -X "POST" "http://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
*
*
* The Recast.AI SDK will handle the message and call your reply bot function (ie. replyMessage function)
*/

const recastai = require('recastai').default;

// Instantiate Recast.AI SDK
// TODO change id
const client = new recastai.build('4a8c8d84ca20f1d243675f0f952bd6bc');

/*
* Main bot function
* Parameters are:
* - body: Request body
* - response: Response of your server (can be a blank object if not needed: {})
*/

var reply = (request, response) => {
  var text = request.body['question'];
  var convid = request.body['conversation_id'];
  return client.dialog({type: 'text', content:text}, {conversationId: convid})
  .then(nlp => {
    reply = generateAnswer(nlp);
    return reply;
  })
}

/*
* Returns an answer randomly taken from a map
*/
var generateAnswer = (data) => {
  var that = this;
  return new Promise(
    function (resolve, reject) {
      //check if additional actions are needed
      var aMessage = data.messages;
      return resolve(aMessage);

      // getReplacements(data.conversation.memory.AddInfo, data.conversation.memory.AddInfoValue).
      // then(replacements => {
      //
      //   //replace all placeholder with context depending values
      //   // for (var i=0; i<aMessage.length; i++){
      //   //   if (typeof aMessage[i].content === "string"){
      //   //     aMessage[i].content = aMessage[i].content.replace(/%\w+%/g, function(all) {
      //   //        return all in replacements ? replacements[all] : all;
      //   //     });
      //   //   }
      //   // }
      //
      //
      // });

    });
  }
  //
  // const getReplacements = (sInfo, sValue) =>{
  //   return new Promise(
  //     function (resolve, reject) {
  //       var sPerson = "";//that.getPerson(data, sEntity);
  //       var oJoke = {
  //         "setup" : "",
  //         "punchline": ""
  //       };
  //       if (sValue === "JOKE"){
  //         getJoke(clientReq).then(result => {
  //             oJoke = JSON.parse(result);
  //             console.log(result);
  //             return resolve({"%PERSON%": sPerson, "%SFURL%": "https://salesdemo4.successfactors.com",
  //             "%JOKE%" : oJoke.setup, "%PUNCHLINE%":oJoke.punchline,
  //             "%GIPHY%" : ""});
  //         });
  //       } else if (sValue === "GIPHY" || sInfo === "NOTFOUND" ) {
  //         getGiphy(clientReq, "what-confused").then(giphy => {
  //           return resolve({"%PERSON%": sPerson, "%SFURL%": "https://salesdemo4.successfactors.com",
  //           "%JOKE%" : oJoke.setup, "%PUNCHLINE%":oJoke.punchline,
  //           "%GIPHY%" : giphy});
  //         })
  //       } else {
  //         return resolve({"%PERSON%": sPerson, "%SFURL%": "https://salesdemo4.successfactors.com",
  //         "%JOKE%" : oJoke.setup, "%PUNCHLINE%":oJoke.punchline,
  //         "%GIPHY%" : ""});
  //       }
  //   });
  // }
  /**
  * retrieve giphy
  */
  // const getGiphy = (request, sSearch) => {
  //   var apiKey = 'JKtT3NMO3Yw8wTAmGn1fxAXI8pL4tzXV';
  //   return new Promise(
  //     function (resolve, reject) {
  //       request('https://api.giphy.com/v1/gifs/random?api_key=' + apiKey + '&tag=' + sSearch + '&rating=G', function (error, response, body) {
  //         // if (response.statusCode === '200')
  //         var sURL = JSON.parse(body).data.fixed_height_downsampled_url;
  //         sURL = sURL.replace(/media[0-9]+.giphy.com/g, 'i.giphy.com');
  //         return resolve(sURL);
  //       });
  //     });
  //   }
  module.exports = {
    reply
  }
