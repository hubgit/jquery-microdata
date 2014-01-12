/* set a value */

$(function() {
	var albums = $('#albumlist').things('http://schema.org/MusicAlbum');

	albums.eq(0)
		.microdata('byArtist')
		.microdata('name', 'Jesu')
		.microdata('url', 'https://en.wikipedia.org/wiki/Jesu');
});

/* display in a table - W3C interface */

$(function() {
	var table = $('<table/>').appendTo('body');
	var thead = $('<thead/>').appendTo(table);
	var tbody = $('<tbody/>').appendTo(table);

	var row = $('<tr/>').appendTo(thead);
	$('<th/>', { text: 'album' }).appendTo(row);
	$('<th/>', { text: 'artist' }).appendTo(row);

	$('#albumlist').items('http://schema.org/MusicAlbum').each(function() {
		// album
		var album = $(this);
		var row = $('<tr/>').appendTo(tbody);

		var cell = $('<td/>').appendTo(row);
		$('<a/>', {
			href: album.property('url').value(),
			text: album.property('name').value()
		}).appendTo(cell);

		// group (artist)
		album.property('byArtist').map(function() {
			var artist = this;
			var cell = $('<td/>').appendTo(row);

			$('<a/>', {
				href: artist.property('url').value(),
				text: artist.property('name').value()
			}).appendTo(cell);

			// group's members
			var members = $.map(artist.property('musicGroupMember'), function(item) {
				return item.property('name').value();
			});

			if (members.length) {
				$('<div/>', { text: 'Members: ' + members.join(', ') }).appendTo(cell);
			}

			// group's albums
			var albums = $.map(artist.property('album', true), function(item) {
				return item.property('name').value();
			});

			if (albums.length) {
				$('<div/>', { text: 'Albums: ' + albums.join(', ') }).appendTo(cell);
			}
		});
	});
});

/* display in a table - simple interface */

$(function() {
	var table = $('<table/>').appendTo('body');
	var thead = $('<thead/>').appendTo(table);
	var tbody = $('<tbody/>').appendTo(table);

	var row = $('<tr/>').appendTo(thead);
	$('<th/>', { text: 'album' }).appendTo(row);
	$('<th/>', { text: 'artist' }).appendTo(row);

	$('#albumlist').things('http://schema.org/MusicAlbum').each(function() {
		// album
		var album = $(this);
		var row = $('<tr/>').appendTo(tbody);

		var cell = $('<td/>').appendTo(row);
		$('<a/>', {
			href: album.microdata('url'),
			text: album.microdata('name')
		}).appendTo(cell);

		// group (artist)
		var artist = album.microdata('byArtist');
		var cell = $('<td/>').appendTo(row);

		$('<a/>', {
			href: artist.microdata('url'),
			text: artist.microdata('name')
		}).appendTo(cell);

		// group's members
		var members = $.map(artist.microdata('musicGroupMember+'), function(item) {
			return item.microdata('name');
		});

		if (members.length) {
			$('<div/>', { text: 'Members: ' + members.join(', ') }).appendTo(cell);
		}

		// group's albums
		var albums = $.map(artist.microdata('album+'), function(item) {
			return item.microdata('name');
		});

		if (albums.length) {
			$('<div/>', { text: 'Albums: ' + albums.join(', ') }).appendTo(cell);
		}
	});
});

/* convert to JSON */

$(function() {
	var albums = $('#albumlist').things('http://schema.org/MusicAlbum');
	var code = $('<code/>', { text: JSON.stringify(albums.microdata(), null, 2) });
	$('<pre/>').append(code).appendTo('body');
});