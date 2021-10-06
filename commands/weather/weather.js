const Discord = require('discord.js');
const { filter } = require('lodash');
const { default: fetch } = require('node-fetch');
const prefix = process.env.PREFIX
const weatherApiKey = process.env.OPENWEATHERKEY
const geocodeApiKey = process.env.GEOCODEKEY

module.exports = {
    name: 'weather',
    description: `get weather info for a specific 'City, State' or Zip Code on a certain date within 7 days!`,
    aliases: ['w'],
    async execute(message) {
        var args = message.content.slice(prefix.length).split(/ +/);
        args.shift()
        if(!args) return message.channel.send(`Invalid command arguments. Please use the format: **${prefix}w ['City, State' or Zip Code] [MM/DD]**`)
        var searchDate = ''
        var query = ''
        if(args.length === 3) {
            searchDate = args[2]
            const queryArgs = args.slice(0,2)
            query = queryArgs.join(' ')
            
        } else if(args.length === 2) {
            query = args[0]
            searchDate = args[1]
        } else {
            return message.channel.send(`Invalid command arguments. Please use the format: **${prefix}w ['City,State' or Zip Code] [M/D]**`)
        }

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
                        var filterResult = json.daily.filter((x) => {
                            var dt = new Date(x.dt*1000)
                            var monthDay = dt.getDate()
                            var month = dt.getMonth()+1
                            var dateString = `${month}/${monthDay}`
                            return dateString == searchDate 
                        })
                        if(!filterResult) return message.channel.send('no')
                        var description = filterResult[0].weather[0].main
                        var description2 = filterResult[0].weather[0].description
                        var tempHigh = filterResult[0].temp.max
                        var tempLow = filterResult[0].temp.min 
                        var humidity = filterResult[0].humidity
                        var windSpeed = filterResult[0].wind_speed
                        var icon = filterResult[0].weather[0].icon
                        var iconLink = `http://openweathermap.org/img/wn/${icon}@2x.png`
                        var dt = filterResult[0].dt
                        const date = new Date(dt*1000)
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                        const weekDay = days[date.getDay()]
                        const monthDay = date.getDate()
                        const month = date.getMonth()+1
                        const dateString = `${weekDay} - ${month}/${monthDay}`

                        var embed = new Discord.MessageEmbed()
                            .setColor("BLUE")
                            .setAuthor(`${location} — Weather Forecast for ${dateString}`)
                            .setTitle(`${tempHigh}/${tempLow}°F`)
                            .setThumbnail(iconLink)
                            .setDescription(`${description} — ${description2}`)
                            .addField(`High Temp:`, `${tempHigh}°F`, true)
                            .addField(`Low Temp:`, `${tempLow}°F`, true)
                            .addField(`Humidity:`, `${humidity}%`, true)
                            .addField(`Wind Speed:`, `${windSpeed}MPH`, true)
                            .setFooter(`Powered by OpenWeatherMap.org`)
                        message.channel.send({ embeds: [embed] })
                    }).catch(err => {
                        message.channel.send(`Failed to retrieve weather data. Please enter a date that is no more than **7 days** in the future. Or enter a valid location in the format: **${prefix}w ['City,State' or Zip Code] [M/D]**`)
                        return console.error(err)
                    })
            }).catch(err => {
                message.channel.send(`Failed to retrieve coordinates from **${query}**`)
            })
    }
};