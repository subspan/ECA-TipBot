const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const jsonfile = require('jsonfile');
const client = new Discord.Client();
const users = new Discord.Collection();
const file = './addresses.json';
const tmpAddress = [];

client.on("ready", () => {
    console.log("I am ready!");
});

//MAIN CHANNEL
client.on("message", (message) => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const address = message.content.slice(args).split(/ +/g);
    const command = args.shift().toLowerCase();
    if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.id !== "397489814351380482") return;

    if(command === "tip") {
        message.reply(`Hello ${message.author}!`)
        console.log(message.author.id, message.channel.id);
        message.member.send(`Hello ${message.author.id}`);
    }
    
    if(command === "lastuser") {
        const lastuser = users.map(u => u.toString()).join(" ");
        message.reply(`Last User Was ${lastuser}`);
        message.member.send(`sup`);
    }
    
});

//PRIVATE MESSAGES
client.on("message", (message) => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const address = args[1];
    const command = args.shift().toLowerCase();
    if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.id == "397489814351380482") return;
    
    if(command === "address") {
        
        tmpAddress.push({["id"] : message.author.id,["address"] : address});
        console.log(`◉_◉ Saving: ID: ${tmpAddress[0].id} Address: ${tmpAddress[0].address} ◉_◉`);
        
        jsonfile.writeFile(file, tmpAddress, function(err) {
            if(err) {
                console.log(err) 
            } else {
        console.log(`◉_◉Information Saved◉_◉`);        
            }
        });
    };
    
    if(command === "test") {
        jsonfile.readFile(file, function(err, obj) {
            if (err) {
                console.log(err);
                message.reply(`Error Reading addresses.json, ${err}`);
            } else {
                let new_obj_array = obj.filter(function() {
                    let i = 0;
                    if (obj[i].id === message.author.id) {
                        let foundUser = obj[i];
                        console.log(`◉_◉ This Works Man, Your ID is ${foundUser.id} and your wallet address is ${foundUser.address} ◉_◉`);
                        users.find("id", foundUser.id).send(`◉_◉ This Works Man, Your ID is ${foundUser.id} and your wallet address is ${foundUser.address} ◉_◉`);
                    } else {
                        console.log('broke');
                    }
                })
            }
        });
    }
});



client.on("guildMemberAdd", (member) => {
    users.set(member.id, member.user);
    users.find("id", member.id).send(`◉_◉ Hey ${member.user}, I am tip-bot!  If You Don't Want Tips You Can Ignore This Message! You Can Reply With !address Your_Address to be able to Receive Tips! Please Keep In Mind This Stores Your Public Address in Our Bot's Logs, If You Use TOR for Privacy, We Recommend Using a Different Public Address. ◉_◉`);
});

client.on("guildMemberRemove", (member) => {
    if(users.has(member.id)) newUsers.delete(member.id);
});


client.login(config.token);