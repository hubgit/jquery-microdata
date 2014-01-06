var MusicAlbum = function(node) {
	Thing.apply(this, arguments);
};

MusicAlbum.prototype = Object.create(Thing.prototype, {
	artist: {
		get: function() {
			var node = this.property('byArtist');
			return node ? (new MusicGroup(node)).serialize() : null;
		}
	}
});

MusicAlbum.prototype.serialize = function() {
	return $.extend(Thing.prototype.serialize.call(this), {
		artist: this.artist
	});
};
