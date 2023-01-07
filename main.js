//da key => the discord key goes here, or you name a file dakey.json and import it like I do below.
const fs = require("fs")
const daKey = require('./daKey');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INVITES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });
const{MessageActionRow, MessageButton} = require("discord.js");
const { indexOf } = require("lodash");

//command & event handler
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['command_handler', 'event_handler'].forEach(handler =>{

	require(`./handlers/${handler}`)(client, Discord);
});

client.on('interactionCreate', async interaction => {

	if (!interaction.isButton()) return;

	const row  = new MessageActionRow()
	    .addComponents(
		new MessageButton()
		.setCustomId("previous")
		.setEmoji("◀️")
		.setStyle("SECONDARY")
	)
	   .addComponents(
		new MessageButton()
	   .setCustomId("next")
	   .setEmoji("▶️")
	   .setStyle("SECONDARY")
   )
	   .addComponents(
		new MessageButton()
	   .setCustomId("random")
	   .setEmoji("🎲")
	   .setStyle("SECONDARY")
   )
	  .addComponents(
	   new MessageButton()
	  .setCustomId("delete")
	  .setEmoji("🧨")
	  .setStyle("SECONDARY")
   )
	  .addComponents(
	   new MessageButton()
	  .setCustomId("set")
	  .setEmoji("📌")
	  .setStyle("SECONDARY")
  );
	if (interaction.customId === 'next') {
		const messageKey = interaction.message.content.split(' ');
		const rawCache = fs.readFileSync(`./cache/${messageKey[1]}.json`);
		const selectedCache = JSON.parse(rawCache);
		const totalPostsInCache = [];
		for (var i = 0; i < selectedCache.length; i++){
			totalPostsInCache.push(selectedCache[i].id)
		}
		if (messageKey[3] == totalPostsInCache.length -1){messageKey[3] = -1}
		console.log(messageKey[3])
		currentNumber = parseInt(messageKey[3]);
		console.log(currentNumber+1);
		const title = selectedCache[currentNumber+1].title
		const image = selectedCache[currentNumber+1].image
		const id = selectedCache[currentNumber+1].id
		const newContent = `** ${messageKey[1]} **\n*** ${id} of ${totalPostsInCache.length}***\n**${title}**\n${image}`
		await interaction.update({ content:newContent, components: [row]});
		console.log (interaction.customId)
	}

	if (interaction.customId === 'previous') {
		const messageKey = interaction.message.content.split(' ');
		const rawCache = fs.readFileSync(`./cache/${messageKey[1]}.json`);
		const selectedCache = JSON.parse(rawCache);
		const totalPostsInCache = [];
		for (var i = 0; i < selectedCache.length; i++){
			totalPostsInCache.push(selectedCache[i].id)
		}
		var currentNumber = parseInt(messageKey[3]);
		if (currentNumber === 0){currentNumber = totalPostsInCache.length}
		console.log(currentNumber-1);
		const title = selectedCache[currentNumber-1].title
		const image = selectedCache[currentNumber-1].image
		const id = selectedCache[currentNumber-1].id
		const newContent = `** ${messageKey[1]} **\n*** ${id} of ${totalPostsInCache.length}***\n**${title}**\n${image}`
		await interaction.update({ content:newContent, components: [row]});
		console.log (interaction.customId)
	}

	// if (interaction.customId === 'random') {
	// 	const messageKey = interaction.message.content.split(' ');
	// 	const rawCache = fs.readFileSync(`./cache/${messageKey[1]}.json`);
	// 	const selectedCache = JSON.parse(rawCache);
	// 	const totalPostsInCache = [];
	// 	for (var i = 0; i < selectedCache.length; i++){
	// 		totalPostsInCache.push(selectedCache[i].id)
	// 	}
	// 	ranNumber = Math.floor(Math.random() * totalPostsInCache.length)
	// 	const title = selectedCache[ranNumber].title
	// 	const image = selectedCache[ranNumber].image
	// 	const id = selectedCache[ranNumber].id
	// 	const newContent = `** ${messageKey[1]} **\n*** ${id} of ${totalPostsInCache.length}***\n**${title}**\n${image}`
	// 	await interaction.update({ content:newContent, components: [row]});
	// 	console.log (interaction.customId)
	// }

	if (interaction.customId === 'delete') {
		await interaction.update({ content: 'Deleting!', components: []});
		await interaction.deleteReply();
		console.log (interaction.customId)
	}

	if (interaction.customId === 'set') {
		await interaction.update({ components: [] });
		console.log (interaction.customId)
	}

});

client.login(daKey.token)
