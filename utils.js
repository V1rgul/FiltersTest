let runtime = function(){
	Array.prototype.mapFilter = function(fn){
		return this.reduce(function(a,d){
			try {
				let c = fn(d)
				if(c) a.push(c)
			}catch(Exception){}
			return a
		}, [])
	}

	Object.prototype.forEach = function(fn){
		let self = this
		for(let key in self){
			if(self.hasOwnProperty(key)){
				fn(self[key], key)
			}
		}
	}

	Object.prototype.map = function(fn){
		let r = {}
		this.forEach(function(val, key){
			r[key] = fn(val, key)
		})
		return r
	}

	Object.prototype.mapFilter = function(fn){
		let r = {}
		this.forEach(function(val, key){
			try {
				let p = fn(val, key)
				if(p) r[key] = p
			} catch (Exception){}
		})
		return r
	}


}


module.exports = {
	runtime,
}
