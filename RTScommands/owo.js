const owoRole = "472023222674784259"

module.exports.run = async (bot, message, args) => {
    if (message.member.roles.cache.has(owoRole)) { //if they have the role by ID
        message.member.roles.remove(owoRole) //removes role
        message.channel.send("Took away the NSFW role")
        return;
    } else { //Do have it
        message.member.roles.add(owoRole) //adds role
        message.channel.send("Given the NSFW role!")
        return;
    }
}

module.exports.help = {
    name: "owo",
    usage: "",
    description: "Gives or takes away the NSFW role",
    permission: "SEND_MESSAGES"
}