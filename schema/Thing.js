var Thing = function(node) {
	this.node = node;
	this.propertyList = node.properties;
};

// all the properties with this name
Thing.prototype.properties = function(name) {
	return this.propertyList[name] || [];
};

// map a node to an object
Thing.prototype.map = function(propertyName) {
	return this.properties(propertyName).map(function(node) {
		if (node.itemType) {
			var itemType = node.itemType.replace(/http:\/\/schema\.org\//, '');
			var item = new window[itemType](node);

			return item.serialize();
		}

		return node.itemValue;
	});
};

// properties serialised to JSON
Thing.prototype.serialize = function() {
	return {
		type: this.node.itemType,
		name: this.map('name')[0],
		url: this.map('url')[0]
	};
};