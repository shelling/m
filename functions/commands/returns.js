const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const client = require('../../utils/metabase.js');
const metabase = {
    email: process.env.METABASE_USER,
    password: process.env.METABASE_PASS
};

/**
* /hello
*
*   Basic "Hello World" command.
*   All Commands use this template, simply create additional files with
*   different names to add commands.
*
*   See https://api.slack.com/slash-commands for more details.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {

    var superagent = require('superagent');
    client.signin(metabase, function(err, res) {
            if (res.status === 200) {
                    client.card({ id: JSON.parse(res.text).id, card: 5 }, function(err, res) {
                        callback(null, {
                            response_type: 'in_channel',
                            text: `hello, <@${user}>...\nyou said: ${text}, ${res.text}`
                        });
                    })
            } else {
                callback(null, {
                    response_type: 'in_channel',
                    text: `${res.text}`
                })
            }
        })
};
