const fetch = require('node-fetch')

module.exports = {
    name: 'dog',
    description: 'displays a random dog image (Dog CEO API).',
    aliases: [],
    async execute(message) {
        fetch(`https://dog.ceo/api/breeds/image/random`)
            .then(res => res.json())
            .then(json => message.channel.send(json.message))
        .catch(err => {
            message.channel.send('Request to find a doggo failed!')
            console.log(err)
        })
    }
};