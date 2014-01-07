# jQuery Things

## Methods

* $(node).things(itemtype) => an array of Thing objects
 
    `$('#albumlist').things('http://schema.org/MusicAlbum')` => [Thing, Thing, Thing]

* Thing.get(property) => a literal value or a Thing

    `thing.get('name')` => string
    
    `thing.get('byArtist')` => Thing
    
    `thing.get('byArtist').get('name')` => string

* Thing.get(property+) => an array of literal values or Things
    
    `thing.get('name+')` => [string]

    `thing.get('byArtist').get('album+')` => [Thing, Thing, Thing]
 
* Thing.data() => a properties object with name keys and property values

    `things.data()` => { key: [values] }

* Thing.nodes(property) => an array of nodes with this itemprop attribute

* $(node).value(value) => set the itemValue of a node
