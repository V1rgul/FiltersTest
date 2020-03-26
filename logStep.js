let prettyTime = require("pretty-time")





function logStep(actionName, fn){
	process.stdout.write(""+actionName+"...")
	let start = process.hrtime()
	return function logStepEnd(actionResult){
		let duration = process.hrtime(start)
		actionResult = "OK" || ""+actionResult
		process.stdout.write(actionResult + ", " + prettyTime(duration) + "\n")
	}
}


























module.exports = logStep
