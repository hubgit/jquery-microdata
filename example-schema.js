$(function()
	// TODO: extend serialize methods of parent types

	/* Thing */

	var Thing = function(node) {
		this.node = node;
		this.propertyList = $(node).properties;
	};

	Thing.prototype = {
		// all the properties with this name
		properties: function(name) {
			return this.propertyList[name] || [];
		},
		// the first property with this name
		property: function(name) {
			return this.propertyList[name] ? this.propertyList[name][0] : null;
		},
		// the value of the first property with this name
		value: function(name) {
			return this.propertyList[name] ? this.propertyList[name][0].itemValue : null;
		},
		// properties serialised to JSON
		serialize: function() {
			return {
				type: this.type,
				name: this.name,
			};
		},
		get type() {
			return $(this.node).itemType;
		},
		get name() {
			return this.value('name');
		},
		get url() {
			return this.value('url');
		}
	};

	/* MusicAlbum */

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

	/* MusicGroup */

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
			albums: this.properties('album').map(function(node) {
				return (new MusicAlbum(node)).serialize();
			}),
		}
	}

	/* Person */

	var Person = function(node) {
		Thing.apply(this, arguments);
	};

	Person.prototype = new Thing;

	/* example code */

	var albums = $('#albumlist').getItems('http://schema.org/MusicAlbum').map(function(index, node) {
		return (new MusicAlbum(node)).serialize();
	});

	console.log(albums);
})
