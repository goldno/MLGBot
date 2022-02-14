class Song {
    constructor(name, artist, resource, info, link, searchQuery = {}) {
      this.name = name;
      this.artist = artist;
      this.resource = resource;
      this.info = info;
      this.link = link;
      this.searchQuery = searchQuery;
    }
}

module.exports = Song;