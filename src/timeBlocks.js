module.exports = function () {
    let blocks = {};
    for(let i = 0; i < 7; i++) {
        blocks[i] = [];
        for(let j = 0; j < 6 * 24; j++)
            blocks[i].push(true);
    }
    function parseClassTimeString(str) {
        console.log(str);
        let matches = /([0-9]{2}):([0-9]{2})/.exec(str);
        let hours = Number(matches[1]), minutes = Number(matches[2]);
        return {hours, minutes}
    };
    this.addClass = function(day, from, until) {
        if (day < 0) return;
        from = parseClassTimeString(from);
        until = parseClassTimeString(until);
        let fromBlock = from.hours * 6 + Math.floor(from.minutes / 10),
            untilBlock = until.hours * 6 + Math.ceil(until.minutes / 10);
        for(let i = fromBlock; i <= untilBlock; i++)
            blocks[day][i] = false;
    };
    this.getSpareBlocks = function() {
        return blocks;
    };
}