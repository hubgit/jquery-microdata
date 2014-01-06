(function($) {
	/* jQuery methods for DOM elements */

	$.fn.getItems = function(itemtype) {
		return this.find('[itemscope]').filter(function() {
			return this.getAttribute('itemtype') == itemtype;
		});
	};

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

	// alias getProperties() to a properties getter
	Object.defineProperty($.fn, 'properties', {
		get: function() {
			return this.getProperties();
		}
	});

	// allow document.getElementById to be used in map()
	var getElementById = document.getElementById.bind(document);

	// split an attribute on spaces
	var spaceSeparate = function(text) {
		return text.split(/\s+/).filter(function() { return this });
	};

	/* HTMLPropertiesCollection */

	var HTMLPropertiesCollection = function(node) {
		this.node = node;
	};

	HTMLPropertiesCollection.prototype = [];

	HTMLPropertiesCollection.prototype.push = function(item) {
		var name = item[0];

		if (typeof this[name] === 'undefined') {
			this[name] = new PropertyNodeList;
		}

		this[name].push(item[1]);

		Array.prototype.push.call(this, item);
	};

	HTMLPropertiesCollection.prototype.namedItem = function(name) {
		return this[name];
	};

	Object.defineProperty(HTMLPropertiesCollection.prototype, 'names', {
		get: function() {
			return this.reduce(function(list, item) {
				if (list.indexOf(item[0]) === -1) {
					list.push(item[0]);
				}

				return list;
			}, []);
		}
	});

	/* PropertyNodeList */

	var PropertyNodeList = function() {};
	PropertyNodeList.prototype = [];

	PropertyNodeList.prototype.getValues = function() {
		return this.map(function(item, index) {
			return getValue(item[0]);
		});
	};

	Object.defineProperty(PropertyNodeList.prototype, 'values', {
		get: function() {
			return this.getValues();
		}
	});

	var getValue = function(node) {
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
	};

	// alias getValue() to a itemValue getter
	Object.defineProperty($.fn, 'itemValue', {
		get: function() {
			return getValue(this[0]);
		}
	});
}(jQuery));
