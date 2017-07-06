var superagent = require('superagent');

module.exports = {
    signin: function(context, callback) {
        superagent
        .post("http://metabase-757206338.us-west-2.elb.amazonaws.com/api/session")
        .send(context)
        .set('Content-Type', 'application/json')
        .end(callback)
    },
};
