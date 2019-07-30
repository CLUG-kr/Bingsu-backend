/**
 * @module cauGetInfo
 */

const axios = require('axios').default,
      axiosCookieJarSupport = require('axios-cookiejar-support').default;

axiosCookieJarSupport(axios);

/**
 * get student info from portal
 * @async
 * @exports
 * @param {Object} jar jar used to get info with
 * @returns {Object} student info
 */
module.exports = async function(jar) {
    let response = await axios.post('https://mportal.cau.ac.kr/login/getLoginInfo.ajax', {}, {jar, withCredentials: true, headers: {'Content-Type': 'application/json'}});
    return response.data;
}