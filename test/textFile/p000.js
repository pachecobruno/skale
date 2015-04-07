#!/usr/local/bin/node --harmony

// textFile -> count

var co = require('co');
var fs = require('fs');
var ugrid = require('../../lib/ugrid-context.js')();

process.on("exit", function () {console.assert(ugrid.grid.id !== undefined);});

co(function *() {
	yield ugrid.init();

	var v = [1, 2, 3, 4, 5];
	var t0 = v.reduce(function(a, b) {return a + b + '\n'}, '');
	fs.writeFileSync('/tmp/v', t0);

	var dist = yield ugrid.textFile('/tmp/v').count();

	console.log(dist);

	console.assert(dist == v.length);

	ugrid.end();
}).catch(function (err) {
	console.error(err.stack);
	process.exit(1);
});
