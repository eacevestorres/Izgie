
module.exports = {
    name: 'clear',
    description: "Izgie clears a set amount of messages",

    async execute(client, message, args, Discord){
        
        switch (args != null) {

            case (message.channel.type == "dm"):

            return message.author.send("I can\'t delete messages in dms ~dummy!"); 

                break;

                case (!args[0]):

                return message.author.send("How many ~dummy?");
    
                    break;

                    case (isNaN(args[0])):

                    return message.author.send("Numbers! I need Numbers ~dummy!");
        
                        break;

                        case (args[0] > 99):

                        return message.author.send("I can't delete more than 99 ~dummy!").catch(error => console.log(error.stack));
            
                            break;

                            case (args[0] < 1):

                            return message.author.send("I can't delete 0 or less than 0 ~dummy!").catch(error => console.log(error.stack));
            
                            break;
        }

        var requestedNumber = parseInt(args) + (1);

        if(Number.isInteger(requestedNumber)) {

            console.log( 'Deleted ' + requestedNumber + ' messages.')

        await message.channel.messages.fetch({limit: requestedNumber}).then(messages =>{

            message.channel.bulkDelete(messages).catch(error =>  message.author.send("I can\'t delete messages older than 14 days ~dummy!"));});

            message.delete().catch(error => { });

             return;
        }
        
        else {

            return message.author.send("I can only delete whole numbers ~dummy!");

        }
       }
   }