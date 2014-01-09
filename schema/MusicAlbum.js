var MusicAlbum = function(node) {
	Thing.apply(this, arguments);
};

MusicAlbum.prototype = Object.create(Thing.prototype);

MusicAlbum.prototype.serialize = function() {
	return $.extend(Thing.prototype.serialize.call(this), {
		artist: this.map('byArtist')[0]
	});
};