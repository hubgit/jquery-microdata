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
		$('<a/>', { href: album.url.itemValue, text: album.name.itemValue }).appendTo(cell);

		/* artist */
		var artist = album.byArtist.properties;
		var cell = $('<td/>').appendTo(row);

		$('<a/>', { href: artist.url.itemValue, text: artist.name.itemValue }).appendTo(cell);

		if (typeof artist.musicGroupMember !== 'undefined') {
			var members = artist.musicGroupMember.map(function(item) {
				return item.properties.name.itemValue;
			});
			$('<div/>', { text: 'Members: ' + members.join(', ') }).appendTo(cell);
		}

		if (typeof artist.album !== 'undefined') {
			var albums = artist.album.map(function(item) {
				return item.properties.name.itemValue;
			});
			$('<div/>', { text: 'Albums: ' + albums.join(', ') }).appendTo(cell);
		}
	});
})
