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
        console.log(`Saving: ID: ${tmpAddress[0].id} Address: ${tmpAddress[0].addres}...`);
        
        jsonfile.writeFile(file, tmpAddress, function(err) {
            if(err) {
                console.log(err) 
            } else {
        console.log(`Information Saved`);        
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
                        console.log(`This Works Man, Your ID is ${foundUser.id} and your wallet address is ${foundUser.address}`);
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
    users.find("id", member.id).send(`Hey ${member.user}, reply with !address Your_Address to be able to receive tips!`);
});

client.on("guildMemberRemove", (member) => {
    if(users.has(member.id)) newUsers.delete(member.id);
});


client.login(config.token);