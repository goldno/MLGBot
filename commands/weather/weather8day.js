const Discord = require('discord.js');
const { default: fetch } = require('node-fetch');
const prefix = process.env.PREFIX
const weatherApiKey = process.env.OPENWEATHERKEY
const geocodeApiKey = process.env.GEOCODEKEY

module.exports = {
    name: 'weather8day',
    description: `get 8 day weather forecast for a specific 'City, State' or Zip Code!`,
    aliases: ['w8'],
    async execute(message) {
        var args = message.content.slice(prefix.length).split(/ +/);
        args.shift()
        const query = args.join(' ')
        if(!query) return message.channel.send(`You must enter **'City, State'** or a **Zip Code** to get the 7 day weather!`)

        const geocodeLink = `http://api.positionstack.com/v1/forward?access_key=${geocodeApiKey}&query=${query}`
        fetch(geocodeLink)
            .then(res1 => res1.json())
            .then(json1 => {
                var lat = json1.data[0].latitude
                var lon = json1.data[0].longitude
                const weatherLink = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${weatherApiKey}`
                var location = json1.data[0].label

                fetch(weatherLink)
                    .then(res => res.json())
                    .then(json => {
                        // console.log(json)
                        var embed = new Discord.MessageEmbed()
                            .setColor("BLUE")
                            .setTitle(`${location} — 8 Day Weather Forecast`)
                            .setFooter(`Powered by OpenWeatherMap.org`)
                        for(let i = 0; i < json.daily.length; i++) {
                            var dt = json.daily[i].dt
                            const date = new Date(dt*1000) // .toLocaleDateString()
                            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            const weekDay = days[date.getDay()]
                            const monthDay = date.getDate()
                            const month = date.getMonth()+1
                            const dateString = `${weekDay} - ${month}/${monthDay}`
                            var description = json.daily[i].weather[0].main
                            var description2 = json.daily[i].weather[0].description
                            var icon = json.daily[i].weather[0].icon
                            var tempHigh = Math.round(json.daily[i].temp.max)
                            var tempLow = Math.round(json.daily[i].temp.min)

                            embed.addField(`${dateString}`, `Temp: ${tempHigh}/${tempLow}°F  \xa0\xa0\xa0\xa0  ${description} — ${description2}`, false)
                        }
                        message.channel.send(embed)
                    }).catch(err => {
                        message.channel.send(`Failed to retrieve weather data from coordinates **Lat:${lat} Lon:${lon}**`)
                        return console.error(err)
                    })
            }).catch(err => {
                message.channel.send(`Failed to retrieve coordinates from **${query}**`)
            })
    }
};