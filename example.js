/* set a value */

$(function() {
	var albums = $('#albumlist').items('http://schema.org/MusicAlbum');

	albums.eq(0)
		.microdata('byArtist')
		.microdata('name', 'Jesu')
		.microdata('url', 'https://en.wikipedia.org/wiki/Jesu');
});

/* convert to JSON */

$(function() {
	var albums = $('#albumlist').items('http://schema.org/MusicAlbum');
	var code = $('<code/>', { text: JSON.stringify(albums.microdata(), null, 2) });
	$('<pre/>').append(code).appendTo('body');
});

/* display in a table */

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
		$('<a/>', { href: album.microdata('url'), text: album.microdata('name') }).appendTo(cell);

		// group (artist)
		var artist = album.microdata('byArtist');
		var cell = $('<td/>').appendTo(row);

		$('<a/>', { href: artist.microdata('url'), text: artist.microdata('name') }).appendTo(cell);

		// group's members
		var members = $.map(artist.microdata('musicGroupMember', true), function(item) {
			return item.microdata('name');
		});

		if (members.length) {
			$('<div/>', { text: 'Members: ' + members.join(', ') }).appendTo(cell);
		}

		// group's albums
		var albums = $.map(artist.microdata('album', true), function(item) {
			return item.microdata('name');
		});

		if (albums.length) {
			$('<div/>', { text: 'Albums: ' + albums.join(', ') }).appendTo(cell);
		}
	});
});
