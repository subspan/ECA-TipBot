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
        
        tmpAddress.push({["id"] : message.author.id,["address"] : address});
        console.log(tmpAddress[0].address.includes(address));
        console.log(tmpAddress[0].address);
        console.log(tmpAddress[0].id);
        
        jsonfile.writeFile(file, tmpAddress, function(err) {
            console.log(err)
        });
        
        
    };
    
    if(command === "test") {
        jsonfile.readFile(file, function(err, obj) {
            if (err) {
                console.log(err);
                message.reply(`Error Reading addresses.json, ${err}`);
            } else {
                var new_obj_array = obj.filter(function() {
                    console.log('obj.id' + obj[0].id + ' Author ID: ' + message.author.id);
                    if(obj[0].id === message.author.id) {
                        console.log('works');
                    } else {
                        console.log('broke');
                    }
                })
//            let user = obj;
//            console.log(obj[1].address);
//            console.log(user[0].address);
//            console.log(user[3].address);
//            console.log(user[2].address);
    }
        });
    }
        
        
//        
//        // Save to Object
//        fs.readFile(file, function(err, obj) {
//            if (err) {
//                console.log(err);
//            } else { 
//                let this obj 
//            };
//        });
//        let obj = ({id: message.author.id, address: address});
//        names.push(obj);
//        fs.writeFile("./addresses.json", JSON.stringify(names), (err) => console.error);
////        message.reply(`Address Set to ${address} ; Change with !address Your_Address`);
//        console.log(names);
//    }
//    
//    if(command === "checkaddress") {
//        jsonfile.readFile(file, function(err, obj) {
//            if (err) {
//                console.log(err);
//                message.reply(`Error Reading addresses.json, ${err}`);
//            } else {
//            message.reply(`You're address is ${JSON.stringify(obj.address)}`);
//            console.log(obj.id);
//        }})
//    }
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