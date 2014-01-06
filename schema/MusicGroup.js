var MusicGroup = function(node) {
	Thing.apply(this, arguments);
};

MusicGroup.prototype = Object.create(Thing.prototype);

MusicGroup.prototype.serialize = function() {
	return $.extend(Thing.prototype.serialize.call(this), {
		members: this.properties('musicGroupMember').map(function(node) {
			return (new Person(node)).serialize();
		}),
		albums: this.properties('album').map(function(node) {
			return (new MusicAlbum(node)).serialize();
		})
	});
}

