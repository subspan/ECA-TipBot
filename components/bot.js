const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const jsonfile = require('jsonfile');
const client = new Discord.Client();
const users = new Discord.Collection();
const file = './addresses.json';

client.on("ready", () => {
    console.log("I am ready!");
});

//MAIN CHANNEL / SERVER
client.on("message", (message) => {
    //splits args after !
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    //assigns user address to arg1
    const address = message.content.slice(args).split(/ +/g);
    //shifts to LC
    const command = args.shift().toLowerCase();
    //Stops if no prefix, if Author is BOT, or if Channel is not Main-Channel
    if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.id !== "397489814351380482") return;
    
    if (command === "tip" && (!args)) {
        message.reply(`(╯°□°）╯︵dᴉʇ \n Who gets the tip?!? \n hint: !tip @username`);
    }
    
    if (command === "tip") {
        // Set Tipper As Message Author
        let tipper = message.author.id;
        let tipperName = message.author.user;
        // Sets @Username as sendTo
        let sendToArg = args[0];
        // Parses Args2 to Integer
        let amount = (parseInt(args[1]));
        if (!Number.isInteger(amount)) {
            console.log('Tip Amount Not Number');
                client.fetchUser(tipper)
                .then(user => {user.send(`(◕‿◕✿) \n Tip Amount Must Be A Number! You Sent ${args[1]}`)})
            return;
        } else {
        
        // Finds >
        let lastBit = sendToArg.lastIndexOf('>');
        // Strips Off Extra Characters
        let sendTo = sendToArg.substr(2,lastBit-2);
        // Reads Addresses.JSON
        
        jsonfile.readFile(file, (err, obj) => {
            if (err) {
                console.log("(ノಠ益ಠ)ノ彡┻━┻" + err);
                message.reply(`(ノಠ益ಠ)ノ彡┻━┻ Error Reading addresses.json`);
            // If No Address
            } else if (!obj[sendTo]) {
                console.log(`User Address Not Found`);
                // Message Tip Sender
                client.fetchUser(tipper)
                .then(user => {user.send(`(ノಠ益ಠ)ノ \n This Person Has Not Set Up A Tip Address... Message Them And Find Out Why!`)})
                // Message Tip Received
                client.fetchUser(sendTo)
                .then(user => {user.send(`(◕‿◕✿) \n Hi ${sendToArg}! \n Someone Just Tried Sending You A Tip \n But You Have No Address Set Up! \n Reply With The Following To Set Up Address: \n !address Your_Address`)})
            // If Address Is Found
            } else {
                // SEND TIP GOES HERE
                
                
                //Log and Reply Tip Amount and Receiver
                console.log(`Sent ${amount} ECA Sent To: ${obj[sendTo]}`);
                message.reply(`Sent ${amount} ECA To ${sendToArg}`);
            }
        })
        }
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
        // Sets UserID as Key, Address as Info
        let newInfo = (`"${currentUser}": "${address}"`);
        jsonfile.readFile(file, (err, obj) => {
            if (err) {
                console.log("(ノಠ益ಠ)ノ彡┻━┻" + err);
                message.reply(`(ノಠ益ಠ)ノ彡┻━┻ Error Reading addresses.json`);
            // If No Address
            } else if (!obj[currentUser]) {
                // Adds New Info to Addresses.JSON
                let newObj = (JSON.parse(JSON.stringify(obj).slice(0,-1)+","+newInfo+"}"));
                // Writes New Addresses To Addressess.JSON
                jsonfile.writeFile(file, newObj, function(err) {
                    if(err) {
                //Displays Error If Error
                console.log(`(ノಠ益ಠ)ノ彡┻━┻ ${err}`) 
                message.reply(err) 
                    } else {
                //Logs & Replies With Saved Information
                console.log(`(◕‿◕✿) Information Saved Address: ${newObj[currentUser]}`);        
                message.reply(`(◕‿◕✿) Information Saved! Address: ${newObj[currentUser]}`);        
                    }
                })
                        //This Changes Your Address If Found
                    } else {
                        // Sets Old Address
                let oldAddress = obj[currentUser];
                        // Define Search Parameters
                let needle = (`"${currentUser}":"${oldAddress}"`);
                        // Set New Information
                let newAddress = (`"${currentUser}":"${address}"`);
                        // Parses Edited Address List
                let saveThis = JSON.parse(JSON.stringify(obj).replace(needle,newAddress));
                        // Saves To Addresses.JSON
                jsonfile.writeFile(file, saveThis, (err) => {
                    if(err) {
                        console.log(`(ノಠ益ಠ)ノ彡┻━┻ ${err}`) 
                        message.reply(err) 
                            } else {
                        //Logs & Replies With Saved Information
                        console.log(`(◕‿◕✿) Information Saved Address: ${saveThis[currentUser]}`);        
                        message.reply(`(◕‿◕✿) Information Saved! Address: ${saveThis[currentUser]}`);        
                    }
            })
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
            } else if (!obj[currentUser]) {
                // Log Not Found And Tells User No Address Set
                console.log(`(ノಠ益ಠ)ノ彡┻━┻ No Address Set For This Person`);
                message.reply(`(ノಠ益ಠ)ノ彡┻━┻ \n You Have Not Set An Address \n \n Use !address Your_Address to set!`);
            } else {
                // Log Found Address + Message User Set Address
                console.log(obj[currentUser]);
                message.reply(`(◕‿◕✿) \n You're address is ${obj[currentUser]}`);
            }
        });
    }
});

// When New User Joins
client.on("guildMemberAdd", (member) => {
// Adds New Member to Users
    users.set(member.id, member.user);
// Reads Addresses.JSON
    jsonfile.readFile(file, function(err, obj) {
        if (err) {
            console.log("(ノಠ益ಠ)ノ彡┻━┻" + err);
            users.find("id", member.id).send(`ლ(ಠ益ಠლ) \n Hey! ${member.user}, Tell The Bot Owner I Can't Read The Addresses List!`);
        // If No ID is Found in Addresses.JSON
        } else if(!obj[member.id]) {
            console.log(`(ノಠ益ಠ)ノ彡┻━┻ \n No Address Set For This Person: Sending Greeting`)
            users.find("id", member.id).send(
                `(◕‿◕✿) \n Hey! ${member.user}, Reply with !address Your_Address. This Will Save Your Address To Your ID And Allow You To Receive Tips! \n \n PLEASE NOTE: If You Are Using Electra With TOR This Potentially Compromises Security by linking your Discord ID with your public wallet address. This data is only used for tip bot and kept safe, but we Advise Using a Public Address if this is a concern to you.`);
            //Deletes Member From Users Collection
            users.delete(member.id);
        // If Address Is Found
        } else {
            // Logs & DMs user with Address and Info How To Change
            console.log(obj[member.id]);
            users.find("id", member.id).send(`(◕‿◕✿) \n Hey! ${member.user}, Your Address is ${obj[member.id]}. \n \n You can change this with !address Your_Address`);
        }
        //Deletes Member From Users Collection
        users.delete(member.id);
        })
    });

client.on("guildMemberRemove", (member) => {
    // If User Leaves and Still is in Users, Removes User
    if(users.has(member.id)) users.delete(member.id);
});

// Turns On The Bot, Dude.
client.login(config.token);