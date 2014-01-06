var Thing = function(node) {
	this.node = node;
	this.propertyList = $(node).properties;
};

Thing.prototype = {
	// all the properties with this name
	properties: function(name) {
		return this.propertyList[name] || [];
	},
	// the first property with this name
	property: function(name) {
		return this.propertyList[name] ? this.propertyList[name][0] : null;
	},
	// the value of the first property with this name
	value: function(name) {
		return this.propertyList[name] ? this.propertyList[name][0].itemValue : null;
	},
	// properties serialised to JSON
	serialize: function() {
		return {
			type: this.type,
			name: this.name,
		};
	},
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