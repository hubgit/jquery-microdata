(function($) {
	/* jQuery methods for DOM elements */

	// get all item of a certain type
	$.fn.getItems = function(itemtype) {
		return this.find('[itemscope]').filter(function() {
			return this.getAttribute('itemtype') == itemtype;
		});
	};

	// get a collection of property nodes of an item
	$.fn.getProperties = function() {
		if (this.attr('itemref')) {
			$.merge(this, spaceSeparate(this.attr('itemref')).map(getElementById));
		}

		var properties = new HTMLPropertiesCollection(this);

		this.find('[itemprop]').not(this.find('[itemscope] [itemprop]')).map(function(index, node) {
			spaceSeparate(node.getAttribute('itemprop')).map(function(propertyName) {
				properties.push([propertyName, $(node)]);
			});
		});

		return properties;
	};

	// get the value of a node
	$.fn.getItemValue = function() {
		var node = this[0];

		switch (node.nodeName) {
			case 'META':
			return node.getAttribute('content').trim();

			case 'DATA':
			return node.getAttribute('value').trim();

			case 'METER':
			return node.getAttribute('value').trim();

			case 'TIME':
			if (node.hasAttribute('datetime')) {
				return node.getAttribute('datetime').trim();
			}

			return node.textContent.trim();

			case 'AUDIO':
			case 'EMBED':
			case 'IFRAME':
			case 'IMG':
			case 'SOURCE':
			case 'TRACK':
			return node.src;

			case 'A':
			case 'AREA':
			case 'LINK':
			return node.href;

			case 'OBJECT':
			return node.data;

			default:
			return node.textContent.trim();
		}
	}

	/* helper functions */

	// allow document.getElementById to be used in map()
	var getElementById = document.getElementById.bind(document);

	// split an attribute on spaces
	var spaceSeparate = function(text) {
		return text.split(/\s+/).filter(function() { return this });
	};

	/* HTMLPropertiesCollection */

	var HTMLPropertiesCollection = function() {};

	HTMLPropertiesCollection.prototype = [];

	HTMLPropertiesCollection.prototype.push = function(item) {
		var name = item[0];

		if (typeof this[name] === 'undefined') {
			this[name] = new PropertyNodeList;
		}

		this[name].push(item[1]);

		Array.prototype.push.call(this, item);
	};

	// get properties by name from a properties collection
	HTMLPropertiesCollection.prototype.namedItem = function(name) {
		return this[name];
	};

	// get the names of properties in a properties collection
	HTMLPropertiesCollection.prototype.getNames = function(name) {
		return this.reduce(function(list, item) {
			if (list.indexOf(item[0]) === -1) {
				list.push(item[0]);
			}

			return list;
		}, []);
	};

	/* PropertyNodeList */

	var PropertyNodeList = function() {};
	PropertyNodeList.prototype = [];

	// get values of all properties in a property node list
	PropertyNodeList.prototype.getValues = function() {
		return this.map(function(item, index) {
			return $(item[0]).getItemValue();
		});
	};

	// alias getters to get* methods if Object.defineProperty is available
	// http://kangax.github.io/es5-compat-table/#Object.defineProperty
	if (typeof Object.defineProperty === 'function') {
		// get the properties of an element
		Object.defineProperty($.fn, 'properties', {
			get: function() {
				return this.getProperties();
			}
		});

		// get the itemValue of an element
		Object.defineProperty($.fn, 'itemValue', {
			get: function() {
				return this.getItemValue();
			}
		});

		// get the properties of a property node list with one element
		Object.defineProperty(PropertyNodeList.prototype, 'properties', {
			get: function() {
				return this[0].getProperties();
			}
		});

		// get the itemValue of a property node list with one element
		Object.defineProperty(PropertyNodeList.prototype, 'itemValue', {
			get: function() {
				return this[0].getItemValue();
			}
		});

		// get the names of properties in a properties collection
		Object.defineProperty(HTMLPropertiesCollection.prototype, 'names', {
			get: function() {
				return this.getNames(name);
			}
		});
	}
}(jQuery));
