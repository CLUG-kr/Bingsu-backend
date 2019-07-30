function Cau() {
    let jar;
    this.login = async function (id, password) {
        jar = await require('./login')(id, password);
    }
    this.logout = async function () {
        await require('./logout')(jar);
    }
    this.getInfo = async function () {
        return await require('./getInfo')(jar);
    }
    this.getTimetable = async function() {
        let {curyear, curshtm, stdno, campcd} = (await this.getInfo()).loginInfo;
        return await require('./timetables')(jar, {year: curyear, shtm: curshtm, stdno, campcd});
    }
}

module.exports = Cau;