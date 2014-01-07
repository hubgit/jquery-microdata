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

	var albums = $('#albumlist').things('http://schema.org/MusicAlbum').map(function(index, album) {
		// album
		var row = $('<tr/>').appendTo(tbody);

		var cell = $('<td/>').appendTo(row);
		$('<a/>', { href: album.get('url'), text: album.get('name') }).appendTo(cell);

		// group (artist)
		var artist = album.get('byArtist');
		var cell = $('<td/>').appendTo(row);

		$('<a/>', { href: artist.get('url'), text: artist.get('name') }).appendTo(cell);

		// group's members
		var members = artist.get('musicGroupMember+').map(function(item) {
			return item.get('name');
		});

		if (members.length) {
			$('<div/>', { text: 'Members: ' + members.join(', ') }).appendTo(cell);
		}

		// group's albums
		var albums = artist.get('album+').map(function(item) {
			return item.get('name');
		});

		if (albums.length) {
			$('<div/>', { text: 'Albums: ' + albums.join(', ') }).appendTo(cell);
		}
	});
});
