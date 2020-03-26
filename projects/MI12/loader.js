let fs = require('fs'), path = require('path')
let utils = require("../../utils")
utils.runtime()





let filePath = path.join(__dirname, "IMU")
let fieldTime = "timestamp"
let fieldData = "ax"





let inputData = String(fs.readFileSync(filePath, "utf8"))
inputData = inputData.split('\n')
//imu = imu.mapFilter(JSON.parse)
inputData = inputData.mapFilter(function(d){
	let o = JSON.parse(d)
	return o && [
		parseFloat(o[fieldTime]),
		parseFloat(o[fieldData]),
	]
})

module.exports = inputData
