const Anime_Images = require('anime-images-api');
const API = new Anime_Images();

module.exports = {
    name: 'slap',
    description: 'displays a random anime slap gif!',
    aliases: [],
    async execute(message) {
        API.sfw.slap().then(response => {
            message.channel.send(response.image);
        });
    }
};