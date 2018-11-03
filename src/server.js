/*

* server.js
* This file is the core of your bot
*
* It creates a little server using express
* So, your bot can be triggered throught "/" route
*
* This file was made for locally testing your bot
* You can test it by running this command
* curl -X "POST" "http://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
* You might modify the server port ^^^^  depending on your configuration in config.js file

*/

const express = require('express')
const bodyParser = require('body-parser')

const REQUIRE_AUTH = false;
const AUTH_TOKEN = '4PZPPUDUGFZROIP6LOUUI4TX5CAV7FTZ';


// Edit distance for strings to fuzzily match order status values
String.prototype.editDistance = function(string) {
  var a = this, b = string + "", m = [], i, j, min = Math.min;

  if (!(a && b)) return (b || a).length;

  for (i = 0; i <= b.length; m[i] = [i++]);
  for (j = 0; j <= a.length; m[0][j] = j++);

  for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
          m[i][j] = b.charAt(i - 1) == a.charAt(j - 1)
              ? m[i - 1][j - 1]
              : m[i][j] = min(
                  m[i - 1][j - 1] + 1,
                  min(m[i][j - 1] + 1, m[i - 1 ][j] + 1))
      }
  }

  return m[b.length][a.length];
}

// Load configuration
require('./config')
const bot = require('./bot')
const util = require('./util')

// Load dummy data
const dummy = require('./dummyData')

// Load Successfactors Data Queries
//const successfactors = require('./successfactors')

// Start Express server
const app = express()
app.set('port', process.env.PORT || 5000)
app.use(bodyParser.json())

//Description of API
app.get('/', function (req, res) {
  res.send('This is the API of a recast.ai chatbot connector.');
})


// ask question and forward it to recast.ai
app.use('/api/askQuestion', (req, res) => {
  // check if client is allowed to use this api
  if (REQUIRE_AUTH) {
    if (req.body['authtoken'] !== AUTH_TOKEN) {
      return res.status(401).send('Unauthorized');
    }
  }
  var sQuestion = req.body['question'];
  bot.reply(req, res)
    .then(success => {
      for (var x = 0; x < success.length; x++) {
        success[x].author = "bot";
      }
      res.status(200).send(success);
    }).catch(error => {
      console.log('Error in your bot:', error)
      if (!res.headersSent) { res.sendStatus(400) }
    })
})


// get list
app.get('/api/dummy/getlist', (req, res) => {
  dummy.getList(req, res)
    .then(success => {
      res.status(200).send({
        replies: success
      })
    }).catch(error => {
      console.log('Error in getList:', error)
      if (!res.headersSent) { res.sendStatus(400) }
    })
});

//execute the Successfactors Search for Job Departments
app.post('/api/sfsf/search-job-departments', (req, res) => {
  successfactors.searchJobDepartments(req, res)
    .then(success => {
      res.status(200).send({
        replies: success
      })
    }).catch(error => {
      console.log('Error in your successfactors search:', error)
      if (!res.headersSent) { res.send(400).send({ error }) }
    })
});

//execute the Successfactors Search for Jobs
app.post('/api/sfsf/search-open-jobs', (req, res) => {
  successfactors.searchJob(req, res)
    .then(success => {
      res.status(200).send({
        replies: success
      })
    }).catch(error => {
      console.log('Error in your successfactors search:', error)
      if (!res.headersSent) { res.send(400).send({ error }) }
    })
});

if (!process.env.REQUEST_TOKEN) {
  console.log('ERROR: process.env.REQUEST_TOKEN variable in src/config.js file is empty ! You must fill this field with the request_token of your bot before launching your bot locally')
  process.exit(0)
} else {
  // Run Express server, on right port
  app.listen(app.get('port'), () => {
    console.log('Our bot is running on port', app.get('port'))
  })
}
