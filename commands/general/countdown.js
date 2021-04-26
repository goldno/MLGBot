const { Channel } = require("discord.js");
const moment = require("moment");
require("moment-duration-format")

module.exports = {
    name: 'countdown',
    description: 'displays a live countdown. Format: .cd !',
    aliases: ['cd'],
    async execute(message) {

        const seconds = 5
        const startingCounter = 60
        let counter = startingCounter

        const getText = () => {
            return `Timer: ${counter}`
        }
        const updateCounter = async (message) => {
            message.edit(getText())
            counter -= seconds

            if(counter <= 0) {
                counter = startingCounter
            }

            setTimeout(() => {
                updateCounter(message)
            }, 1000 * seconds)
        }

        const msg = await message.channel.send(getText())
        updateCounter(msg)
    }
};