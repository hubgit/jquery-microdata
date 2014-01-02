(function($) {
	var getElementById = document.getElementById.bind(document);

	var spaceSeparate = function(text) {
		return text.split(/\s+/).filter(function() { return this });
	}

	$.fn.getItems = function(itemtype) {
		return this.find('[itemscope]').filter(function() {
			return this.getAttribute('itemtype') == itemtype;
		});
	};

	$.fn.getProperties = function() {
		if (this.attr('itemref')) {
			$.merge(this, spaceSeparate(this.attr('itemref')).map(getElementById));
		}

		return this.find('[itemprop]').not(this.find('[itemscope] [itemprop]')).map(function() {
			var data = $(this).getData();

			return spaceSeparate(this.getAttribute('itemprop')).map(function(property) {
				return [property, data];
			});
		});
	};

	$.fn.getValue = function() {
		var node = this.get(0);

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

	$.fn.getData = function() {
		if (this.is('[itemscope]')) {
			return this.getProperties();
		}

		var data = this.getValue();
		var dataType = 'string'; // TODO: schema

		switch (dataType) {
			case 'number':
				return Number(data);

			case 'string':
			case 'url':
				return String(data);

			case 'boolean':
				return Boolean(data);

			case 'date':
				return new Date(data);

			default:
				console.log('Unknown schema type: ' + dataType);
				return null;
		}
	};
}(jQuery));
