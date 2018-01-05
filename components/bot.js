const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const client = new Discord.Client();
const users = new Discord.Collection();

client.on("ready", () => {
    console.log("I am ready!");
});

//client.on("message", (message) => {
////    contactBot(message);
//if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.id !== "397489814351380482") return;
//    if (message.content.startsWith(config.prefix + "tip")) {
//        console.log(message.author.id, message.channel.id);
//        message.member.send(`Hello ${message.author.id}`);
//    }
//});

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
        // Save to Json
        let obj = {id: message.author.id, address: address}
        fs.writeFile("./addresses.json", JSON.stringify(obj), (err) => console.error);
        message.reply(`Address Set to ${address} ; Change with !address Your_Address`);
        console.log(obj);
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

//client.on("message", (message) => {
//    let prefix = config.prefix;
//    if(message.author.id !== config.ownerID) {return};
//
//    if (message.content.startsWith(config.prefix + "prefix")) {
//        // Gets prefix from command
//        let newPrefix = message.content.split(" ").slice(1, 2)[0];
//        // Change the configuration in memory
//        config.prefix = newPrefix;
//    
//        // Save to file
//        fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error)
//    }
//
//});