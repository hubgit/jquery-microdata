This plugin was an experiment in implementing the HTML Microdata DOM API.

You probably want to use [jQuery Things](https://github.com/hubgit/jquery-things) instead.
    
    $(document).getItems(itemtype)
        => Node[]
            .getProperties()
                => Array[] HTMLPropertiesCollection
                    .namedItem(name) or [name]
                        => Node[] PropertyNodeList
                            .itemValue



    $(document).getItems('http://schema.org/MusicAlbum')[0].properties.namedItem('byArtist')[0].properties.namedItem('url')[0].itemValue;
    $(document).getItems('http://schema.org/MusicAlbum')[0].properties['byArtist'][0].properties['url'][0].itemValue;
    $(document).getItems('http://schema.org/MusicAlbum')[0].properties.byArtist[0].properties.url[0].itemValue;
    $(document).getItems('http://schema.org/MusicAlbum')[0].properties.byArtist.properties.url.itemValue;
