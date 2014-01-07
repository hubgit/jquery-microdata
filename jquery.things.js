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
			return new Thing(this);
		}

		switch (this.get(0).nodeName) {
			case 'META':
			return value == null ? this.attr('content').trim() : this.attr('content', value);

			case 'DATA':
			return value == null ? this.attr('value').trim() : this.attr('value', value);

			case 'METER':
			return value == null ? this.attr('value').trim() : this.attr('value', value);

			case 'TIME':
			if (value == null) {
				if (this.attr('datetime')) {
					return this.attr('datetime').trim();
				}

				return this.text().trim();
			}
			return this.attr('datetime', value);

			case 'AUDIO':
			case 'EMBED':
			case 'IFRAME':
			case 'IMG':
			case 'SOURCE':
			case 'TRACK':
			return value == null ? this.get(0).src : this.attr('src', value);

			case 'A':
			case 'AREA':
			case 'LINK':
			return value == null ? this.get(0).href : this.attr('href', value);

			case 'OBJECT':
			return value == null ? this.get(0).data : this.attr('data', value);

			default:
			if (value == null) {
				return this.text().trim();
			}

			return this.text(value);
		}
	};

	$.fn.attrs = function(attribute) {
		var text = this.attr(attribute);

		if (!text) {
			return [];
		}

		return text.split(/\s+/).filter(function() {
			return this;
		});
	}

	/* Thing */

	var Thing = function(node) {
		this.node = $(node);
		this.propertyList = this.properties();
	};

	// build an array of [name, node] property pairs
	Thing.prototype.properties = function() {
		var refs = this.node.attrs('itemref').map(function(ref) {
			return document.getElementById(ref);
		});

		var nodes = $.merge($(refs), this.node);

		return nodes.find('[itemprop]')
			.not(nodes.find('[itemscope] [itemprop]'))
			.map(function() {
				var node = $(this);
				var props = node.attrs('itemprop');

				return $.map(props, function(propertyName) {
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

	// get the value of  single node or multiple nodes by name
	Thing.prototype.get = function(name) {
		var plural = name.match(/\+$/);

		if (plural) {
			name = name.replace(/\+$/, '');
		}

		var properties = this.nodes(name)
			.map(function() {
				return this.value()
			});

		return plural ? properties.toArray() : properties[0];
	};

	// properties as a data object
	Thing.prototype.data = function() {
		var data = {
			type: this.node.attr('itemtype'),
		};

		this.propertyList.each(function() {
			var name = this[0];
			var node = this[1];
			var property = node.value();

			if (property instanceof Thing) {
				property = property.data();
			}

			if (typeof data[name] == 'undefined') {
				data[name] = property;
			} else if ($.isArray(data[name])) {
				data[name].push(property);
			} else {
				data[name] = [data[name], property];
			}
		});

		return data;
	};
}(jQuery));
