var MusicGroup = function(node) {
	Thing.apply(this, arguments);
};

MusicGroup.prototype = new Thing;

MusicGroup.prototype.serialize = function() {
	return {
		type: this.type,
		name: this.name,
		url: this.url,
		members: this.properties('musicGroupMember').map(function(node) {
			return (new Person(node)).serialize();
		}),
		/*albums: this.properties('album').map(function(node) {
			return (new MusicAlbum(node)).serialize();
		}),*/
	}
}