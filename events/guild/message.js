module.exports = (Discord, client, message) => {
    let prefix = "-";
    if (!message.content.startsWith(prefix) || message.author.bot) return; 
    let args = message.content.slice(prefix.length). split(/ +/);
    let cmd = args.shift().toLowerCase();
    let command = client.commands.get(cmd);
    if (command) command.execute(client, message, args, Discord);
    
}