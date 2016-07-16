'use strict';

var Wit = require('node-wit').Wit,
    SlackBot = require('slackbots'),
    config = require('./../config.json'),
    bot = new SlackBot({
    token: config.token,
    name: config.name
}),
    restaurants = require('./../restaurants.json');

var actions = {
    send: function send(request, response) {
        var sessionId = request.sessionId;
        var context = request.context;
        var entities = request.entities;
        var text = response.text;
        var quickreplies = response.quickreplies;

        return new Promise(function (resolve, reject) {
            // console.log('user said...', request.text);
            // console.log('sending...', JSON.stringify(response));
            bot.postMessage(sessionId, response.text, {
                as_user: true
            });
            return resolve();
        });
    },
    recommend: function recommend(_ref) {
        var sessionId = _ref.sessionId;
        var context = _ref.context;
        var text = _ref.text;
        var entities = _ref.entities;

        return new Promise(function (resolve, reject) {
            var recommandation = restaurants[Math.floor(Math.random() * restaurants.length)];
            context.recommendation = recommandation.name + ' (' + recommandation.location + ')';
            return resolve(context);
        });
    }
};

var wit = new Wit({ accessToken: config.wit_token, actions: actions });

bot.on('message', function (data) {
    if (data.hasOwnProperty('channel') && data.hasOwnProperty('text') && !data.hasOwnProperty('bot_id')) {
        wit.runActions(data.channel, data.text, {});
    }
});
