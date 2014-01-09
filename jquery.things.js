(function($) {
	// get all items of a certain type
	$.fn.things = function(itemtype) {
		return this.find('[itemscope]')
			.filter(function() {
				return this.getAttribute('itemtype') == itemtype;
			})
			.map(function() {
				return new Thing(this);
			});
	};

	// get or set the itemValue of a node
	$.fn.value = function(value) {
		if (this.is('[itemscope]')) {
			if (typeof value != 'undefined') {
				throw 'Not allowed to set the value of an itemscope node';
			}

			return new Thing(this);
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

	$.fn.attrs = function(attribute) {
		var text = this.attr(attribute);

		if (!text) {
			return [];
		}

		return $.grep(text.split(/\s+/), function(item) {
			return item;
		});
	}

	/* Thing */

	var Thing = function(node) {
		this.node = $(node);
		this.propertyList = this.properties();
	};

	// build an array of [name, node] property pairs
	Thing.prototype.properties = function() {
		var refs = $.map(this.node.attrs('itemref'), function(ref) {
			return document.getElementById(ref);
		});

		var nodes = $.merge($(refs), this.node);

		return nodes.find('[itemprop]')
			.not(nodes.find('[itemscope] [itemprop]'))
			.map(function() {
				var node = $(this);

				return $.map(node.attrs('itemprop'), function(propertyName) {
					return [[propertyName, node]];
				});
			});
	};

	// all nodes with a certain property name
	Thing.prototype.nodes = function(name) {
		return this.propertyList
			.filter(function() {
				return this[0] == name;
			})
			.map(function() {
				return this[1];
			});
	}

	// get the value of a single node or multiple nodes by name
	Thing.prototype.get = function(name, plural) {
		var properties = this.nodes(name).map(function() {
			return this.value();
		});

		return plural ? properties.toArray() : properties[0];
	};

	// set the value of a single node or multiple nodes by name
	Thing.prototype.set = function(name, value) {
		this.nodes(name).each(function() {
			$(this).value(value);
		});

		return this;
	};


	// properties as a data object
	Thing.prototype.data = function(name, value) {
		if (typeof value !== 'undefined' && typeof value !== 'boolean') {
			return this.set(name, value);
		}

		if (typeof name !== 'undefined') {
			return this.get(name, value);
		}

		var data = {
			type: this.node.attr('itemtype'),
		};

		this.propertyList.each(function() {
			var name = this[0];
			var property = this[1].value();

			if (property instanceof Thing) {
				property = property.data();
			}

			if (typeof data[name] == 'undefined') {
				data[name] = property; // first item (literal)
			} else if ($.isArray(data[name])) {
				data[name].push(property); // more items (array)
			} else {
				data[name] = [data[name], property]; // second item (array)
			}
		});

		return data;
	};
}(jQuery));
