var prompt = require('prompt');
var fs = require('fs');

// Remove annoying "prompt:"
prompt.message = "";
prompt.delimiter = "";

var apiGenKey = function(length) {
    // Just produces random string using these chars
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}


    

var messages = {
  db: "Configuring MongoDB Connection...\n".green,
  api: "Configuring API Server...\n".green,
  gui: "Configuring GUI Server...\n".green,
  email: "Configuring Email app uses...\n".green,
}

// Define what we what entered
var schema = {
  properties: {
    apiHost: {
      description: messages.api+'API host:'.blue,
      default: '127.0.0.1'
    },
    apiPort: {
      description: 'API port:'.blue,
      default: '3030'
    },
    apiCoreId: {
      description: 'API Core ID:'.blue,
      default: 'core'
    },
    apiCorePass: {
      description: 'API Core Password:'.blue,
      default: 'random string',
      before: function(value) {
        if(value === "random string") {
          value = apiGenKey(64)
        }
        return value;
      }
    },
    guiHost: {
      description:  messages.gui+'GUI host:'.blue,
      default: '0.0.0.0'
    },
    guiPort: {
      description: 'GUI port:'.blue,
      default: '3020'
    },
    dbHost: {
      description: messages.db+'Mongo host:'.blue,
      default: '127.0.0.1'
    },
    dbPort: {
      description: 'Mongo port:'.blue,
      default: '27017'
    },
    dbName: {
      description: "Mongo db name:".blue,
      default: 'hapi-dash'
    },
    mailService: {
      description: messages.email+'Email service:'.blue,
      default: 'Gmail'
    },
    mailEmail: {
      description: 'Email address:'.blue,
      required: true
    },
    mailPass: {
      description: 'Email password:'.blue,
      required: true,
      message: "Password is required",
      hidden: true
    },
  }
};
//
// Start the prompt
//
prompt.start();


prompt.get(schema, function (err, result) {
  //
  // Log the results.
  //
  if(result) {
    var config = {
      db: {
        host: result.dbHost,
        port: result.dbPort,
        name: result.dbName
      },
      api: {
        host: result.apiHost,
        port: result.apiPort
      },
      coreCreds: {
          id: result.apiCoreId,
          key: result.apiCorePass,
          algorithm: 'sha256'
      },
      gui: {
        host: result.guiHost,
        port: result.guiPort
      },
      email: {
          service: result.mailService,
          auth: {
              user: result.mailEmail,
              pass: result.mailPass
          }
      }
    }

    // Text to save to config.js
    var text = "module.exports = "+JSON.stringify(config, null, 4)
    fs.exists('config.js', function (exists) {

      if(exists) {
        fs.renameSync('config.js', 'config.old.js')
        console.log('Backed up old config to config.old.js');
      } 

      fs.writeFile('config.js', text, function (err) {
        if (err) return console.log(err);
        console.log('Saved configuration: ', config);
      });
      
    });
    console.log(config)
  } else {
    console.log("\nAborted configuration!")
  }
  
});
