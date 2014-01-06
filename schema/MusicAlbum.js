var MusicAlbum = function(node) {
	Thing.apply(this, arguments);
};

MusicAlbum.prototype = Object.create(Thing.prototype, {
	artist: {
		get: function() {
			//var artist = Object.create(MusicGroup.prototype);
			//Thing.call(artist, this.property('byArtist'));
			var node = this.property('byArtist');

			return (new MusicGroup(node)).serialize();
		}
	}
});

MusicAlbum.prototype.serialize = function() {
	return $.extend(Thing.prototype.serialize.call(this), {
		artist: this.artist,
	});
};
