$(function() {
	var displayData = function(data, parent) {
		var items = {};

		data.each(function() {
			var key = this[0];
			var value = this[1];

			if (typeof items[key] == 'undefined') {
				var row = $('<tr/>').appendTo(parent);
				$('<th/>', { text: key }).appendTo(row);

				var cell = $('<td/>').appendTo(row);
				items[key] = cell;
			}

			var container = $('<div/>').appendTo(items[key]);

			if (typeof value == 'object') {
				displayData(value, $('<table/>').appendTo(container));
			} else {
				$('<div/>').text(value).appendTo(container);
			}
		});
	};

	$('#albumlist').getItems('http://schema.org/MusicAlbum').each(function() {
		var data = $(this).getData();
		displayData(data, $('<table/>').appendTo('body'));
	});
})
