/* global Vue, ThinkerBrain, GuesserBrain, HotColdGuesserBrain, HotColdThinkerBrain */

// global vars for debugging etc
var VERBOSE = true // eslint-disable-line no-unused-vars

// Vue Components
Vue.component('game-instructions', {
  props: ['instructions'],
  template: '<div class="instructions"><h2>Instructions</h2> {{ instructions }}</div>'
})

Vue.component('game-btn', {
  props: ['newButton', 'method'],
  template: '<input type="button" class="gameBtn" v-bind:value="newButton" @click="method">'
}) // couldn't figure out how to bind v-if successfully within a template at this stage

Vue.component('version-btn', {
  props: ['gameNum', 'method'],
  template: '<input type="button" class="versionBtn" v-bind:id="gameNum" v-bind:value="gameNum" @click="method">'
})

Vue.component('game', {
  props: ['instructions', 'history'],
  template: '<div class="game-container"><game-instructions v-bind="{instructions}"></game-instructions><slot></slot><ul class="history"><li v-for="item in history">{{ item }}</li></ul></div>'
})

// main function to be run after the initial HTML has loaded
function main () { // eslint-disable-line no-unused-vars
  var controller = new Vue({ // eslint-disable-line no-unused-vars
    el: '#container',
    data: {
      placeholder: 'Enter your guess',
      instructions: 'Welcome to the Number Guessing Games. Please select a number above to play a game.',
      gameSeen: 'splash',
      btnSeen: 'Start Game',
      validButtons: ['Start Game', 'User Response', 'Restart Game?'],
      buttons: [],
      history: [],
      userInput: '',
      response: '',
      allMyBrains: [new ThinkerBrain(), new HotColdThinkerBrain(), new GuesserBrain(), new HotColdGuesserBrain()],
      currentBrain: null
    },
    methods: {
      swapGame: function (gameNum) {
        this.currentBrain = this.allMyBrains[gameNum - 1]
        this.instructions = this.currentBrain.instructions
        this.buttons = this.currentBrain.buttons
        // reinitialise variables so game is at the start
        this.history = []
        this.response = ''
        this.userInput = ''
        this.swapButton('Start Game')
        this.gameSeen = `game-${gameNum}`
        this.updateButtons(gameNum)
      },
      updateButtons: function (aBtn) {
        for (let i = 1; i <= 4; i++) {
          // iterate over all of the version buttons and add active-game to the game we are swapping to and make sure it is removed from the rest of them.
          let btn = document.getElementById(i)
          if (i === aBtn) {
            btn.classList.add('active-game')
          } else {
            btn.classList.remove('active-game')
          }
        }
      },
      swapButton: function (newBtn) {
        if (this.validButtons.includes(newBtn)) {
          this.btnSeen = newBtn
        } else {
          console.warn('That button is not a valid option')
        }
      },
      startThinkerGame: function () {
        // reinitialise variables
        this.history = []
        this.userInput = ''
        this.swapButton('User Response')
        this.currentBrain.startGame()
      },
      startGuesserGame: function () {
        // reinitialise variables
        this.history = []
        this.response = ''
        // display user buttons and get the first guess
        let firstGuess = this.currentBrain.startGame()
        this.response = `Hmm, I guess ${firstGuess}.`
        this.swapButton('User Response')
      },
      userGuessHandler: function () {
        if (this.userInput) {
          // only runs if the user has entered something into the user input box
          let gameState = this.currentBrain.turnHandler(this.userInput)
          this.userInput = ''
          this.history = this.currentBrain.formattedHistory
          if (gameState === 'finished') {
            this.swapButton('Restart Game?')
          }
        }
      },
      userResponseHandler: function (message) {
        // add the previous guess and the users response to the history
        let brainResponse = this.currentBrain.turnHandler(message)
        this.history = this.currentBrain.formattedHistory
        if (brainResponse.gameState === 'finished') {
          // if the game is over, display the final message and the restart game button
          this.response = brainResponse.response
          this.swapButton('Restart Game?')
        } else {
          this.response = `Ok then, I'll guess ${brainResponse.response}.`
        }
      }
    }
  })
}
