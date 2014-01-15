/* set a value */

$(function() {
	var albums = $('#albumlist').items('http://schema.org/MusicAlbum');
	var artists = albums.eq(0).property('byArtist');

	artists.eq(0).microdata('name', 'Jesu');

	artists.eq(1).microdata({
		name: 'Jesu Two',
		url: 'https://en.wikipedia.org/wiki/Jesu'
	});
});

/* display in a table */

$(function() {
	var table = $('#properties');
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
			href: album.microdata('url'),
			text: album.microdata('name')
		}).appendTo(cell);

		var cell = $('<td/>').appendTo(row);

		// group (artist)
		album.property('byArtist').each(function() {
			var artist = $(this);

			$('<a/>', {
				href: artist.microdata('url'),
				text: artist.property('name').values().join(' / ')
			}).appendTo(cell).wrap('<div/>');

			// group's members
			var memberNames = artist.property('musicGroupMember').property('name').values();

			if (memberNames.length) {
				$('<div/>', {
					text: 'Members: ' + memberNames.join(', ')
				}).appendTo(cell);
			}

			// group's albums
			var albumNames = artist.property('album').property('name').values();

			if (albumNames.length) {
				$('<div/>', {
					text: 'Albums: ' + albumNames.join(', ')
				}).appendTo(cell);
			}
		});
	});
});

/* convert to JSON */

$(function() {
	var albums = $('#albumlist').items('http://schema.org/MusicAlbum');

	var code = $('<code/>', {
		text: JSON.stringify(albums.microdata(false), null, 2)
	});

	$('#microdata').append(code);
});

/* convert to expanded JSON */

$(function() {
	var albums = $('#albumlist').items('http://schema.org/MusicAlbum');

	var code = $('<code/>', {
		text: JSON.stringify(albums.microdata(true), null, 2)
	});

	$('#microdata-expanded').append(code);
});