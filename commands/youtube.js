const {JSDOM} = require("jsdom");
const he = require('he');

let link = function(url, text) {
	return `<a href="${url}">${text}</a>`;
}

const psrules = "https://pokemonshowdown.com/rules";
const ytrules = "https://showdownyt.weebly.com/rules.html";

const styling = `background: rgba(100, 100, 255, 0.1); padding: 80px; height:100%`;


const questions = {
	"name": "What is your PS! username?",
	"activity": "Have you been chatting in the room for more than 2 weeks?",
	"reason": "Explain in a few sentences why you want to be whitelisted",
	"link": "Please give us a link to your channel",
	"content": "Briefly describe your content, this is not mandatory"
}

let generateInput = function(type, id, ...args) {
	switch (type) {
		case "short":
			if (!args[0]) throw new Error("generateInput: Short input must have a placeholder argument.");
			return `<input type="text" style="width:50%" name="${id}" placeholder="${args[0]}">`;
		case "long":
			return `<textarea style="width:80%; height: 15vh" name="${id}"></textarea>`;
		case "radio":
			let ret = [];
			for (let i in args) {
				ret.push(`<input id="rad${i}" type="radio" name="${id}" value="${i}"><label for="rad${i}">${args[i]}</label>`);
			}
			return ret.join('<br>');
		default:
			throw new Error(`unknown input type: ${type}`);
	}
}

let sendEmbed = function(user, name, activity, link, reason, content) {
	let namematches = user.id === toId(name);
	let data = {
		username: "Whitelist Application",
		embeds: [
			{
				title: "__New Whitelist Application__",
				description: "",
				color: 4054098,
				fields: [
					{
						"name": questions.name,
						"value": name
					},
					{
						"name": questions.activity,
						"value": activityanswers[activity]
					},
					{
						"name": questions.link,
						"value": link
					},
					{
						"name": questions.reason,
						"value": reason
					},
					{
						"name": questions.content,
						"value": content ? content : "-"
					}
				],
				footer: {
					text: `Whitelist Application submitted by ${user.name}.` + (namematches ? "" : ` PS username does NOT match claimed username`)
				}
			},
		],
	};
	let hook = Config.youtubehook;
	let request = require("request");
	request({url: hook, body: data, method: "POST", json: true});
}

let activityanswers = [
	"Yes, for more than a month",
	"Yes, for around 2 weeks",
	"I'm not sure"
];

let buildSuccessPage = function() {
	let ret = `<div style="${styling}">`
	ret += `<h1>YouTube Whitelist Application</h1>`;
	ret += `<hr>Thanks for your submission, we'll try to get back to you as soon as possible.`;
	ret += `</div>`;
	return ret;
}

let buildForm = function(error = false) {
	let ret = `<div style="${styling}">`
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
	ret += `<form style="margin:5px" data-submitsend="/w ${Config.username}, !code .requestwhitelist {name} -- {activity} -- {link} -- {reason} -- {content}">`;
	
	ret += `<label>${questions.name}</label><br>`;
	ret += `${generateInput("short", "name", "username")}`;
	ret += `<br><br>`;

	ret += `<label>${questions.activity}</label><br>`;
	ret += `${generateInput("radio", "activity", activityanswers[0], activityanswers[1], activityanswers[2])}`;
	ret += `<br><br>`;

	ret += `<label>${questions.reason}</label><br>`;
	ret += `${generateInput("long", "reason")}`;
	ret += `<br><br>`;

	ret += `<label>${questions.link}</label><br>`;
	ret += `${generateInput("short", "link", "channel url")}`;
	ret += `<br><br>`;

	ret += `<label>${questions.content}</label><br>`;
	ret += `${generateInput("long", "content")}`;
	ret += `<br><br>`;

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
		if (!Config.youtubehook) 
			return;
		
		if (!args[0]) {
			if (room.id !== "youtube") return
			return room.send(`/sendhtmlpage ${user.id}, whitelist, ${buildForm()}`);
		}

		args = args.join(', ').split('--');
		let [name, activity, link, reason, content, ...rest] = args.map(x => x.trim());
		if (rest.length) {
			console.log(rest);
			// something went wrong
			return;
		}

		if (!name)
			return room.send(`/sendhtmlpage ${user.id}, whitelist, ${buildForm("The username field is mandatory.")}`);
		if (!link)
			return room.send(`/sendhtmlpage ${user.id}, whitelist, ${buildForm("Please fill out a link to your channel.")}`);
		if (!activity)
			return room.send(`/sendhtmlpage ${user.id}, whitelist, ${buildForm("Please select an activity option.")}`);
		if (!reason)
			return room.send(`/sendhtmlpage ${user.id}, whitelist, ${buildForm("Please fill out why you want to be whitelisted.")}`);
		
		sendEmbed(user, name, activity, link, reason, content);
		return room.send(`/sendhtmlpage ${user.id}, whitelist, ${buildSuccessPage()}`);
	}
}