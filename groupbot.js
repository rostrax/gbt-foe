//FoE Groupbot
//Written by Jason C. Aka Rostrax
//Copyright 2016
//Do not redistribute or use without my expressed consent.

var Discord = require("discord.js");
var bot = new Discord.Client();

console.log("Beginning Bot");
bot.on('warn', (m) => console.log('[warn]', m));
bot.on('debug', (m) => console.log('[debug]', m));
bot.on('error', (m) => console.log('[error]', m));

bot.on('ready', () => {
    bot.sendMessage("185138605528842240", "Bot Ready!").catch((err) => { console.log(err); });
});

//Setting up list of words for different group types.
var grindKeys =["grind","susans","sausans","sausages"];
var missionKeys=["disco","scroll","boss"];
var pvpKeys = ["pvp", "murder", "murdertime", "fancypants","kill","pk"];
var pvpGroup;
var grindGroup;
var missionGroup;

//Setting up group object
function Group(number, members, activity) {
    this.number = number;
    this.members = members;
    this.activity = activity;
    //Function to add a member to the group
    this.addMember = function (newMember,mentions){
        this.number += 1;
        this.members += newMember;
        if (mentions ) {
            this.number += mentions.length;
            this.members +=mentions;
        }
    };
    //Function to announce group status 
    this.announceGrp = function (msg){
         bot.reply(msg, this.number + " players are currently looking for a " + this.activity + " group: " + this.members ).catch((err) => { console.log(err); });
    };
    //Function to check if group is full
    this.isFull = function(msg){
        if (this.number == 5) {
            bot.reply(msg, "Party Ready for " + this.activity+ "! please send out invites to " + this.members ).catch((err) => { console.log(err); });
            this.number = 0;
            this.members ="";
        }
    };
};
//Function to check for empty object
function isEmpty(object) {
  for(var key in object) {
    if(object.hasOwnProperty(key)){
      return false;
    }
  }
  return true;
}
//Function to create the group objects

var grpArray = [pvpGroup,grindGroup,missionGroup];
var actArrays = [ pvpKeys,grindKeys,missionKeys]; 
function createGroup(msg, activity) {
    for (act in actArrays){
        for (a in actArrays[act]){
            if ( actArrays[act][a] == activity) {
                if (isEmpty(grpArray[act])) {
                    grpArray[act] = new Group(1 + msg.mentions.length, msg.author + msg.mentions, activity);
                    console.log(grpArray[act])
                    
                } else {
                    grpArray[act].addMember(msg.author, msg.mentions);
                }
                grpArray[act].announceGrp(msg);
                grpArray[act].isFull(msg);
            }
        }
    }
};
//Bot catch for incoming messages. Splits them out to interpret what user would like to do.
//(Could also use a bit of re-engineering. Not so high of priority.)
bot.on('message', (msg) => {
    if (msg.content.toLowerCase().startsWith("!lfg")) {
        if (msg.content.indexOf("|") == -1) {
            var activity = msg.content.substr(5,msg.content.length-5);          
        }else {
            var activity = msg.content.substr(5, msg.content.indexOf("|") - 6);
        }
        createGroup(msg,activity);    
    }
    else if (msg.content.toLowerCase().startsWith("!status")) {
        var activity = msg.content.substr(8,msg.content.length-5);
        if (activity == "pvp") {
            if (isEmpty(pvpGroup)) {
                bot.reply(msg, "0 players are currently looking for a pvp group")
            }else {
            pvpGroup.announceGrp(msg);
            }
        }else if (activity == "grind") {
            if (isEmpty(grindGroup)) {
                bot.reply(msg, "0 players are currently looking for a grind group")
            }else {
                grindGroup.announceGrp(msg);
            }
        }else if (activity == "mission") {
            if (isEmpty(grindGroup)) {
                 bot.reply(msg, "0 players are currently looking for a mission group")  
            }else {
                missionGroup.announceGrp(msg);
            }
        }
    }else if (msg.content.toLowerCase().startsWith("!help")) {
        bot.reply(msg, "Usage: \"!lfg <activity>\" - Enters you into a queue for a group for specified activity. \"!lfg <activity> | @user\" - Enters you and group members into queue for a group for specified activity. \"!status <activity>\" (pvp|mission|grind) will give you the current status of groups for specified activity. !help will display this message.")
    }
});


bot.loginWithToken("MTg5NDk4NjgwNDYwNDQzNjQ4.CjeD5g.VdwpFYgTQIzO6-lNbWjGN-bLQzg").catch((err) => {console.log(error)});