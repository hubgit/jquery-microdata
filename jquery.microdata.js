/*
 * jQuery Microdata v1.0
 * https://github.com/hubgit/jquery-microdata
 *
 * Copyright 2014 Alf Eaton
 * Released under the MIT license
 * http://git.macropus.org/mit-license/
 *
 * Date: 2014-01-09
 */
 (function($) {
	// get all items of a certain type
	$.fn.items = function(itemtype) {
		return this.find('[itemscope]').filter(function() {
			return $(this).itemType().indexOf(itemtype) !== -1;
		});
	};

	$.fn.itemType = function() {
		return String(this.attr('itemType')).split(/\s+/);
	};

	$.fn.itemProp = function() {
		return String(this.attr('itemProp')).split(/\s+/);
	};

	$.fn.itemRef = function() {
		return String(this.attr('itemRef')).split(/\s+/);
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
	// TOOD: cache this on the node
	$.fn.propertyList = function() {
		var refs = $.map(this.itemRef(), function(ref) {
			return $('#' + ref);
		});

		var nodes = $.merge($(refs), this);

		return nodes.find('[itemprop]')
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
		return this.propertyList().filter(function() {
			return this[0] == name;
		}).map(function() {
			return this[1];
		});
	};

	// all values with a certain property name
	$.fn.propertyValues = function(name) {
		return this.propertyNodes(name).map(function() {
			return this.itemValue();
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
				this.propertyNodes(name).each(function() {
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

		this.propertyList().each(function() {
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
