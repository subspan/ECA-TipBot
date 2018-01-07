const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const jsonfile = require('jsonfile');
const client = new Discord.Client();
const users = new Discord.Collection();
const file = './addresses.json';
let tmpAddress = [];

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
    //Sets currentUser to Author ID
    const currentUser = message.author.id;
    //splits args after !
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    //assigns user address to arg1
    const address = args[1];
    //shifts to LC
    const command = args.shift().toLowerCase();
    //Stops if no prefix, if Author is BOT, or if Channel is not Private
    if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.id == "397489814351380482") return;
    
    if(command === "address") {
        //Pushes JSON Data Into New Array
        let obj = { [currentUser] : address };
        //Writes tmpAddress to addresses.JSON
        jsonfile.writeFile(file, obj, function(err) {
            if(err) {
                //Displays Error If Error
                console.log(`(ノಠ益ಠ)ノ彡┻━┻ ${err}`) 
                message.reply(err) 
            } else {
                //Replies With Saved Information
                console.log(`(◕‿◕✿) Information Saved ID: ${message.author.id} Address: ${address}`);        
                message.reply(`(◕‿◕✿) Information Saved! ID: ${message.author.id} Address: ${address}`);        
            }
        });
    };  
    
    
    if(command === "write") {
        let obj = { [currentUser] : address };
        tmpAddress.push(obj);
        fs.writeFile(file, JSON.stringify(tmpAddress), (err) => {
            if (err) throw err;
            console.log(tmpAddress);
        })
    }
    
    if(command === "test") {
        let obj = { [currentUser] : address };
        console.log(currentUser);
        console.log(obj);
        console.log(obj[currentUser]);
        jsonfile.writeFile(file, obj, function(err) {
            if(err) {
                console.log(err)
            } else {
                console.log(obj);
            }
        })
    }
    
    //Checks For Your Address and Returns From JSON
    if(command === "checkaddress") {
        //Reads addresses.JSON
        jsonfile.readFile(file, function(err, obj) {
            if (err) {
                //Provides Error if Error
                console.log("(ノಠ益ಠ)ノ彡┻━┻" + err);
                message.reply(`(ノಠ益ಠ)ノ彡┻━┻ Error Reading addresses.json`);
            } else {
                    //Loop For User
                console.log(obj[currentUser]);
                message.reply(`You're address is ${obj[currentUser]}`);
            }
        });
    }
});


client.on("guildMemberAdd", (member) => {
    users.set(member.id, member.user);
    jsonfile.readFile(file, function(err, obj) {
        if (err) {
            console.log('err');
        } else {
            console.log(obj[0]);
        }
    });
});

client.on("guildMemberAdd", (member) => {
    users.set(member.id, member.user);
    jsonfile.readFile(file, function(err, obj) {
        if (err) {
            console.log("(ノಠ益ಠ)ノ彡┻━┻" + err);
        } else { 
            console.log(obj);
        }
        })
    });

client.on("guildMemberRemove", (member) => {
    if(users.has(member.id)) users.delete(member.id);
});


client.login(config.token);