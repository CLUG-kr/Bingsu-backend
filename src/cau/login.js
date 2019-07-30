'use strict';

/**
 * @module cauLogin
 */


const axios = require('axios').default,
      axiosCookieJarSupport = require('axios-cookiejar-support').default,
      findAndSubmitForm = require('./findAndSubmitForm'),
      qs = require('qs'),
      tough = require('tough-cookie');
axiosCookieJarSupport(axios);

/**
 * Login into cau portal and returns cookie jar
 * @exports
 * @async
 * @param {String} portalId id used to login cau.ac.kr portal
 * @param {String} portalPassword password use to login cau.ac.kr portal
 */
module.exports = async function(portalId, portalPassword) {
    let cookieJar = new tough.CookieJar();
    
    // AuthCheck / ssocheck
    await axios.get('https://mportal.cau.ac.kr/common/auth/SSOlogin.do?redirectUrl=/main.do', {
        jar: cookieJar,
        withCredentials: true
    });
    await axios.get('https://mportal.cau.ac.kr/common/auth/SSOcheck.do?redirectUrl=/main.do', {
        jar: cookieJar,
        withCredentials: true
    })
    
    let authCheckResponse = await axios.get('https://mportal.cau.ac.kr/ssocheck.jsp?redirectUrl=/main.do', {
        jar: cookieJar,
        withCredentials: true
    });
    await findAndSubmitForm(authCheckResponse.data, axios, cookieJar);

    // SSO Login
    let loginPostResponse = await axios.post('https://sso2.cau.ac.kr/SSO/AuthWeb/Logon.aspx?ssosite=mportal.cau.ac.kr', qs.stringify({
        'autoLogin': 'Y',
        'credType': 'BASIC',
        'retURL': 'http://mportal.cau.ac.kr/common/auth/SSOlogin.do?redirectUrl=/main.do',
        'redirectUrl': '/main.do',
        'userID': portalId,
        'password': portalPassword,
        //'pwdTag': 'password'
    }), {
        jar: cookieJar,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://mportal.cau.ac.kr'
        }
    });
    let logonDomainResponse = await findAndSubmitForm(loginPostResponse.data, axios, cookieJar);
    await findAndSubmitForm(logonDomainResponse.data, axios, cookieJar);

    // Portal SSO Login
    await axios.get('http://mportal.cau.ac.kr/common/auth/SSOlogin.do?redirectUrl=/main.do', {
        jar: cookieJar,
        withCredentials: true,
        maxRedirects: 100
    });

    // return
    return cookieJar;
}