var Thing = function(node) {
	this.node = node;
	this.propertyList = $(node).properties;
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
		type: $(this.node).itemType,
		name: this.value('name'),
		url: this.value('url')
	};
};