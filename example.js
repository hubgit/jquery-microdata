/* set a value */

$(function() {
	var albums = $('#albumlist').things('http://schema.org/MusicAlbum');
	albums[0].data('byArtist').data('name', 'Jesu').data('url', 'https://en.wikipedia.org/wiki/Jesu')
});

/* convert to JSON */

$(function() {
	var albums = $('#albumlist').things('http://schema.org/MusicAlbum').map(function() {
		return this.data();
	});

	var code = $('<code/>', { text: JSON.stringify(albums.toArray(), null, 2) });
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

	$('#albumlist').things('http://schema.org/MusicAlbum').map(function(index, album) {
		// album
		var row = $('<tr/>').appendTo(tbody);

		var cell = $('<td/>').appendTo(row);
		$('<a/>', { href: album.data('url'), text: album.data('name') }).appendTo(cell);

		// group (artist)
		var artist = album.data('byArtist');
		var cell = $('<td/>').appendTo(row);

		$('<a/>', { href: artist.data('url'), text: artist.data('name') }).appendTo(cell);

		// group's members
		var members = $.map(artist.data('musicGroupMember', true), function(item) {
			return item.data('name');
		});

		if (members.length) {
			$('<div/>', { text: 'Members: ' + members.join(', ') }).appendTo(cell);
		}

		// group's albums
		var albums = $.map(artist.data('album', true), function(item) {
			return item.data('name');
		});

		if (albums.length) {
			$('<div/>', { text: 'Albums: ' + albums.join(', ') }).appendTo(cell);
		}
	});
});
