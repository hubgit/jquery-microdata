/* display using Microdata DOM API */

"use strict";

$(function() {
	var table = $('<table/>').appendTo('body');
	var thead = $('<thead/>').appendTo(table);
	var tbody = $('<tbody/>').appendTo(table);

	var row = $('<tr/>').appendTo(thead);
	$('<th/>', { text: 'album' }).appendTo(row);
	$('<th/>', { text: 'artist' }).appendTo(row);

	var albums = document.getElementById('albumlist').items('http://schema.org/MusicAlbum').map(function(item) {
		/* album */
		var album = item.properties;
		var row = $('<tr/>').appendTo(tbody);

		var cell = $('<td/>').appendTo(row);
		$('<a/>', { href: album.url[0].itemValue, text: album.name[0].itemValue }).appendTo(cell);

		/* artist */
		var artist = album.byArtist[0].properties;
		var cell = $('<td/>').appendTo(row);

		$('<a/>', { href: artist.url[0].itemValue, text: artist.name[0].itemValue }).appendTo(cell);

		if (typeof artist.musicGroupMember !== 'undefined') {
			var members = artist.musicGroupMember.map(function(item) {
				return item.properties.name[0].itemValue;
			});
			$('<div/>', { text: 'Members: ' + members.join(', ') }).appendTo(cell);
		}

		if (typeof artist.album !== 'undefined') {
			var albums = artist.album.map(function(item) {
				return item.properties.name[0].itemValue;
			});
			$('<div/>', { text: 'Albums: ' + albums.join(', ') }).appendTo(cell);
		}
	});
});

/* convert to JSON using schema */

$(function() {
	var albums = document.getItems('http://schema.org/MusicAlbum').map(function(node) {
		return (new MusicAlbum(node)).serialize();
	});

	var code = $('<code/>', { text: JSON.stringify(albums, null, 2) });
	$('<pre/>').append(code).appendTo('body');
})
