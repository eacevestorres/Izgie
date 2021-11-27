const puppeteer = require ('puppeteer-extra');

module.exports = {

    name: 'rank',
    description: "Shows you a summoner rank from op.gg",
    
    async execute(client, message, args, Discord){

        let summonerQuery = args.join(' ');
        var summonerData = summonerQuery.split(" ");
        var summonerRegion = summonerData[0];
        var summonerName = summonerData[1];

        const regions = ['na', 'lan', 'oce','ru', 'br', 'jp', 'tr', 'euw', 'eune', 'las']; //All regions in op.gg exept korea


        if(!summonerRegion){return message.channel.send ('You gotta type who you want to search ~dummy!')}


            switch(summonerRegion != null){

                case(regions.includes(summonerRegion)):

                var region = summonerRegion;

                break;

                default:

                summonerName = summonerRegion;

                var region = ('lan');

            }
    

        var url = ('https://' + region + '.op.gg/summoner/userName=' + summonerName)
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 550, height: 260 });
        await page.goto(url);

        try{

        await page.waitForSelector('.SideContent', { timeout: 500 });
        const element = await page.$('.SideContent', { timeout: 500 });

        imagePath = ("./summonerRankImage.png");

        const bounding_box = await element.boundingBox();

        await element.screenshot({
            path: imagePath,
            clip: {
              x: bounding_box.x,
              y: bounding_box.y,
              width: Math.min(bounding_box.width, page.viewport().width),
              height: Math.min(bounding_box.height, page.viewport().height),
            },
          });
        await browser.close();


        
        const attachment = new Discord.MessageAttachment(imagePath);
        const embed = new Discord.MessageEmbed()

          .attachFiles(attachment)
          .setImage('attachment://summonerImage' )

        message.channel.send(embed);

      } catch (error) {
        if (error.name === "TimeoutError") {
            console.log (error.name)
            console.log (`Unable to find summoner error caught`)
            message.channel.send('I cant\'t find ' + summonerName + ' ~dummy!');
        }
         else {
          console.log (error)
      }}

    }
}
