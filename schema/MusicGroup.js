var MusicGroup = function(node) {
	Thing.apply(this, arguments);
};

MusicGroup.prototype = Object.create(Thing.prototype, {
	members: {
		get: function() {
			return this.properties('musicGroupMember').map(function(node) {
				return (new Person(node)).serialize();
			});
		}
	},
	albums: {
		get: function() {
			return this.properties('album').map(function(node) {
				return (new MusicAlbum(node)).serialize();
			})
		}
	}
});

MusicGroup.prototype.serialize = function() {
	return $.extend(Thing.prototype.serialize.call(this), {
		members: this.members,
		albums: this.albums
	});
}

