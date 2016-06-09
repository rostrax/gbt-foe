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
var susansKeys =["susans","sausans","sausages"];
var missionKeys=["disco","relic"];
var bossKeys = ["boss", "summon"]
var pvpKeys = ["pvp", "murder", "murdertime", "fancypants","kill","pk"];
var pirateKeys = ["pirates", "island", "pirate"];
var grpArray = [pvpGroup,susansGroup,missionGroup, pirateGroup, bossGroup];
var actArrays = [ pvpKeys,susansKeys,missionKeys,pirateKeys, bossKeys]; 
var pvpGroup;
var susansGroup;
var missionGroup;
var pirateGroup;
var bossGroup;

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
        if (this.number >= 5) {
            bot.reply(msg, "Party Ready for " + this.activity+ "! please send out invites to " + this.members ).catch((err) => { console.log(err); });
            this.number = 0;
            this.members ="";
        }
    };
    this.removeSelf = function(msg){
        if (this.members == msg.author) {
            this.members ="";
            this.number = 0;
        }
        else  {
            this.members -= msg.author;
            this.number -= 1;
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
function createGroup(msg, activity) {
    for (act in actArrays){
        for (a in actArrays[act]){
            if ( actArrays[act][a] == activity) {
                if (isEmpty(grpArray[act])) {
                    grpArray[act] = new Group(1 + msg.mentions.length, msg.author + msg.mentions, activity);
                }
                else {
                    grpArray[act].addMember(msg.author, msg.mentions);
                }
                grpArray[act].announceGrp(msg);
                grpArray[act].isFull(msg);
            }
        }
    }
};
function getActivity(activity) {
    for (act in actArrays){
        for (a in actArrays[act]){
            if ( actArrays[act][a] == activity) {
                return grpArray[act];       
            }
        }
    }
}

//Bot catch for incoming messages. Splits them out to interpret what user would like to do.
//(Could also use a bit of re-engineering. Not so high of priority.)
bot.on('message', (msg) => {
    if (msg.content.toLowerCase().startsWith("!lfg")) {
        if (msg.content.indexOf("|") == -1) {
            var activity = msg.content.substr(5,msg.content.length-5);          
        }
        else {
            var activity = msg.content.substr(5, msg.content.indexOf("|") - 6);
        }
        createGroup(msg,activity);    
    }
    else if (msg.content.toLowerCase().startsWith("!status")) {
        var activity = msg.content.substr(8,msg.content.length-5);
            if (isEmpty(getActivity(activity))) {
                bot.reply(msg, "0 players are currently looking for a " + activity +" group")
            }
            else {
                getActivity(activity).announceGrp(msg);
            }
    }
    else if (msg.content.toLowerCase().startsWith("!help")) {
        bot.sendMessage(msg.author, "\"!lfg <activity>\" - Enters you into a queue for a group for specified activity. e.g. \"!lfg pvp\" \n \"!lfg <activity> | @user\" - Enters you and group members into queue for a group for specified activity. e.g. \"!lfg sausans | @Xin#2087 @Thork#4156\" \n \"!status <activity>\" will give you the current status of groups for specified activity.\ \n \"!removeme <activity>\" will remove you from the activity, all will remove you from all queues.\ \n \"!activites\" will show a list of current coded activities. \n \"!help\" will display this message.")
    }
    else if (msg.content.toLowerCase().startsWith("!activities")) {
        bot.reply(msg, "Current Activities are: pirates, susans, pvp, disco(scrolls) and boss(scrolls)");
    }
    else if (msg.content.toLowerCase().startsWith("!removeme")) {
        var activity = msg.content.substr(10,msg.content.length-5);
        console.log("1"+activity+"1");
        if (activity == "all") {
            for (grp in grpArray){
                if (isEmpty(grpArray[grp])){
                    console.log("Empty Object");
                }
                else if (grpArray[grp].members.includes(msg.author)) {
                    grpArray[grp].removeSelf(msg);
                
                }
            }
            bot.reply(msg, "You have been removed from all queues");
        }
        else if (isEmpty(getActivity(activity))) {
            bot.reply(msg, "Error 45: There is no " + activity + " group object, if you feel this is an error, please report to Rostrax")
        }
        else {
            getActivity(activity).removeSelf(msg);
            getActivity(activity).announceGrp(msg);
        }
    }
});

bot.loginWithToken("MTg5NDk4NjgwNDYwNDQzNjQ4.CjeD5g.VdwpFYgTQIzO6-lNbWjGN-bLQzg").catch((err) => {console.log(error)});