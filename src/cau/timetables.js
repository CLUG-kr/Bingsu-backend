/**
 * @module cauGetInfo
 */

const axios = require('axios').default,
      axiosCookieJarSupport = require('axios-cookiejar-support').default;

axiosCookieJarSupport(axios);

/**
 * get timetable from portal
 * @async
 * @exports
 * @param {Object} jar jar used to get info with
 * @param {Object} info stdno, campcd, year, shtm
 * @returns {Object} Timetable
 */
module.exports = async function(jar, info) {
    let response = await axios.post('https://mportal.cau.ac.kr/std/usk/sUskCap003/selectList.ajax', info, {jar, withCredentials: true, headers: {'Content-Type': 'application/json'}});
    return response.data.resList.map(i => {
        return {
            from: i.tm1,
            until: i.tm2,
            days: [i.d1, i.d2, i.d3, i.d4, i.d5, i.d6]
        };
    });
}