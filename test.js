$(function() {
	var table = $('<table/>').appendTo('body');
	var thead = $('<thead/>').appendTo(table);
	var tbody = $('<tbody/>').appendTo(table);

	var row = $('<tr/>').appendTo(thead);
	$('<th/>', { text: 'album' }).appendTo(row);
	$('<th/>', { text: 'artist' }).appendTo(row);

	var albums = $('#albumlist').getItems('http://schema.org/MusicAlbum').map(function() {
		/* album */
		var album = $(this).properties;
		var row = $('<tr/>').appendTo(tbody);

		var cell = $('<td/>').appendTo(row);
		$('<a/>', { href: album.url[0].itemValue, text: album.name[0].itemValue }).appendTo(cell);

		/* artist */
		var artist = album.byArtist[0].properties;
		var cell = $('<td/>').appendTo(row);

		$('<a/>', { href: artist.url[0].itemValue, text: artist.name[0].itemValue }).appendTo(cell);

		if (typeof artist.musicGroupMember !== 'undefined') {
			var members = artist.musicGroupMember.getValues();
			$('<div/>', { text: 'Members: ' + members.join(', ') }).appendTo(cell);
		}

		if (typeof artist.album !== 'undefined') {
			var albums = artist.album.getValues();
			$('<div/>', { text: 'Albums: ' + albums.join(', ') }).appendTo(cell);
		}
	});
})
