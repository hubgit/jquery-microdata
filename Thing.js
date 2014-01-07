var Thing = function(node) {
	this.node = node;
	this.propertyList = node.properties;
};

// all the properties with this name
Thing.prototype.properties = function(name) {
	return this.propertyList[name] || [];
};

// map a node to an object
Thing.prototype.get = function(propertyName) {
	return this.properties(propertyName).map(function(node) {
		if (node.itemType) {
			var item = new Thing(node);

			return item.data();
		}

		return node.itemValue;
	});
};

// properties serialised to JSON
Thing.prototype.data = function() {
	var data = {
		type: this.node.itemType,
	};

	this.propertyList.names.forEach(function(name) {
		data[name] = this.get(name);
	}, this);

	return data;
};