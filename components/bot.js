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
        console.log(`(◕‿◕✿) Saving: ID: ${tmpAddress[0].id} Address: ${tmpAddress[0].address} `);
        
        jsonfile.writeFile(file, tmpAddress, function(err) {
            if(err) {
                console.log(`(ノಠ益ಠ)ノ彡┻━┻ ${err}`) 
                message.reply(err) 
            } else {
        console.log(`(◕‿◕✿) Information Saved ID: ${tmpAddress[0].id} Address: ${tmpAddress[0].address}`);        
        message.reply(`(◕‿◕✿) Information Saved! ID: ${tmpAddress[0].id} Address: ${tmpAddress[0].address}`);        
            }
        });
    };                            
                            
    if(command === "checkaddress") {
        jsonfile.readFile(file, function(err, obj) {
            if (err) {
                console.log("(ノಠ益ಠ)ノ彡┻━┻" + err);
                message.reply(`(ノಠ益ಠ)ノ彡┻━┻ Error Reading addresses.json`);
            } else {
                let new_obj_array = obj.filter(function() {
                    for (i = 0; i < obj.length; i++) {
                        if (obj[i].id === message.author.id) {
                            let foundUser = obj[i];
                            console.log('(◕‿◕✿) User Found! ID: ' + foundUser.id + " Address: " + foundUser.address)
                            message.reply('(◕‿◕✿) Found You! ID: ' + foundUser.id + " Address: " + foundUser.address)
                        } else {
                            console.log('(ノಠ益ಠ)ノ彡┻━┻ This ID Not Found');
                            message.reply('(ノಠ益ಠ)ノ彡┻━┻ This ID Not Found');
                        }
                    }}
                )
            }
        });
    }
});



client.on("guildMemberAdd", (member) => {
    users.set(member.id, member.user);
    jsonfile.readFile(file, function(err, obj) {
        if (err) {
            console.log("(ノಠ益ಠ)ノ彡┻━┻" + err);
            message.reply(`(ノಠ益ಠ)ノ彡┻━┻ Error Reading addresses.json`);
        } else {
            let new_obj_array = obj.filter(function() {
                for (i = 0; i < obj.length; i++) {
                    if (obj[i].id === member.id) {
                        let foundUser = obj[i];
                        users.find("id", foundUser.id).send(`Hey ${foundUser.id}, You're Tip Address is set to ${foundUser.address}`);
                    } else {
                        users.find("id", member.id).send(`Hey ${member.user}, reply with !address Your_Address to be able to receive tips!`);
                    };
                }
            });
        }
    })
});

client.on("guildMemberRemove", (member) => {
    if(users.has(member.id)) users.delete(member.id);
});


client.login(config.token);