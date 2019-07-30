/**
 * @module FindAndSubmitForm
 */

const axios = require('axios').default,
    axiosCookieJarSupport = require('axios-cookiejar-support').default,
    cheerio = require('cheerio'),
    qs = require('qs');

axiosCookieJarSupport(axios);

/**
 * Find the form, with 'frmData' id, from the html string and submit it with axois and jar provided.
 * @exports
 * @async
 * @param {String} html html string which contains form with id 'frmData'
 * @param {*} axios axios to use with
 * @param {*} jar jar to use with
 */
module.exports = async function (html, axios, jar) {
    // parse html 
    let $ = cheerio.load(html);

    // serialize form
    let form = $('#frmData'),
        formData = {},
        formDataArray = form.serializeArray();
    for (let i of formDataArray)
        formData[i.name] = i.value;

    // set header
    let headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    // submit
    return await axios.post(form.attr('action'), qs.stringify(formData), {
        jar,
        withCredentials: true,
        headers
    });
}