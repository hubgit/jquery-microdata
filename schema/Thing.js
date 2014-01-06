var Thing = function(node) {
	this.node = node;
	this.propertyList = $(node).properties;
};

Thing.prototype = {
	get type() {
		return $(this.node).itemType;
	},
	get name() {
		return this.value('name');
	},
	get url() {
		return this.value('url');
	}
};

// all the properties with this name
Thing.prototype.properties = function(name) {
	return this.propertyList[name] || [];
};

// the first property with this name
Thing.prototype.property = function(name) {
	return this.propertyList[name] ? this.propertyList[name][0] : null;
};

// the value of the first property with this name
Thing.prototype.value = function(name) {
	return this.propertyList[name] ? this.propertyList[name][0].itemValue : null;
};

// properties serialised to JSON
Thing.prototype.serialize = function() {
	return {
		type: this.type,
		name: this.name,
		url: this.url
	};
};