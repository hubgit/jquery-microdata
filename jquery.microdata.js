/*
 * jQuery Microdata v1.3
 * https://github.com/hubgit/jquery-microdata
 *
 * Copyright 2014 Alf Eaton
 * Released under the MIT license
 * http://git.macropus.org/mit-license/
 *
 * Date: 2014-01-13
 */
 (function($) {
	// get all items of a certain type
	$.fn.items = function(itemtype) {
		return this.find('[itemscope]').filter(function() {
			return attrs.call(this, 'itemType').get().indexOf(itemtype) !== -1;
		});
	};

	// all nodes with a certain property name
	$.fn.property = function(name) {
		return propertyNodes.apply(this).filter(function(item) {
			return attrs.call(this, 'itemProp').get().indexOf(name) !== -1;
		});
	};

	// get/set the value of matched elements
	$.fn.value = function(value) {
		// convenience method for getting/setting single property values of an item
		if (this.is('[itemscope]')) {
			switch (typeof value) {
				// get/set a single property
				case 'string':
					if (arguments.length === 1) {
						// get a single property
						return this.property(value).value();
					}

					// set a single property
					this.property(value).value(arguments[1]);

					return this;

				// set the value of multiple properties
				case 'object':
					var nodes = this;

					$.each(value, function(name, value) {
						nodes.property(name).value(value);
					});

					return this;
			}
		}

		// get value
		if (typeof value === 'undefined') {
			return itemValue.call(this);
		}

		// set a single value
		itemValue.call(this, value);
	};

	// get all values of a property as an array
	$.fn.values = function(expanded) {
		return this.map(function() {
			var node = $(this);

			return node.is('[itemscope]') ? microdata.call(node, expanded) : itemValue.call(node);
		}).get();
	};

	// all property nodes, including those in referenced nodes
	var propertyNodes = function() {
		var refs = attrs.call(this, 'itemRef').map(function() {
			return document.getElementById(this);
		});

		var nodes = $.merge($(refs), this);

		return nodes.find('[itemprop]').not(nodes.find('[itemscope] [itemprop]'));
	};

	// get a space-separated attribute as an array
	var attrs = function(attribute) {
		return $(this).map(function() {
			return (this.getAttribute(attribute) || '').split(/\s+/);
		});
	};

	// get or set the value of a node
	var itemValue = function(value) {
		var getting = value == null;

		if (this.is('[itemscope]')) {
			if (!getting) {
				throw 'Not allowed to set the value of an itemscope node';
			}

			return this;
		}

		var node = this.get(0);

		switch (node.nodeName) {
			case 'META':
			return getting ? $.trim(this.attr('content')) : this.attr('content', value);

			case 'DATA':
			return getting ? $.trim(this.attr('value')) : this.attr('value', value);

			case 'METER':
			return getting ? $.trim(this.attr('value')) : this.attr('value', value);

			case 'TIME':
			if (getting) {
				if (this.attr('datetime')) {
					return $.trim(this.attr('datetime'));
				}

				return $.trim(this.text());
			}
			return this.attr('datetime', value);

			case 'AUDIO':
			case 'EMBED':
			case 'IFRAME':
			case 'IMG':
			case 'SOURCE':
			case 'TRACK':
			return getting ? node.src : this.attr('src', value);

			case 'A':
			case 'AREA':
			case 'LINK':
			return getting ? node.href : this.attr('href', value);

			case 'OBJECT':
			return getting ? node.data : this.attr('data', value);

			default:
			return getting ? $.trim(this.text()) : this.text(value);
		}
	};

	// get all properties as a key/value(s) object
	var microdata = function(expanded) {
		if (this.length > 1) {
			return this.map(function() {
				return microdata.call($(this), expanded);
			}).get();
		};

		// the object always includes an itemtype
		var data = {
			type: expanded ? attrs.call(this, 'itemType').get() : attrs.call(this, 'itemType').get(0)
		};

		propertyNodes.apply(this).map(function() {
			var node = $(this);
			var property = node.value();

			if (property instanceof jQuery) {
				property = microdata.call(property, expanded);
			}

			attrs.call(this, 'itemProp').each(function(index, name) {
				if (expanded) {
					if (typeof data[name] == 'undefined') {
						data[name] = [];
					}

					data[name].push(property);
				} else {
					if (typeof data[name] == 'undefined') {
						data[name] = property; // first item
					} else if ($.isArray(data[name])) {
						data[name].push(property); // more items
					} else {
						data[name] = [data[name], property];
					}
				}
			});
		});

		return data;
	};
}(jQuery));
