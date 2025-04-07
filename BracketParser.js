function simplifyBracket(node) {
    // If there's no children, this isn't a match — just a player node
    if (!node.children || node.children.length !== 2) {
        return node.team || null;
    }

    const [left, right] = node.children;

    const player1 = simplifyBracket(left);
    const player2 = simplifyBracket(right);
    const winner = node.team || null;

    return {
        player1,
        player2,
        winner
    };
}

exports.getSimplifiedBracket = function (data) {
    const root = data.bracketData ? data.bracketData.rootNode : false;
    if (!root) throw new Error("Invalid bracket data: rootNode missing");
    return simplifyBracket(root);
}

function getEliminationDepths(node, depth = 0, eliminated = []) {
    if (!node || typeof node !== 'object') return;

    const { player1, player2, winner } = node;

    const p1 = typeof player1 === 'string' ? player1 : getFinalPlayer(player1);
    const p2 = typeof player2 === 'string' ? player2 : getFinalPlayer(player2);

    const loser = winner === p1 ? p2 : p1;
    eliminated.push({ player: loser, depth });

    if (typeof player1 === 'object') getEliminationDepths(player1, depth + 1, eliminated);
    if (typeof player2 === 'object') getEliminationDepths(player2, depth + 1, eliminated);

    return eliminated;
}

function getFinalPlayer(match) {
    if (typeof match === 'string') return match;
    return match.winner;
}

exports.getPlacementsFromSimplifiedBracket = function(bracket) {
    const placements = [];

    if (typeof bracket.player2 === "string") {
        let w = bracket.winner;
        bracket = bracket.player1;
        bracket.winner = w;
    }

    // 1st place: winner of winner's bracket
    const first = bracket.player1.winner;
    placements.push([first]);

    // 2nd place: loser of grand finals (i.e. root match)
    const p1 = getFinalPlayer(bracket.player1);
    const p2 = getFinalPlayer(bracket.player2);
    const second = bracket.winner === p1 ? p2 : p1;
    placements.push([second]);

    // Everyone else: collect from loser's bracket
    const eliminated = getEliminationDepths(bracket.player2, 0);

    const grouped = {};
    for (const { player, depth } of eliminated) {
        if (!grouped[depth]) grouped[depth] = new Set();
        grouped[depth].add(player);
    }

    const sortedDepths = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b); // lower depth = later round = higher placement

    for (const depth of sortedDepths) {
        const players = [...grouped[depth]];
        // Prevent duplicates (second place might've been recorded again)
        if (!placements.some(p => p.includes(players[0]))) {
            placements.push(players);
        }
    }

    return placements;
}