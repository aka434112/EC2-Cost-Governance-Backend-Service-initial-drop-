var cluster = require('cluster');
var domain = require('domain');
var maxCPUs = require('os').cpus().length;

var numWorkers = 0;

if (cluster.isMaster) {
    cluster.on('exit', function (worker) {
      var exitCode = worker.process.exitCode;
      //console.error('Child worker ' + worker.process.pid + ' has died. [Exit Code: ' + exitCode + ']');
      console.info('Forking a new child worker.');
      cluster.fork();
    });
  
    while (numWorkers < maxCPUs) {
      cluster.fork();
      numWorkers++;
    }
  } else {
    var childDomain = domain.create();
  
    childDomain.on('error', function (error) {
      try {
        // exit the child process after 30 seconds
        // of grace period
        var killTimer = setTimeout(function () {
          process.exit(1);
        }, 30000);
        killTimer.unref();
  
        console.error(error);
        //console.error(error.stack);
  
        cluster.worker.kill();
      } catch (err) {
        console.error(err);
        //console.error(err.stack);
      }
    });
  
    childDomain.run(function () {
      require('./app')
    });
  }