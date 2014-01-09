var MusicGroup = function(node) {
	Thing.apply(this, arguments);
};

MusicGroup.prototype = Object.create(Thing.prototype);

MusicGroup.prototype.serialize = function() {
	return $.extend(Thing.prototype.serialize.call(this), {
		members: this.map('musicGroupMember'),
		albums: this.map('album')
	});
}
