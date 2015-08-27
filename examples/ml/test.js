#!/usr/local/bin/node --harmony
'use strict';

var co = require('co');
var ugrid = require('../..');

require('child_process').execSync('rm -rf /tmp/ugrid/');

co(function *() {
    var uc = yield ugrid.context();

    // console.log('\n# parallelize collect')
    // var res = yield uc.parallelize([1, 2, 3], 2).collect();
    // console.log(res);

    // console.log('\n# parallelize reduce')
    // var res = yield uc.parallelize([1, 2, 3], 3).reduce(function(a, b) {return a + b}, 0);
    // console.log(res);

    // console.log('\n# parallelize map collect')
    // function by2(e) {return e * 2;}
    // var res = yield uc.parallelize([1, 2, 3], 1).map(by2).collect();
    // console.log(res);

    // console.log('\n# parallelize map map collect')
    // function by2(e) {return e * 2;}
    // var res = yield uc.parallelize([1, 2, 3], 2).map(by2).map(by2).collect();
    // console.log(res);

    // console.log('\n# parallelize map persist collect')
    // function by2(e) {return e * 2;}
    // var v = [1, 2, 3];
    // var a = uc.parallelize(v, 2).map(by2).persist();
    // console.log(yield a.collect());
    // v.push(4);
    // console.log(yield a.collect());

    // console.log('\n# union collect')
    // var a = uc.parallelize([1, 2, 3], 1);
    // var b = uc.parallelize([4, 5, 6], 1);
    // var c = a.union(b).persist();
    // yield c.collect();
    // var res = yield c.collect();
    // console.log(res);

    var v = [['hello', 1], ['world', 3], ['hello', 2], ['world', 4]]
    console.log('\n# reduceByKey collect on ' + JSON.stringify(v))
    function r1(a, b) {return a + b;}
    var a = uc.parallelize(v, 2);
    var res = yield a.reduceByKey(r1, 0).collect();
    console.log(res);

    var v = [['hello', 1], ['world', 3], ['hello', 2], ['world', 4]]
    console.log('\n# groupByKey collect on ' + JSON.stringify(v))
    var a = uc.parallelize(v, 2);
    var res = yield a.groupByKey().collect();
    console.log(res);

    var v = [['hello', 1], ['hello', 2], ['world', 3], ['world', 4]]
    console.log('\n# groupByKey reduceByKey collect on ' + JSON.stringify(v));
    function r2(a, b) {
    	var sum = 0;
    	for (var i = 0; i < b.length; i++) sum += b[i];
    	a[0] += sum;
    	return a;
    }
    var a = uc.parallelize(v, 2);
    var res = yield a.groupByKey().reduceByKey(r2, [0]).collect();
    console.log(res);
 
    // console.log('\n# RandomSVMData')
    // var N = 4, D = 2, seed = 1,  P = 2;
    // var a = uc.randomSVMData(N, D, seed, P);
    // var res = yield a.collect();
    // console.log(res)

    // var file = '/Users/cedricartigue/work/ugrid/examples/ml/rank.data';
    // console.log('\n# textFile on ' + file)
    // var res = yield uc.textFile(file).collect();
    // console.log(res)

    // console.log('\n# parallelize sample collect')
    // var res = yield uc.parallelize([1, 2, 3, 4], 2).sample(true, 0.5).collect();
    // console.log(res);

    var v1 = [['hello', 1], ['world', 2]];
    var v2 = [['hello', 3], ['world', 4]];
    console.log('\n# coGroup collect')
    var a = uc.parallelize(v1, 2);
    var b = uc.parallelize(v2, 2);
    var res = yield a.coGroup(b).collect();
    console.log(JSON.stringify(res));

    var v1 = [['hello', 1], ['world', 2], ['solo', 0]];
    var v2 = [['hello', 3], ['world', 4], ['world', 5]];
    console.log('\n# join collect on')
    console.log(v1);
    console.log(v2);
    var a = uc.parallelize(v1, 2);
    var b = uc.parallelize(v2, 2);
    var res = yield a.join(b).collect();
    console.log(JSON.stringify(res));

    var v1 = [['hello', 1], ['world', 2], ['solo', 0]];
    var v2 = [['hello', 3], ['world', 4], ['world', 5]];
    console.log('\n# leftOuterJoin collect')
    var a = uc.parallelize(v1, 2);
    var b = uc.parallelize(v2, 2);
    var res = yield a.leftOuterJoin(b).collect();
    console.log(JSON.stringify(res));

    var v1 = [['hello', 1], ['world', 2], ['solo', 0]];
    var v2 = [['hello', 3], ['world', 4], ['world', 5]];
    console.log('\n# rightOuterJoin collect')
    var a = uc.parallelize(v1, 2);
    var b = uc.parallelize(v2, 2);
    var res = yield a.rightOuterJoin(b).collect();
    console.log(JSON.stringify(res));

    // var v1 = [['hello', 1], ['world', 2], ['solo', 0]];
    // console.log('\n# sample WITHOUT replacement collect')
    // var a = uc.parallelize(v1, 2);
    // var frac = 0.5;
    // var withReplacement = false;
    // var res = yield a.sample(withReplacement, frac).collect();
    // console.log(JSON.stringify(res));

    // var v1 = [['hello', 1], ['world', 2], ['solo', 0]];
    // console.log('\n# sample WITH replacement collect')
    // var a = uc.parallelize(v1, 2);
    // var frac = 1.1;
    // var withReplacement = true;
    // var res = yield a.sample(withReplacement, frac).collect();
    // console.log(JSON.stringify(res));

    var v1 = [['hello', 1], ['hello', 1], ['world', 0]];
    console.log('\n# distinct collect on ');
    console.log(v1);
    var a = uc.parallelize(v1, 2);
    var res = yield a.distinct().collect();
    console.log(JSON.stringify(res));

    // var v1 = [['hello', 1], ['hello', 1], ['world', 0], ['world', 4], ['world', 1]];
    // console.log('\n# lookup')
    // var a = uc.parallelize(v1, 2);
    // var res = yield a.lookup('world');
    // console.log(JSON.stringify(res));

    // var v1 = [['hello', 1], ['hello', 1], ['world', 0], ['world', 1]];
    // console.log('\n# countByValue')
    // var a = uc.parallelize(v1, 2);
    // var res = yield a.countByValue();
    // console.log(JSON.stringify(res));

    // var v1 = [['hello', 1], ['hello', 1], ['world', 0], ['world', 1], ['test', 5]];
    // console.log('\n# countByKey')
    // var a = uc.parallelize(v1, 2);
    // var res = yield a.countByKey();
    // console.log(JSON.stringify(res));

    var v1 = [['hello', 1], ['world', 2], ['solo', 0], ['solo', 0]];
    var v2 = [['hello', 1], ['world', 4], ['solo', 0]];
    console.log('\n# intersection collect')
    console.log(v1)
    console.log(v2)    
    var a = uc.parallelize(v1, 2);
    var b = uc.parallelize(v2, 2);
    var res = yield a.intersection(b).collect();
    console.log(JSON.stringify(res));

    var v1 = [['hello', 1], ['world', 2], ['solo', 0], ['solo', 0]];
    var v2 = [['hello', 1], ['world', 4], ['solo', 0]];    
    console.log('\n# subtract collect on')
    console.log(v1)
    console.log(v2)    
    var a = uc.parallelize(v1, 2);
    var b = uc.parallelize(v2, 2);
    var res = yield a.subtract(b).collect();
    console.log(JSON.stringify(res));

    // var v1 = [['hello', 1], ['world', 2], ['solo', 0], ['solo', 0]];
    // console.log('\n# saveAsTextFile')
    // var a = uc.parallelize(v1, 2);
    // var res = yield a.saveAsTextFile('/tmp/myOutputFile');

    // var v1 = [['hello', 1], ['world', 2], ['solo', 0], ['solo', 0]];
    // console.log('\n# keys collect')
    // var a = uc.parallelize(v1, 2);
    // var res = yield a.keys().collect();
    // console.log(res);

    // var v1 = [['hello', 1], ['world', 2], ['solo', 0], ['solo', 0]];
    // console.log('\n# values collect')
    // var a = uc.parallelize(v1, 2);
    // var res = yield a.values().collect();
    // console.log(res);    

    uc.end();
}).catch(ugrid.onError);
