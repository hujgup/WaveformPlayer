function ObjectParamHandler() {
	var _this = this;
	var _structure = {};
	var getPath = function(path) {
		var obj = _structure;
		for (var i = 0; i < path.length; i++) {
			if (!obj.hasOwnProperty(path[i])) {
				obj[path[i]] = {};
			}
			obj = obj[path[i]];
		}
		return obj;
	};
	this.addParam = function(param) {
		var path = getPath(param.path);
		var res = !path.hasOwnProperty(param.name);
		if (res) {
			path[param.name] = param;
		}
		return res;
	};
}
function ObjectParam(name,referenceValue,pathTo,required) {
	this.name = name;
	this.referenceValue = referenceValue;
	this.path = pathTo;
	this.required = required;
}