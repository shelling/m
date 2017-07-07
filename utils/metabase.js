const lib = require('lib')({token: process.env.STDLIB_TOKEN});
var superagent = require('superagent');

module.exports = {
    signin: function(context, callback, exception) {

        lib.utils.storage.get("session", function(err, session) {
            if (session && session.id && Date.now() - session.timestamp < 360000) {
                callback(null, session)
            } else {
                superagent
                .post("http://metabase-757206338.us-west-2.elb.amazonaws.com/api/session")
                .send(context)
                .set('Content-Type', 'application/json')
                .end(function(err, res) {
                    if (res.status === 200) {
                        session = { id: JSON.parse(res.text).id, timestamp: Date.now() }
                        lib.utils.storage.set("session", session, function(err, session) {
                            callback(null, session)
                        })
                    } else {
                        exception(null, res)
                    }
                })
            }
        })

    },
    card: function(context, callback) {
        superagent
        .post(`http://metabase-757206338.us-west-2.elb.amazonaws.com/api/card/${context.card}/query/json`)
        .set('X-Metabase-Session', `${context.id}`)
        .end(callback)
    }
};
