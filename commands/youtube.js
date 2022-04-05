const {JSDOM} = require("jsdom");
const he = require('he');

let link = function(url, text) {
	return `<a href="${url}">${text}</a>`;
}

const psrules = "https://pokemonshowdown.com/rules";
const ytrules = "https://showdownyt.weebly.com/rules.html";

let generateInput = function(type, id, ...args) {
	switch (type) {
		case "short":
			if (!args[0]) throw new Error("generateInput: Short input must have a placeholder argument.");
			return `<input type="text" style="width:50%" name="${id}" placeholder="${args[0]}>`;
		case "long":
			return `<textarea style="width:80%; height: 15vh" name="${id}"></textarea>`;
		case "radio":
			let ret = [];
			for (let i in args) {
				ret.push(`<input type="radio" name="${id}" value="${args[i]}>`);
			}
			return ret.join('<br>');
		default:
			throw new Error(`unknown input type: ${type}`);
	}
}

let buildForm = function(error = false) {
	let ret = `<div style="background: rgba(100, 100, 255, 0.2); padding: 80px">`
	ret += `<h1>YouTube Whitelist Application</h1>`;
	ret += `<hr>Before applying make sure you meet the following requirements:<ul>`;
	ret += `<li>You must have at least 2 weeks of chatting in the YouTube chatroom. This does not mean you must be extremely active, but it does mean we want to have seen your name in chat relatively regularly for more than just 1 message.</li>`;
	ret += `<li>On top of 2 weeks of chatting, you must also have relatively good behaviour to be eligible</li>`;
	ret += `<li>You need a youtube channel (duh)</li>`;
	ret += `<li>Your youtube channel must not contain content that violates PS! ${link(psrules, "global rules")} or YouTube ${link(ytrules, "room rules")}</li></ul><hr>`;

	if (error) {
		ret += `<div class="broadcast-red">${error}</div>`;
	}

	// Form
	ret += `<form style="margin:5px" data-submitsend="/w ${Config.username}, !code .submitwhitelist {name} -- {activity} -- {link} -- {reason} -- {content}">`;
	
	ret += `<label>What is your PS! username?</label>`;
	ret += `${generateInput("short", "name", "username")}`;
	ret += `<br>`;

	ret += `<label>Have you been chatting in the room for more than 2 weeks?</label>`;
	ret += `${generateInput("radio", "activity", "Yes, for more than a month", "Yes, for around 2 weeks", "I'm not sure")}`;
	ret += `<br>`;

	ret += `<label>Explain in a few sentences why you want to be whitelisted</label>`;
	ret += `${generateInput("long", "reason")}`;
	ret += `<br>`;

	ret += `<label>Please give us a link to your channel</label>`;
	ret += `${generateInput("short", "link", "channel url")}`;
	ret += `<br>`;

	ret += `<label>Briefly describe your content, this is not mandatory</label>`;
	ret += `${generateInput("long", "content")}`;
	ret += `<br>`;

	ret += `<input class="button" type="submit" />`;
	ret += `</form>`;

	ret += `</div>`;
	return ret;
}

bot.on('c', (parts) => {
	// imma need this later
});

module.exports = {
	requestwhitelist: function(room, user, args) {
		if (room.id != "youtube")
			return;
		
		room.send(`/sendhtmlpage ${user.id}, whitelist, ${buildForm()}`);
	}
}