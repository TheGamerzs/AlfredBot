const Discord = require('discord.js');
const request = require('request');
const botconfig = require('../botconfig.json');
const functions = require('../util/functions.js');

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		const ServerStatus = new Discord.MessageEmbed()
			.setTitle('Uptime of all servers')
			.setColor('RANDOM');

		const serverPromises = botconfig.ActiveServers.map(server => {
			return fetch(`http://${server.url}/info.json`)
				.then(res => res.json())
				.then(body => {
					return body;
				});
		});

		await Promise.allSettled(serverPromises).then(results => {
			results.forEach((result, index) => {
				if (result.status === 'fulfilled') {
					const body = result.value;
					ServerStatus.addField(
						botconfig.ActiveServers[index].name,
						body.vars.Uptime,
						true
					);
				} else {
					ServerStatus.addField(
						botconfig.ActiveServers[index].name,
						'OFFLINE',
						true
					);
				}
			});
		});

		return resolve(ServerStatus);
	});
};

module.exports.help = {
	name: 'uptime',
	aliases: [],
	usage: '',
	description: 'Shows the uptime of each server',
	args: [],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
	slow: true,
};
