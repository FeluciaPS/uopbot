const {JSDOM} = require("jsdom");

global.pendingChanges = {};

let title_style = "background: rgba(100 , 100 , 255 , 0.3)";
let header_style = "background: rgba(100 , 100 , 255 , 0.2)";
let fieldname = "zerotolarea";

let buildEmptyTable = function(roomid) {
	let ret = `<div id="${fieldname}">`
	ret += `<table style="border-collapse: collapse ; border-spacing: 0px ; border: 1px solid ; width: 100%" border="1">`;
	ret += `<tbody><tr>`;
	ret += `<th colspan="3" style="${title_style}">Low Tolerance Moderation</th>`;
	ret += `</tr>`;
	ret += `<tr>`;
	ret += `<th style="${header_style}">Name</th>`;
	ret += `<th style="${header_style}">Reason</th>`;
	ret += `<th style="${header_style}"></th>`;
	ret += `</tr></tbody></table>`;

	ret += `<form style="margin:5px" data-submitsend="/botmsg ${Config.username}, ${roomid}, addzerotol {name}, {reason}">`;
	ret += `<input name="name" placeholder="Name" />`;
	ret += `<input name="reason" placeholder="Reason" />`;
	ret += `<input class="button" type="submit" />`;
    ret += `</form>`;
	
	ret += `</div>`;
	return ret;
}

let addTableRow = function(room, fielddata, name, reason) {
	let table = fielddata.querySelector("table");
	let row = table.insertRow(-1);

	let namecell = row.insertCell(0);
	let reasoncell = row.insertCell(1);
	let deletecell = row.insertCell(2);

	namecell.innerHTML = `<username class="username">${name}</username>`;
	reasoncell.innerHTML = reason;
	deletecell.innerHTML = `<button class="button" name="send" value="/botmsg ${Config.username}, ${room.id}, deletezerotol ${row.rowIndex}">Delete</button>`;
}

let removeTableRow = function(room, fielddata, index) {
	let table = fielddata.querySelector("table");
	table.deleteRow(index);
}

bot.on('c', (parts) => {
	let room = Utils.getRoom(parts[0]);
	let data = parts[3];
	if (!data) return;

	room = Rooms[room];

	// These are not the droids we're looking for
	if (!data.startsWith('/raw')) 
		return;
	
	data = data.slice(5);

	let { document } = new JSDOM(data).window;

	let summary = document.querySelector("summary");
	if (!summary || summary.textContent != "Source:")
		return;

	data = document.querySelector("code").innerHTML;

	if (!data.startsWith('/staffintro'))
		return;

	let dom = new JSDOM(document.querySelector("code").innerHTML.slice(12)).window.document;

	let table = dom.querySelector('#zerotolarea');
	if (!table) {
		table = new JSDOM(buildEmptyTable(room.id)).window.document;
		dom.append(table);
	}

	for (let i of pendingChanges[room]) {
		if (i.type === "removerow") {
			removeTableRow(room, table, i.index);
		}
		else if (i.type === "addrow") {
			addTableRow(room, table, i.name, i.reason);
		}
	}
	pendingChanges[room] = [];

	room.send(`/staffintro ${dom.body.innerHTML}`);
});