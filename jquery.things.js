/*
 * jQuery Things v1.0
 * https://github.com/hubgit/jquery-things
 *
 * Copyright 2014 Alf Eaton
 * Released under the MIT license
 * http://git.macropus.org/mit-license/
 *
 * Date: 2014-01-09
 */
 (function($) {
	// get all items of a certain type
	$.fn.things = function(itemtype) {
		return this.find('[itemscope]').filter(function() {
			return $(this).itemType().indexOf(itemtype) !== -1;
		});
	};

	$.fn.itemType = function() {
		var text = this.attr('itemType');
		return text ? text.split(/\s+/) : [];
	};

	$.fn.itemProp = function() {
		var text = this.attr('itemProp');
		return text ? text.split(/\s+/) : [];
	};

	$.fn.itemRef = function() {
		var text = this.attr('itemRef');
		return text ? text.split(/\s+/) : [];
	};

	// get or set the itemValue of a node
	$.fn.itemValue = function(value) {
		if (this.is('[itemscope]')) {
			if (typeof value != 'undefined') {
				throw 'Not allowed to set the value of an itemscope node';
			}

			return this;
		}

		switch (this.get(0).nodeName) {
			case 'META':
			return typeof value == 'undefined' ? $.trim(this.attr('content')) : this.attr('content', value);

			case 'DATA':
			return typeof value == 'undefined' ? $.trim(this.attr('value')) : this.attr('value', value);

			case 'METER':
			return typeof value == 'undefined' ? $.trim(this.attr('value')) : this.attr('value', value);

			case 'TIME':
			if (typeof value == 'undefined') {
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
			return typeof value == 'undefined' ? this.get(0).src : this.attr('src', value);

			case 'A':
			case 'AREA':
			case 'LINK':
			return typeof value == 'undefined' ? this.get(0).href : this.attr('href', value);

			case 'OBJECT':
			return typeof value == 'undefined' ? this.get(0).data : this.attr('data', value);

			default:
			if (typeof value == 'undefined') {
				return $.trim(this.text());
			}

			return this.text(value);
		}
	};

	// build an array of [name, node] property pairs
	$.fn.propertyList = function() {
		// cache the property list (TODO: watch for changes)
		if (typeof this.propertyListCache !== 'undefined') {
			return this.propertyListCache;
		}

		var refs = $.map(this.itemRef(), function(ref) {
			return document.getElementById(ref);
		});

		var nodes = $.merge($(refs), this);

		return this.propertyListCache = nodes.find('[itemprop]')
			.not(nodes.find('[itemscope] [itemprop]'))
			.map(function() {
				var node = $(this);

				return $.map(node.itemProp(), function(propertyName) {
					return [[propertyName, node]];
				});
			});
	};

	// all nodes with a certain property name
	$.fn.propertyNodes = function(name) {
		var items = $.grep(this.propertyList(), function(item) {
			return item[0] == name;
		});

		return $.map(items, function(item) {
			return item[1];
		});
	};

	// all values with a certain property name
	$.fn.propertyValues = function(name) {
		return $.map(this.propertyNodes(name), function(item) {
			return item.itemValue();
		});
	};

	// properties as a data object
	$.fn.microdata = function(name, value) {
		if (this.length > 1) {
			return this.map(function() {
				return $(this).microdata();
			}).toArray();
		};

		// get/set a specific property
		if (typeof name !== 'undefined') {
			// get the value of multiple nodes by name
			if (typeof value === 'boolean') {
				return this.propertyValues(name);
			}

			// set the value of a single node or multiple nodes by name
			if (typeof value !== 'undefined') {
				$.each(this.propertyNodes(name), function() {
					$(this).itemValue(value);
				});

				return this;
			}

			// get the value of a single node
			return this.propertyValues(name)[0];
		}

		// the object always includes an itemtype
		var data = {
			type: this.itemType()
		};

		$.each(this.propertyList(), function() {
			var name = this[0];
			var property = this[1].itemValue();

			if (property instanceof jQuery) {
				property = property.microdata();
			}

			if (typeof data[name] == 'undefined') {
				data[name] = [];
			}

			data[name].push(property);
		});

		return data;
	};
}(jQuery));
