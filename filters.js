let filterGenerators = require("./filtersGenerators")

let freq = 4
let filters = {
	// "time"         : function(d, step, time){ return time },
	"data"         : function(d, step){ return d },
	"lowPass"      : filterGenerators.lowPass(freq),
	"lowPassDouble": filterGenerators.multi(filterGenerators.lowPass, [freq*2,freq*2]),
	"doubleExp"    : filterGenerators.doubleExp(freq, freq),
}

module.exports = filters
