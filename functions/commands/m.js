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
    const questions = {
        "returns"       : 5,
        "average_daily_order" : 13,
        "orders" : 6,
    }

    const handlers = {
        "returns" : function(res) {
            return "Here are the top franchises with the most returns for the past week,\n " + JSON.parse(res.text).map(function(e) {
                return `*${e.franchise_name}*:${e.amount}\n`
            }).join(' ')
        },
        "average_daily_order" : function(res) {
            return `The Average Daily Order is ${JSON.parse(res.text)[0].counts}`
        },
        "orders" : function(res) {
            return "Here are the top franchises with the most orders for the past week,\n " + JSON.parse(res.text).map(function(e) {
                return `*${e.franchises_name}*:${e.amount}\n`
            }).join(' ')
        }
    }

    params = text.split(' ')
    command = params.shift()

    client.signin(
        metabase,
        function(err, res) {
            client.card({ id: res.id, card: questions[command] }, function(err, res) {
                callback(null, {
                    response_type: 'in_channel',
                    text: handlers[command](res)
                });
            })
        },
        function(err, res) {
            callback(null, {
                response_type: "in_channel",
                text: JSON.stringify(res)
            })
        }
    )
};
