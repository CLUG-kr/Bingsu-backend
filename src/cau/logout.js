'use strict';

/**
 * @module cauLogout
 */


const axios = require('axios').default,
      axiosCookieJarSupport = require('axios-cookiejar-support').default,
      qs = require('qs');
      //findAndSubmitForm = require('./findAndSubmitForm');
axiosCookieJarSupport(axios);

/**
 * logout
 * @param {Object} jar jar to logout
 */
module.exports = async function(jar) {
    await axios.post('https://mportal.cau.ac.kr/login/logout.ajax', {}, {
        jar,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    await axios.get('https://sso2.cau.ac.kr/SSO/AuthWeb/Logoff.aspx?ssosite=mportal.cau.ac.kr&retURL=http%3A%2F%2Fmportal.cau.ac.kr%2Fmain.do%3FredirectUrl%3D%2Fmain.do', {
        jar,
        withCredentials: true
    });
    await axios.post('https://sso2.cau.ac.kr/SSO/AuthWeb/LogoffDomain.aspx', qs.stringify({
        'ssosite': 'mportal.cau.ac.kr',
        'retURL': '	http://mportal.cau.ac.kr/main.do?redirectUrl=/main.do',
        'event' : 't'
    }), {
        jar,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return;
}