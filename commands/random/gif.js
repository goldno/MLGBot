const fetch = require('node-fetch')
const tenorKey = process.env.TENORKEY
const prefix = process.env.PREFIX

module.exports = {
    name: 'gif',
    description: 'displays a gif for a Tenor search result.',
    aliases: [],
    async execute(message) {
        var args = message.content.slice(prefix.length).split(/ +/)
        args.shift()
        const search = args.join(' ')
        if(args.length > 0) {
            fetch(`https://api.tenor.com/v1/random?key=${tenorKey}&q=${search}&limit=1`)
                .then(res => res.json())
                .then(json => message.channel.send(json.results[0].url))
            .catch(err => {
                message.channel.send('Request to find gif failed!')
                console.log(err)
            })
        } else {
            message.channel.send('Please provide a search query!')
        }
    }
};