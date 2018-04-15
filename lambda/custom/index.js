const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.8a63df79-1afe-4ffe-9297-c8218bc0089d';

const sessionHandlers = {
    'LaunchRequest': function() {
        handleFlipACoinRequest(this.event, this.response);
        this.emit(':responseReady');
    },
    'ChooseCoinSideIntent': function() {
        handleChooseCoinSideRequest(this.event, this.response);
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        this.response.speak(HelpMessage).listen(HelpMessage);
        this.emit(':responseReady');
    },
};

/**
 * after launch
 * @param {object} event
 * @param {object} response
 */
function handleFlipACoinRequest(event, response) {
    const cardTitle = 'Pick a side';
    const output = 'Heads or Tails?';
    const repromptOutput = 'Pick a side - Heads or Tails?';
    const imageObj = undefined;

    response.speak(output)
        .listen(repromptOutput)
        .cardRenderer(cardTitle, output, imageObj);
}

/**
 * after having chosen a coin side
 * @param {object} event
 * @param {object} response
 */
function handleChooseCoinSideRequest(event, response) {
    const userCoinSide = event.request.intent.slots.coinSide.value;

    if (userCoinSide === 'tails' || userCoinSide === 'heads') {
        const coinflipSound = '<audio src="https://s3.amazonaws.com/verohill/coinflip.mp3" />';
        const winningCoinSide = Math.random() > 0.5 ? 'tails' : 'heads';
        const output = `${coinflipSound} It's ${winningCoinSide}. 
             You ${userCoinSide === winningCoinSide ?
             'win' : 'lose - HA HA!'}`;
        const cardTitle = 'Result';

        response.speak(output)
            .cardRenderer(cardTitle, output, undefined);
    } else {
        handleFlipACoinRequest(event, response);
    }
}

exports.handler = function(event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(sessionHandlers);
    alexa.execute();
};
