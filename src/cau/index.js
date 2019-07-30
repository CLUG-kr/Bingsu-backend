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
    this.getTimetable = async function(params) {
        let info = (await this.getInfo()).loginInfo;
        if (params)
            for(let i in params)
                info[i] = params[i];
        return await require('./timetables')(jar, {year: info.curyear, shtm: info.curshtm, stdno: info.stdno, campcd: info.campcd});
    }
}

module.exports = Cau;