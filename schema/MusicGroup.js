var MusicGroup = function(node) {
	Thing.apply(this, arguments);
};

MusicGroup.prototype = Object.create(Thing.prototype, {
	members: {
		get: function() {
			return this.properties('musicGroupMember').map(function(node) {
				//var member = Object.create(Person.prototype);
				//Thing.call(member, node);
				return (new Person(node)).serialize();
			});
		}
	},
	albums: {
		get: function() {
			return this.properties('album').map(function(node) {
				//var album = Object.create(MusicAlbum.prototype);
				//Thing.call(album, node);
				return (new MusicAlbum(node)).serialize();
			});
		}
	}
});

MusicGroup.prototype.serialize = function() {
	return $.extend(Thing.prototype.serialize.call(this), {
		members: this.members,
		albums: this.albums,
	});
}

