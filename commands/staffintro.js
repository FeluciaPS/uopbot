const {JSDOM} = require("jsdom");
const he = require('he');

global.pendingChanges = {};

let title_style = "background: rgba(100 , 100 , 255 , 0.3)";
let header_style = "background: rgba(100 , 100 , 255 , 0.2)";
let fieldname = "zerotolarea";

let buildEmptyTable = function(roomid) {
	let ret = `<div id="${fieldname}">`
	ret += `<table style="border-collapse: collapse ; border-spacing: 0px ; border: 1px solid #888 ; width: 100%" border="1">`;
	ret += `<tbody><tr>`;
	ret += `<th colspan="3" style="${title_style}">Low Tolerance Moderation</th>`;
	ret += `</tr>`;
	ret += `<tr>`;
	ret += `<th style="${header_style}">Name</th>`;
	ret += `<th style="${header_style}">Reason</th>`;
	ret += `<th style="${header_style}"></th>`;
	ret += `</tr></tbody></table>`;

	ret += `<form style="margin:5px" data-submitsend="/botmsg ${Config.username}, ${roomid}, addzerotol {name}, {reason}">`;
	ret += `Add user: `;
	ret += `<input name="name" placeholder="Name" />`;
	ret += `<input name="reason" placeholder="Reason" maxlength="250"/>`;
	ret += `<input class="button" type="submit" />`;
    ret += `</form>`;
	
	ret += `</div>`;
	return ret;
}

let addTableRow = function(room, fielddata, name, reason) {
	let table = fielddata.querySelector("table");
	let row = table.insertRow(-1);

	let namecell = row.insertCell(0);
	namecell.setAttribute("style", "text-align:center");
	let reasoncell = row.insertCell(1);
	let deletecell = row.insertCell(2);
	deletecell.setAttribute("style", "text-align:center");

	namecell.innerHTML = `<username class="username">${name}</username>`;
	reasoncell.innerHTML = reason;
	deletecell.innerHTML = `<button class="button" name="send" value="/botmsg ${Config.username}, ${room.id}, deletezerotol ${toId(name)}">Delete</button>`;
	return true;
}

let removeTableRow = function(room, fielddata, name) {
	let table = fielddata.querySelector("table");

	let target = false;
    console.log('\n\n');
	for (let element of table.querySelectorAll("tr")) {
        let username = element.querySelector("username");
        if (!username) continue;
        
        if (toId(username.innerHTML) === name) target = element.rowIndex;
    }

	if (!target)
		return false;
		
	table.deleteRow(target);
	return true;
}

bot.on('c', (parts) => {
	let room = Utils.getRoom(parts[0]);
	let data = parts[3];
	if (!data) return;

	room = Rooms[room];

	if (!pendingChanges[room.id]) 
		return;

	// These are not the droids we're looking for
	if (!data.startsWith('/raw')) 
		return;
	
	data = he.decode(data.slice(5));

	let { document } = new JSDOM(data).window;

	let summary = document.querySelector("summary");
	if (!summary || summary.textContent != "Source:")
		return;

	data = document.querySelector("code").innerHTML;

	if (!data.startsWith('/staffintro'))
		return;

	let dom = new JSDOM(document.querySelector("code").innerHTML.slice(12)).window.document;

	let table = dom.querySelector(`#${fieldname}`);
	if (!table) {
		dom.body.append(new JSDOM(buildEmptyTable(room.id)).window.document.querySelector(`#${fieldname}`));
		table = dom.querySelector(`#${fieldname}`);
	}

	let success = false;
	for (let i of pendingChanges[room.id]) {
		if (i.type === "removerow") {
			success = success || removeTableRow(room, table, i.name);
		}
		else if (i.type === "addrow") {
			success = success || addTableRow(room, table, i.name, i.reason);
		}
	}
	pendingChanges[room.id] = [];

	if (success) room.send(`/staffintro ${dom.body.innerHTML}`);
});

module.exports = {
	addzerotol: function(room, user, args) {
		if (args.length < 2) return;
		if (!user.can(room, "@")) return;

		args[1] = args.slice(1).join(',');
		
		if (!pendingChanges[room.id]) {
			pendingChanges[room.id] = [];
		}

		pendingChanges[room.id].push({
			type: "addrow",
			name: args[0],
			reason: args[1]
		});

		room.send('/staffintro');
	},
	deletezerotol: 'removezerotol',
	removezerotol: function(room, user, args) {
		if (args.length != 1) return;
		if (!user.can(room, "@")) return;

		if (!pendingChanges[room.id]) {
			pendingChanges[room.id] = [];
		}

		pendingChanges[room.id].push({
			type: "removerow",
			name: toId(args[0])
		});

		room.send('/staffintro');
	}
}