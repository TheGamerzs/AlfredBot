const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  con.query(`SELECT * FROM applications WHERE discord_id = '${message.author.id}'`, function (err, result, fields) {
    if (err) {
        console.log(err)
        return;
    }
    if (result.length < 1) {
       message.channel.send("Unable to find your application.")
    } else {
        message.channel.send(`Your application status is: ${result[0].status}`)
    }
})
}

module.exports.help = {
  name: "status",
  usage: "[in game id]",
  description: "Get application status for a member",
  permission: "KICK_MEMBERS"
}