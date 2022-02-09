const Discord = require('discord.js');
const { default: fetch } = import('node-fetch');
const prefix = process.env.PREFIX
const apiKey = process.env.OPENWEATHERKEY
const geocodeApiKey = process.env.GEOCODEKEY

module.exports = {
    name: 'currentweather',
    description: `get current weather for a specific 'City, State' or Zip Code!`,
    aliases: ['cw'],
    async execute(message) {
        var args = message.content.slice(prefix.length).split(/ +/);
        args.shift()
        const query = args.join(' ')
        if(!query) return message.channel.send(`You must enter **'City, State'** or a **Zip Code** to get the current weather!`)

        const geocodeLink = `http://api.positionstack.com/v1/forward?access_key=${geocodeApiKey}&query=${query}`
        fetch(geocodeLink)
            .then(res1 => res1.json())
            .then(json1 => {
                var lat = json1.data[0].latitude
                var lon = json1.data[0].longitude
                const weatherLink = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
                var location = json1.data[0].label

                fetch(weatherLink)
                    .then(res => res.json())
                    .then(json => {
                        var description = json.weather[0].main
                        var description2 = json.weather[0].description
                        var temperature = json.main.temp
                        var tempFeelsLike = json.main.feels_like
                        var windSpeed = json.wind.speed
                        var humidity = json.main.humidity
                        var icon = json.weather[0].icon
                        var iconLink = `http://openweathermap.org/img/wn/${icon}@2x.png`
                        var currentDateTime = new Date().toLocaleString()

                        var embed = new Discord.MessageEmbed()
                            .setColor('BLUE')
                            .setAuthor(`Weather — ${location}`)
                            .setTitle(`${temperature}°F`)
                            .setThumbnail(iconLink)
                            .setDescription(`${description} — ${description2}`)
                            .addField(`Temp:`, `${temperature}°F`, true)
                            .addField(`Feels Like:`, `${tempFeelsLike}°F`, true)
                            .addField(`Humidity:`, `${humidity}%`, true)
                            .addField(`Wind Speed:`, `${windSpeed}MPH`, true)
                            .setTimestamp(currentDateTime)
                            .setFooter(`Powered by OpenWeatherMap.org`)
                        message.channel.send({ embeds: [embed] })
                            // .then(msg => {
                            //     msg.delete({ timeout: 60000 })
                            //     // message.delete({ timeout: 60000 })
                            // })
                            // .catch(err => console.log(err))

                    }).catch(err => {
                        message.channel.send('Failed to retrieve weather data :(')
                        return console.error(err)
                    })
            }).catch(err => {
                message.channel.send(`Failed to retrieve weather data from coordinates **Lat:${lat} Lon:${lon}**`)
                return console.error(err)
            })
    }
};