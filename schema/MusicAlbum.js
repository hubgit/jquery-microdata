var MusicAlbum = function(node) {
	Thing.apply(this, arguments);
};

MusicAlbum.prototype = new Thing;

MusicAlbum.prototype.serialize = function() {
	return {
		type: this.type,
		name: this.name,
		url: this.url,
		artist: (new MusicGroup(this.property('byArtist'))).serialize(),
	}
}