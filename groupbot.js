//FoE Groupbot
//Written by Jason C. Aka Rostrax for Fist of the Empire
//Copyright 2016
//Do not redistribute or use without my expressed consent.

var Discord = require("discord.js");
var bot = new Discord.Client();

console.log("Beginning Bot");
bot.on('warn', (m) => console.log('[warn]', m));
bot.on('debug', (m) => console.log('[debug]', m));
bot.on('error', (m) => console.log('[error]', m));


//Setting up list of words for different group types.
var susansKeys =["susans","sausans","sausages", "sg"];
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
function Group(number, members, mentions, activity) {
    
    this.number = number;
    this.members = [members.toString()];
    this.activity = activity;
    if (mentions.length >= 1) {
        this.members.push(mentions.toString());
        this.number += mentions.length;
    }
    //Function to add a member to the group
    this.addMember = function (newMember,mentions,numMem){
        this.number += numMem;
        this.members.push(newMember.toString());
        if (mentions.length >= 1 ) {
            this.number += mentions.length;
            this.members.push(mentions.toString());
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
            this.members =[];
        }
    };
    this.removeSelf = function(msg){
        if (this.members == msg.author) {
            this.members = [];
            this.number = 0;
        }
        else if (this.members.toString().includes(msg.author.toString())){
            u = msg.author.toString();
            i=this.members.indexOf(u);
            console.log("User"+u+" Index"+i)
            switch (i) {
                case 0:
                    this.members =this.members.slice(1,5);
                    break;
                case 1:
                    console.log(this.members.splice(1,1,this.members[2],this.members[3]));
                    usr=this.members[0];
                    this.members = this.members.slice(2.5);
                    this.members.push(usr);
                    break;
                case 2:
                    usr=this.members.slice(0,2);
                    this.members = this.members.slice(3.5);
                    this.members.push(usr);
                    break;
                case 3:
                    usr=this.members.slice(0,3);
                    this.members = this.members.slice(4.5);
                    this.members.push(usr);
                    break;
                case 4:
                    this.members = this.members.slice(0.4);
                    this.members.push(usr);
                    break;
            }
            this.number -= 1; 
        }else {
            bot.reply(msg, "You are not in the group to be removed.")
        }
    };
    this.reset = function(msg){
        this.members = [];
        this.number = 0;
    }
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
            if ( actArrays[act][a] == activity.toLowerCase()) {
                if (isEmpty(grpArray[act])) {
                    grpArray[act] = new Group(1, msg.author, msg.mentions, activity);
                }
                else if (msg.mentions.length >= 1) {
                    grpArray[act].addMember(msg.author, msg.mentions, msg.mentions.length);
                }
                else{
                    console.log(" Mentions " +msg.mentions.toString());
                    grpArray[act].addMember(msg.author, msg.mentions, 1);
                }
                grpArray[act].announceGrp(msg);
                grpArray[act].isFull(msg);
            }
        }
    }
};
function createLFM(msg, activity, numMem) {
    for (act in actArrays){
        for (a in actArrays[act]){
            if ( actArrays[act][a] == activity.toLowerCase()) {
                if (isEmpty(grpArray[act])) {
                    grpArray[act] = new Group(numMem, msg.author, msg.mentions, activity);
                }
                else {
                    grpArray[act].addMember(msg.author, msg.mentions, numMem);
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
            if ( actArrays[act][a] == activity.toLowerCase()) {
                return grpArray[act];       
            }
        }
    }
}

//Bot catch for incoming messages. Splits them out to interpret what user would like to do.
//(Could also use a bit of re-engineering. Not so high of priority.)
bot.on('message', (msg) => {
    if (msg.content.toLowerCase().startsWith("lf")) {
        if (msg.content.charAt(2) == "g") {
            if (msg.content.indexOf("|") == -1) {
                var activity = msg.content.substr(4,msg.content.length-4);
            }
            else {
                var activity = msg.content.substr(4, msg.content.indexOf("|") - 5);
            }
            console.log(msg.mentions.length);
            createGroup(msg,activity);   
        }
        else if (msg.content.charAt(3) == "m") {
            numMem= 5 - msg.content.charAt(2);
            var activity = msg.content.substr(5,msg.content.length-4);
            createLFM(msg, activity, numMem);
        }
    }
    else if (msg.content.toLowerCase().startsWith("!!reset")) {
        var activity = msg.content.substr(8,msg.content.length-4);
        getActivity(activity).reset(msg);
    }
    else if (msg.content.toLowerCase().startsWith("status")) {
        var activity = msg.content.substr(7,msg.content.length-4);
            if (isEmpty(getActivity(activity))) {
                bot.reply(msg, "0 players are currently looking for a " + activity +" group")
            }
            else {
                getActivity(activity).announceGrp(msg);
            }
    }
    else if (msg.content.toLowerCase().startsWith("help")) {
        bot.sendMessage(msg.author, "\"lfg <activity>\" - Enters you into a queue for a group for specified activity. e.g. \"lfg pvp\" \n \"lfg <activity> | @user\" - Enters you and group members into queue for a group for specified activity. e.g. \"lfg sausans | @Xin#2087 @Thork#4156\" \n \"lf*m <activity>\" will only add yourself to the group but the program will show the amount of people looking for group correctly. e.g. \"lf2m sausans\" will show 3 people lf sausans group. \n \"status <activity>\" will give you the current status of groups for specified activity.\ \n \"removeme <activity>\" will remove you from the activity, all will remove you from all queues.\ \n \"activites\" will show a list of current coded activities. \n \"help\" will display this message.")
    }
    else if (msg.content.toLowerCase().startsWith("activities")) {
        bot.reply(msg, "Current Activities are: pirates, sausans, pvp, disco(scrolls) and boss(scrolls)");
    }
    else if (msg.content.toLowerCase().startsWith("removeme")) {
        var activity = msg.content.substr(9,msg.content.length-4);
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
            a = getActivity(activity);
            a.removeSelf(msg);
            a.announceGrp(msg);
        }
    }
});

bot.loginWithToken("MTg5NDk4NjgwNDYwNDQzNjQ4.CkRNpg.HvNTNTk368MA0QbNGEQaFq6eY4U").catch((err) => {console.log(error)});
