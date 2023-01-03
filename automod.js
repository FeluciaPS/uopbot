bot.on('trypunish', (room, type, user, reason = "Automated Punishment") => {
	if (!pendingChanges[room.id]) pendingChanges[room.id] = [];
	pendingChanges[room.id].push({
		type: "punish",
		punishment: type,
		name: user.name ? user.name : user,
		reason: reason
	});
	room.send('/staffintro');
});