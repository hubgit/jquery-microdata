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
    //$(document).items('http://schema.org/MusicAlbum')[0].property('byArtist').property('url').itemValue;
    //items['http://schema.org/MusicAlbum'][0]['byArtist']['url'];

