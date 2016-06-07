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

var grindKeys =["grind","susans","sausans","sausages"];
var missionKeys=["disco","scroll","boss"];
var pvpKeys = ["pvp", "murder", "murdertime", "fancypants","kill","pk"];
var pvpGroup;
var grindGroup;
var missionGroup;

function Group(number, members, activity) {
    this.number = number;
    this.members = members;
    this.activity = activity;
    this.addMember = function (newMember,mentions){
        this.number += 1;
        this.members += newMember;
        if (mentions ) {
            this.number += mentions.length;
            this.members +=mentions;
        }
    };
    this.announceGrp = function (msg){
         bot.reply(msg, this.number + " players are currently looking for a " + this.activity + " group: " + this.members ).catch((err) => { console.log(err); });
    };
    this.isFull = function(msg){
        if (this.number == 5) {
            bot.reply(msg, "Party Ready for " + this.activity+ "! please send out invites to " + this.members ).catch((err) => { console.log(err); });
            this.number = 0;
            this.members ="";
        }
    };
};
function isEmpty(object) {
  for(var key in object) {
    if(object.hasOwnProperty(key)){
      return false;
    }
  }
  return true;
}
function createGroup(msg, activity) {
    for (a in pvpKeys) {
        if (pvpKeys[a] == activity) {
            console.log(a);
            if (isEmpty(pvpGroup)) {
                pvpGroup = new Group(1 + msg.mentions.length, msg.author + msg.mentions, activity);
                pvpGroup.announceGrp(msg);
                pvpGroup.isFull(msg);
            } else {
                console.log("calling add member");
                pvpGroup.addMember(msg.author, msg.mentions );
                pvpGroup.announceGrp(msg);
                pvpGroup.isFull(msg);
            }
        }
    }
    for (a in grindKeys) {
        if (grindKeys[a] == activity) {
            if (isEmpty(grindGroup)) {
                grindGroup = new Group(1 + msg.mentions.length, msg.author + msg.mentions, activity);
                grindGroup.announceGrp(msg);
                grindGroup.isFull(msg);
            } else {
                console.log("calling add member");
                grindGroup.addMember(msg.author, msg.mentions);
                grindGroup.announceGrp(msg);
                grindGroup.isFull(msg);
            }
        }
    }
    for (a in missionKeys) {
        if (missionKeys[a] == activity) {
            if (isEmpty(missionGroup)) {
                missionGroup = new Group(1 + msg.mentions.count(), msg.author + msg.mentions, activity);
                missionGroup.announceGrp(msg);
                missionGroup.isFull(msg);
            } else {
                missionGroup.addMember(msg.author, msg.mentions);
                missionGroup.announceGrp(msg);
                missionGroup.isFull(msg);
            }
        }
    }
};

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