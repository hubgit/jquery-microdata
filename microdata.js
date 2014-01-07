/* helper functions */

// allow document.getElementById to be used in map()
var getElementById = document.getElementById.bind(document);

/* DOM attribute prototype */

Attr.prototype.separate = function() {
	return this.nodeValue.split(/\s+/).filter(function() { return this });
}

/* HTMLPropertiesCollection */

var HTMLPropertiesCollection = function(){};
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

var PropertyNodeList = function(){};
PropertyNodeList.prototype = [];

// get values of all properties in a property node list
PropertyNodeList.prototype.getValues = function() {
	return this.map(function(item, index) {
		return item[0].itemValue;
	});
};

/** add methods to the document */

HTMLDocument.prototype.getItems = function(itemtype) {
	var nodes = this.querySelectorAll('[itemscope]');

	return Array.prototype.filter.call(nodes, function(node) {
		return node.itemType == itemtype;
	});
};

/* add methods to DOM elements */

// get/set the itemValue of an element
Object.defineProperty(Element.prototype, 'itemValue', {
	get: function() {
		switch (this.nodeName) {
			case 'META':
			return this.getAttribute('content').trim();

			case 'DATA':
			return this.getAttribute('value').trim();

			case 'METER':
			return this.getAttribute('value').trim();

			case 'TIME':
			if (this.hasAttribute('datetime')) {
				return this.getAttribute('datetime').trim();
			}

			return this.textContent.trim();

			case 'AUDIO':
			case 'EMBED':
			case 'IFRAME':
			case 'IMG':
			case 'SOURCE':
			case 'TRACK':
			return this.src;

			case 'A':
			case 'AREA':
			case 'LINK':
			return this.href;

			case 'OBJECT':
			return this.data;

			default:
			return this.textContent.trim();
		}
	},
	set: function(value) {
		switch (this.nodeName) {
			case 'META':
			return this.setAttribute('content', value);

			case 'DATA':
			return this.setAttribute('value', value);

			case 'METER':
			return this.setAttribute('value', value);

			case 'TIME':
			return this.setAttribute('datetime', value);

			case 'AUDIO':
			case 'EMBED':
			case 'IFRAME':
			case 'IMG':
			case 'SOURCE':
			case 'TRACK':
			return this.setAttribute('src', value);

			case 'A':
			case 'AREA':
			case 'LINK':
			return this.setAttribute('href', value);

			case 'OBJECT':
			return this.setAttribute('data', value);

			default:
			return this.textContent = value;
		}
	}
});

// get/set the itemProp of an element
Element.prototype.items = function(itemtype) {
		var nodes = this.querySelectorAll('[itemscope]');

		return Array.prototype.filter.call(nodes, function(node) {
			return node.itemType == itemtype;
		});
};

// get the properties of an element
Object.defineProperty(Element.prototype, 'properties', {
	get: function() {
		var properties = new HTMLPropertiesCollection();

		var root = this.cloneNode(true);

		if (this.hasAttribute('itemref')) {
			this.getAttributeNode('itemref').separate().map(getElementById).forEach(function(ref) {
				root.appendChild(ref.cloneNode(true));
			});
		}

		var filter = {
	    	acceptNode: function(node) {
	    		if (node.hasAttribute('itemprop')) {
	    			node.getAttributeNode('itemprop').separate().map(function(propertyName) {
	    				properties.push([propertyName, node]);
	    			});
	    		}

	    		if (node.hasAttribute('itemscope')) {
	    			return NodeFilter.FILTER_REJECT;
	    		}

		    	return NodeFilter.FILTER_ACCEPT;
	    	}
	    };

		var treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filter);
		while (treeWalker.nextNode()) {}

		return properties;
	}
});

// get/set the itemProp of an element
Object.defineProperty(Element.prototype, 'itemProp', {
	get: function() {
		return this.getAttribute('itemProp');
	},
	set: function(value) {
		return this.setAttribute('itemProp', value);
	},
});

// get/set the itemType of an element
Object.defineProperty(Element.prototype, 'itemType', {
	get: function() {
		return this.getAttribute('itemType');
	},
	set: function(value) {
		return this.setAttribute('itemType', value);
	},
});

// get/set the itemRef of an element
Object.defineProperty(Element.prototype, 'itemRef', {
	get: function() {
		return this.getAttribute('itemRef');
	},
	set: function(value) {
		return this.setAttribute('itemRef', value);
	},
});

// get/set the itemId of an element
Object.defineProperty(Element.prototype, 'itemId', {
	get: function() {
		return this.getAttribute('itemId');
	},
	set: function(value) {
		return this.setAttribute('itemId', value);
	},
});
