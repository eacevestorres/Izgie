const axios = require('axios').default;
const fs = require('fs');

const {MessageActionRow, MessageButton} = require("discord.js");

let images;
let image;
let imageNumber;
let totalImages;

const execute = async (client, message, args, Discord) => {
    var [ subReddit, searchTerm ] = args;
    console.log (subReddit, searchTerm)
    //If user does not type anything after typing the command.
    if (!subReddit) { 
        message.delete()
        return message.author.send('You gotta tell me which subreddit ~dummy!');
    }

    var subRedditUrl = `https://www.reddit.com/r/${subReddit}/search.json?q='${searchTerm}&restrict_sr=on&include_over_18=on&sort=relevance`
    if (!searchTerm) {var subRedditUrl =  `https://old.reddit.com/r/${subReddit}/.json?limit=300&nsfw=1&include_over_18=on`;}
 
    try {
        //Axios gets the reddit .json
        const { data: { data: { children } }} = await axios.get(subRedditUrl, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //Accessing the data and picking up all the media urls.
        images = children.map(element => {
            const { url_overridden_by_dest } = element.data
        //Filtering the urls, useful ones in images.
            if (url_overridden_by_dest != null || url_overridden_by_dest != undefined) {
                if (url_overridden_by_dest.length > 0 && !url_overridden_by_dest.includes('gallery') ) {
                    return url_overridden_by_dest
                }
            }
        }).filter(Boolean);
        //Accessing the data and picking up all the post names.
        titles = children.map(element => {
            const { url_overridden_by_dest, title } = element.data
        //Filtering the urls, useful ones in images.
            if (url_overridden_by_dest != null || url_overridden_by_dest != undefined) {
                if (url_overridden_by_dest.length > 0 && !url_overridden_by_dest.includes('gallery') ) {
                    return url_overridden_by_dest, title
                }
            }
        }).filter(Boolean);

        //Accessing the data and picking up all the post upvotes.
        upvotes = children.map(element => {
            const { url_overridden_by_dest, ups } = element.data
        //Filtering the urls, useful ones in images.
            if (url_overridden_by_dest != null || url_overridden_by_dest != undefined) {
                if (url_overridden_by_dest.length > 0 && !url_overridden_by_dest.includes('gallery') ) {
                    return url_overridden_by_dest, ups
                }
            }
        }).filter(Boolean);
        const postCount = []
        for (let index = 0; index < images.length; index++) {
            postCount.push(index)
        }
        const posts = postCount.map((id, index) => {
            return {
              id: id,
              title: titles[index],
              image: images[index]
            }
          });
          const userCache =JSON.stringify(posts, null, 2);
          fs.writeFile("./cache/"+subReddit+".json", userCache, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        }); 
        //Picking a random url from the useful images array.
        ranNumber = Math.floor(Math.random() * images.length)
        image = images[ranNumber]
        title = titles[ranNumber]
        upvote = upvotes[ranNumber]
        imageNumber = images.indexOf(image);
        totalImages = images.length;
        console.log(images.length + ' images found')
        if (!image){
            message.delete()
            return message.channel.send('That subreddit doesn\'t exist, or you typed it wrong ~dummy!');
        }
        //Adding buttons
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
    //Sending the message
    if (!searchTerm){searchTerm = ""}
    else {searchTerm = ": " + searchTerm}                       
    if (!message.guild){return message.channel.send({content: `** ${subReddit} **\n*** ${imageNumber} of ${totalImages}***\n**${title}**\n${image}`}), images;}
     message.delete();
     return message.channel.send({content: `** ${subReddit} **\n*** ${imageNumber} of ${totalImages}***\n**${title}**\n${image}`, components:[row]}), images;
        //Usually fails when subreddit doesn't exist anymore, error catch below.
    } catch (error){
        console.log(error);
        message.delete();
        return message.author.send('That subreddit doesn\'t exist anymore');
    };

}



module.exports = {
    name: 'r',
    description: "Izgie shows an image from a subreddit of your choosing",
    execute,

};