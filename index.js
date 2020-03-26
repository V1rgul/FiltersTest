var fs	= require('fs'),
	_ = require('lodash');

var argv = require('minimist')(process.argv.slice(2));


Array.prototype.mapFilter = function(fn){
	return this.reduce(function(a,d){
		try {
			var c = fn(d);
			if(c) a.push(c);
		}catch(Exception){}
		return a;
	}, []);
};

Object.prototype.forEach = function(fn){
	var self = this;
	for(var key in self){
		if(self.hasOwnProperty(key)){
			fn(self[key], key);
		}
	}
};

Object.prototype.map = function(fn){
	var r = {};
	this.forEach(function(val, key){
		r[key] = fn(val, key);
	});
	return r;
};

Object.prototype.mapFilter = function(fn){
	var r = {};
	this.forEach(function(val, key){
		try {
			var p = fn(val, key);
			if(p) r[key] = p;
		} catch (Exception){}
	});
	return r;
}
;


var imu = String(fs.readFileSync("IMU", "utf8"));
imu = imu.split('\n');
//imu = imu.mapFilter(JSON.parse);
imu = imu.mapFilter(function(d){
	return (JSON.parse(d)).map(parseFloat);
});

console.log("Entries:", imu.length);



//DEBUG
//imu = imu.slice(-5);
//console.log(imu);

var freq = 1;
var filters = {
	"time"		: function(d, step, time){ return time; },
	"data"		: function(d, step){ return d; },
	"lowPass"	: (function(f){
		var acc = 0, RC = 1/(2*Math.PI*f);
		return function(data, step){
			var a = step / (RC+step);
			acc = (1-a)*acc + (a)*data;
			return acc;
		};
	})(freq),
	"doubleExp"	: (function(f){
		var s = 0, b = 0, RC = 1/(2*Math.PI*f);
		return function(data, step){
			var a = step / (RC+step);
			var s_ = (a)*data + (1-a)*(s+b);
			b = (a)*(s_-s) + (1-a)*b;
			s = s_;
			return s;
		};
	})(freq)	
};


var dataField = "ax";

var first = imu[0].timestamp;
var last = 0;
var values = imu.map(function(d){
	var step = d.timestamp-last;
	last = d.timestamp;
	if(step > 1) step = 1;
	return filters.map(function(val, key){
		return val(d[dataField], step, d.timestamp-first);
	});
});

// var dataPlotly = filters.mapFilter(function(val, key){
// 	if(key == "time") return;
// 	return {
// 		x: values.map(function(d){return d.time;}),
// 		y: values.map(function(d){return d[key];}),
// 		name: key
// 	};
// });

//console.log(dataPlotly);

// if(!argv.p){
// 	console.log("use -p to publish to Plotly");
// }else{
// 	var plotly = require('plotly')('v1rgul','ug9fe51gkw');

// 	plotly.plot(dataPlotly, {}, function (err, msg) {
// 	    console.log(msg);
// 	    if(msg && msg.url) require('open')(msg.url+".embed");
// 	});
// }


//[{time:0,data:100,lowpass:100},{}]

//console.log(values[0]);




var dataGnuPlot = Object.keys(filters).mapFilter(function(key){
	if(key == "time") return;
	return {
		data: values.map(function(d){ return [d.time, d[key]]; }),
		title: key
	};
});

// console.log("dataGnuPlot",dataGnuPlot);
// console.log("dataGnuPlot[0]",dataGnuPlot[0]);

console.log("plotting");

var gnuplot = require('gnu-plot');
var plot = gnuplot();


plot.plot(dataGnuPlot);

