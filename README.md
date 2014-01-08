# jQuery Things

### Get all the things of a certain type

$(node).things(itemtype) => an array of Thing objects

    $('#albumlist').things('http://schema.org/MusicAlbum') => [Thing, Thing, Thing]

### Get a property of a thing as a single item

Thing.get(property) => a literal value or a Thing

    thing.get('name') => string

    thing.get('byArtist') => Thing

    thing.get('byArtist').get('name') => string

### Get a property of a thing as an array of items

Thing.get(property+) => an array of literal values or Things

    thing.get('name+') => [string]

    thing.get('byArtist').get('album+') => [Thing, Thing, Thing]

### Set a property of a thing

Thing.set(property, value)

	thing.get('byArtist')
	     .set('name', 'The Beatles')
	     .set('url', 'https://en.wikipedia.org/wiki/The_Beatles')
