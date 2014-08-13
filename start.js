var exec = require('child_process').exec;

// This is where we launch all of our different servers.
// They are on different processes so scaling parts of our web app is more manageable
// and crashing errors only bring down their local server, not the whole app!

// Basic procedure is 
// 1. stop existing processes started by this script
// 2. start processes
// 3. 




var stopApi =  exec('pm2 delete dash-api', function(err, stdout, stderr) {
	// if (err) return console.log(err)
});
var stopGui = exec('pm2 delete dash-gui', function(err, stdout, stderr) {
	// if (err) return console.log(err)
});
var stoppedApi = false;
var stoppedGui = false;

// Event handelrs for stop executions
stopApi.on('close', function (data) {
	stoppedApi = true;

	if(stoppedApi && stoppedGui) {
		start()
	}
});

stopGui.on('close', function (data) {
  	stoppedGui = true;
  	if(stoppedApi && stoppedGui) {
		start()
	}
});

// Start up function
var start = function() {
	var startApi = exec('pm2 start servers/gui/server.js --watch --name dash-gui -e tmp/logs/gui-err.log -o tmp/logs/gui.log -f',
		function(err, stdout, stderr) {
			if (err) return console.log(err)
		}
	);
	var startGui = exec('pm2 start servers/api/server.js --watch --name dash-api -e tmp/logs/api-err.log -o tmp/logs/api.log -f',
		function(err, stdout, stderr) {
			if (err) return console.log(err)
		}
	);
	var startedApi = false;
	var startedGui = false;

	startApi.on('close', function (data) {
	  	startedApi = true;
	  	if(startedGui && startedApi) {
			list()
		}
	});

	startGui.on('close', function (data) {
	  	startedGui = true;
	  	if(startedGui && startedApi) {
			list()
		}
	});
	
}

// Display all our processes
var list = function() {
	var processes = exec('pm2 list', function(err, stdout, stderr) {
		if (err) return console.log(err)
	});

	processes.stdout.on('data', function (data) {
		console.log(data);
	})
}
