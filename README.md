# jQuery Things

### Get all the things of a certain type

$(node).things(itemtype) => an array of Thing objects

    $('#albumlist').things('http://schema.org/MusicAlbum') => [Thing, Thing, Thing]

### Get a property of a thing as a single item

Thing.data(property) => a literal value or a Thing

    thing.data('name') => string

    thing.data('byArtist') => Thing

    thing.data('byArtist').data('name') => string

### Get a property of a thing as an array of items

Thing.data(property+) => an array of literal values or Things

    thing.data('name+') => [string]

    thing.data('byArtist').data('album+') => [Thing, Thing, Thing]

### Set a property of a thing

Thing.data(property, value)

	thing.data('byArtist')
	     .data('name', 'The Beatles')
	     .data('url', 'https://en.wikipedia.org/wiki/The_Beatles')
