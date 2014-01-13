/* set a value */

$(function() {
	var albums = $('#albumlist').items('http://schema.org/MusicAlbum');
	var artists = albums.eq(0).property('byArtist');

	artists.eq(0).property('name').value('Jesu');

	artists.eq(1).value({
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
			href: album.property('url').value(),
			text: album.property('name').value()
		}).appendTo(cell);

		var cell = $('<td/>').appendTo(row);

		// group (artist)
		album.property('byArtist').each(function() {
			var artist = $(this);

			$('<a/>', {
				href: artist.property('url').value(),
				text: artist.property('name').values().join(' / ')
			}).appendTo(cell).wrap('<div/>');

			// group's members
			var members = artist.property('musicGroupMember').property('name');

			if (members.length) {
				$('<div/>', {
					text: 'Members: ' + members.values().join(', ')
				}).appendTo(cell);
			}

			// group's albums
			var albums = artist.property('album').property('name');

			if (albums.length) {
				$('<div/>', {
					text: 'Albums: ' + albums.values().join(', ')
				}).appendTo(cell);
			}
		});
	});
});

/* convert to JSON */

$(function() {
	var albums = $('#albumlist').items('http://schema.org/MusicAlbum');

	var code = $('<code/>', {
		text: JSON.stringify(albums.microdata(), null, 2)
	});

	$('#microdata').append(code);
});

/* convert to collapsed JSON */

$(function() {
	var albums = $('#albumlist').items('http://schema.org/MusicAlbum');

	var code = $('<code/>', {
		text: JSON.stringify(albums.microdata(true), null, 2)
	});

	$('#microdata-collapsed').append(code);
});