'use strict';

const Wit = require('node-wit').Wit,
    SlackBot = require('slackbots'),
    config = require('./../config.json'),
    bot = new SlackBot({
        token: config.token,
        name: config.name
    }),
    restaurants = require('./../restaurants.json');

const actions = {
    send(request, response) {
        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;
        return new Promise(function (resolve, reject) {
            // console.log('user said...', request.text);
            // console.log('sending...', JSON.stringify(response));
            bot.postMessage(sessionId, response.text, {
                as_user: true
            });
            return resolve();
        });
    },
    recommend({sessionId, context, text, entities}) {
        return new Promise(function (resolve, reject) {
            let recommandation = restaurants[Math.floor(Math.random() * restaurants.length)];
            context.recommendation = recommandation.name + ' (' + recommandation.location + ')';
            return resolve(context);
        });
    }
};

const wit = new Wit({accessToken: config.wit_token, actions});

bot.on('message', function (data) {
    if (data.hasOwnProperty('channel')
        && data.hasOwnProperty('text')
        && !data.hasOwnProperty('bot_id')
        && isBotMentioned(bot, data.text)
    ) {
        wit.runActions(data.channel, data.text, {});
    }
});

function isBotMentioned(bot, message) {
    let botName = '<@' + bot.self.id + '>';
    return message.indexOf(botName) !== -1;
}
