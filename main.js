let daKey = require('./daKey');
let Discord = require('discord.js');

let client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

//command & event handler
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
	require(`./handlers/${handler}`)(client, Discord);
});

client.login(daKey.token)
