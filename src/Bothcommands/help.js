const Discord = require('discord.js');
const fs = require('fs');
const botconfig = require('../botconfig.json');
const { create } = require('domain');

function canUseCommand(member, commandPermissions) {
	if (typeof commandPermissions == 'string') {
		return member.hasPermission(commandPermissions);
	}

	let canUse = false;
	commandPermissions.forEach(perm => {
		if (member.roles.cache.has(perm.id)) canUse = true;
	});
	return canUse;
}

let helpEmbed1;
let helpEmbed2;
let embedFieldCount = 0;

function createHelpEmbed(bot) {
	helpEmbed1 = new Discord.MessageEmbed() //2 different embeds cause lots of commands
		.setTitle(`Alfreds Commands that YOU can use`, bot.user.displayAvatarURL())
		.setDescription('Things in [] are optional. Things in <> are required')
		.setThumbnail(bot.user.displayAvatarURL())
		.setColor('RANDOM'); //random color
	helpEmbed2 = new Discord.MessageEmbed();

	embedFieldCount = 0;
}

function addCommandsToEmbed(commands, MemberRoles, folder) {
	commands.forEach(f => {
		const command = require(`${folder}${f}`);
		if (command.help.disabled) return;
		if (!canUseCommand(MemberRoles, command.help.permission)) return;
		if (embedFieldCount < 25) {
			helpEmbed1.addField(
				`.${command.help.name} ${command.help.usage}`,
				`${command.help.description}.`
			);
			embedFieldCount++;
		} else if (embedFieldCount < 50) {
			helpEmbed2.addField(
				`.${command.help.name} ${command.help.usage}`,
				`${command.help.description}.`
			);
			embedFieldCount++;
		}
	});
}

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		let CommandFolder;
		let MemberRoles;
		if (args.guild_id == botconfig.PIGSServer) {
			CommandFolder = 'PIGScommands/'; //folder with pigs commands
			MemberRoles = bot.guilds.cache
				.get(botconfig.PIGSServer)
				.members.cache.get(args.author_id);
		} else if (args.guild_id == botconfig.RTSServer) {
			CommandFolder = 'RTScommands/'; //folder with rts commands
			MemberRoles = bot.guilds.cache
				.get(botconfig.RTSServer)
				.members.cache.get(args.author_id);
		}

		createHelpEmbed(bot);

		const [companyCommands, BothCommands] = await Promise.all([
			getCommands(`./src/${CommandFolder}`),
			getCommands('./src/Bothcommands/'),
		]).catch(err => {
			console.log(err);
			return reject('There was an error getting commands.');
		});

		addCommandsToEmbed(companyCommands, MemberRoles, `../${CommandFolder}`);

		addCommandsToEmbed(BothCommands, MemberRoles, '../Bothcommands/');

		return resolve([helpEmbed1, helpEmbed2]);
	});
};

async function getCommands(folder) {
	return new Promise((resolve, reject) => {
		fs.readdir(folder, (err, files) => {
			if (err) {
				console.log(err);
				return reject(`There was an error reading ${folder} commands.`);
			}

			const jsfile = files.filter(f => f.split('.').pop() == 'js');

			return resolve(jsfile);
		});
	});
}

module.exports.help = {
	name: 'help',
	aliases: [],
	usage: '',
	description: 'Sends a list of commands',
	args: [],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
	hidden: true,
};
