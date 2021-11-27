module.exports = {
    name: 'hi',
    description: "Izgie says howdy",
    async execute(client, message, args, Discord){
        message.channel.send('Howdy!');
    }
}