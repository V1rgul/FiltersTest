const FILTERS = "./filters"
const LOADER  = "./projects/MI12/loader"



let logStep = require("./logStep")





console.log("Loading filters")
let filters = require(FILTERS)

let logStepLoader = logStep("Loading data")
let inputData = require(LOADER)
process.stdout.write("Entries: " + inputData.length + ", ")
logStepLoader()


// DEBUG
// inputData = inputData.slice(-5)
// console.log(inputData)

let logStepCalc = logStep("Calculating")
let timefirst = inputData[0][0], timePrevious = 0
let values = inputData.map(function(d){
	let timeCurrent = d[0]
	let timeStep = timeCurrent - timePrevious
	if(timeStep > 1) timeStep = 1
	timePrevious = timeCurrent

	let time = timeCurrent - timefirst
	return [
		time,
		filters.map(function(val, key){
			return val(d[1], timeStep, time)
		}),
	]
})
logStepCalc()

// console.log(values)


let dataGnuPlot = Object.keys(filters).mapFilter(function(key){
	let plotObj = {
		data: values.map( (d) => [d[0], d[1][key]] ),
		title: key,
		style: "linespoints",
	}
	return plotObj
})

// console.log("dataGnuPlot",dataGnuPlot)
// console.log("dataGnuPlot[0]",dataGnuPlot[0])

let logStepPlot = logStep("Plotting...")
let gnuplot = require('gnu-plot')
let plot = gnuplot()
plot.plot(dataGnuPlot)
logStepPlot()

