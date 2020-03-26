
function genLowPass(f){
	let acc = 0, RC = 1/(2*Math.PI*f)
	return function(data, step){
		let a = step / (RC+step)
		acc = (1-a)*acc + (a)*data
		return acc
	}
}
function genDoubleExp(fAlpha, fGamma){
	let s = 0, b = 0
	let RCAlpha = 1/(2*Math.PI*fAlpha), RCGamma = 1/(2*Math.PI*fGamma)
	return function(data, step){
		let alpha = step / (RCAlpha+step)
		let gamma = step / (RCGamma+step)

		let s_ = (alpha)*data + (1-alpha)*(s+b)
		let delta = s_ - s
		b = (gamma)*delta + (1-gamma)*b
		// console.log("doubleExp", "alpha:", alpha, "gamma:", gamma, "s:", s, "delta:", delta, "s_:", s_)
		s = s_
		return s
	}
}
function genChain(filters){
	return function filterChain(data, step){
		return filters.reduce(
			(acc, filter) => filter(acc, step),
			data
		)
	}
}
function genMulti(generator, argsArray){
	let filterChain = argsArray.map(function(args){
		if(typeof args != Array) args = [args]
		return generator.apply(null, args)
	})
	return genChain(filterChain)
}


module.exports = {
	lowPass: genLowPass,
	doubleExp: genDoubleExp,
	chain: genChain,
	multi: genMulti,
}
