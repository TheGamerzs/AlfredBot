const Discord = require('discord.js');
const botconfig = require('../botconfig.json');
const functions = require('../util/functions');

function RandomNumber(Min, Max) {
	return Math.floor(Math.random() * Max - Min) + Min;
}

function randomCarMods() {
	return `{"mods":{"1":${RandomNumber(-1, 2)},"2":${RandomNumber(
		-1,
		2
	)},"3":${RandomNumber(-1, 2)},"4":${RandomNumber(-1, 2)},"5":${RandomNumber(
		-1,
		1
	)},"6":${RandomNumber(-1, 1)},"7":${RandomNumber(-1, 1)},"8":${RandomNumber(
		-1,
		1
	)},"9":${RandomNumber(-1, 1)},"10":${RandomNumber(
		-1,
		1
	)},"11":3,"12":2,"13":2,"14":${RandomNumber(
		0,
		26
	)},"15":3,"16":4,"17":-1,"18":1,"19":-1,"20":1,"21":-1,"22":${RandomNumber(
		0,
		1
	)},"23":${RandomNumber(0, 51)},"24":${RandomNumber(
		0,
		20
	)},"25":${RandomNumber(0, 5)},"26":${RandomNumber(0, 15)},"27":${RandomNumber(
		0,
		4
	)},"28":${RandomNumber(0, 44)},"29":-1,"30":${RandomNumber(
		0,
		13
	)},"31":-1,"32":-1,"33":${RandomNumber(0, 15)},"34":${RandomNumber(
		0,
		14
	)},"35":${RandomNumber(0, 21)},"36":${RandomNumber(0, 1)},"37":${RandomNumber(
		0,
		6
	)},"38":-1,"39":${RandomNumber(0, 3)},"40":${RandomNumber(
		0,
		4
	)},"41":-1,"42":-1,"43":-1,"44":-1,"45":-1,"46":${RandomNumber(
		-0,
		10
	)},"47":-1,"48":${RandomNumber(0, 5)},"0":${RandomNumber(0, 3)}}}`;
}

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		const car = args.car; //The car name is everything after the command

		if (car.length < 2) return resolve('You gotta be more specific than that'); //If the car name is less than 2 chars

		if (car.toLowerCase() == 'random') {
			return resolve(randomCarMods());
		} else {
			const carMods = await getCarMods(bot, car);

			let carEmbed = new Discord.MessageEmbed();
			carEmbed.setTitle(`Mod results for "${car}"`);
			carEmbed.setColor('RANDOM');
			carEmbed.setThumbnail(
				'https://cdn.discordapp.com/attachments/472135396407509024/476516142563852288/unknown.png'
			);

			if (carMods.length < 1) {
				return resolve('Car not found');
			}

			for (let i = 0; i < carMods.length; i++) {
				const mod = carMods[i];
				mod.made_by = mod.made_by.replace(/ /g, '').trim();

				const madeBy = `${mod.vehicle_name}, Made by: ${
					mod.made_by != '' ? mod.made_by : 'Rock'
				}`;

				const modCode = '```\n' + mod.mod + '```';

				carEmbed.addField(madeBy, modCode);
			}

			if (carEmbed.fields.length < 1) {
				return resolve('No mods found');
			}

			return resolve(carEmbed);
		}
	});
};

module.exports.help = {
	name: 'mods',
	aliases: [],
	usage: '<car>',
	description: 'Get the mod code of a car',
	args: [
		{
			type: 3,
			name: 'car',
			description: 'The car to get mods for',
			required: true,
			missing: 'Please specify a car.',
			parse: (bot, message, args) => {
				return args.join(' ');
			},
		},
	],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
	],
	slash: true,
	slow: true,
	hidden: true,
};

function getCarMods(bot, car) {
	return new Promise((resolve, reject) => {
		bot.con.query(
			`SELECT * FROM vehiclemod WHERE vehicle_name LIKE '${car}%'`,
			(err, rows) => {
				if (err) {
					console.error(err);
					return reject('An error occurred');
				}
				if (rows.length < 1) {
					return reject('Car not found');
				}
				return resolve(rows);
			}
		);
	});
}
