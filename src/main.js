/* global Vue, ThinkerBrain */

// global vars for debugging etc
var VERBOSE = true

// Vue Components
Vue.component('game-instructions', {
    props: ['instructions'],
    template: '<div><h2>Instructions</h2> {{ instructions }}</div>'
  })

  Vue.component('game-btn', {
    props: ['newButton', 'method'],
    template: '<input type="button" class="gameBtn" v-bind:value="newButton.value" @click="method">'
  }) // couldn't figure out how to bind v-if successfully within a template at this stage

// main function to be run after the initial HTML has loaded
function main () { // eslint-disable-line no-unused-vars
  var game1 = new Vue({
    el: '#game-container',
    data: {
      // messages
      instructions: 'instructions go here',
      response: '',
      history: '',
      placeholder: 'Enter your guess',
      // for swapping buttons
      btnSeen: 'Start Game',
      // other variables
      buttons: [{value: 'Start Game'}, {value: 'Submit Guess'}, {value: 'Restart Game?'}],
      userInput: '',
      brain: new ThinkerBrain('HighLow', {tooHigh: 'Try a lower number!', tooLow: 'Try a higher number!'})
    },
    methods: {
      swapButton: function (newBtn) {
        let validButtons = this.buttons.map(btn => btn.value)
        if (validButtons.includes(newBtn)) {
          this.btnSeen = newBtn
        } else {
          console.warn('That button is not a valid option')
        }
      },
      startGame: function () {
        this.response = '',
        this.history = '',
        this.swapButton('Submit Guess')
        this.brain.startGame()
      },
      guessHandler: function () {
        if (this.userInput) {
          // only runs if the user has entered something into the user input box
          let output = this.brain.turnHandler(this.userInput)
          this.userInput = ''
          this.response = output.message
          this.history = this.brain.formattedHistory
          if (output.gameState === 'finished') {
            this.swapButton('Restart Game?')
          }
        }
      }
    }
  })
  
  var game2 = new Vue({ // eslint-disable-line no-unused-vars
    el: '#game2-container',
    data: {
      // messages
      instructions: 'instructions go here',
      response: '',
      history: '',
      placeholder: 'Enter your guess',
      // for swapping buttons
      btnSeen: 'Start Game',
      // other variables
      buttons: [{value: 'Start Game'}, {value: 'Submit Guess'}, {value: 'Restart Game?'}],
      userInput: '',
      brain: new ThinkerBrain('HotCold', {hot: 'Too Hot! (+/- 1-9)', warm: 'Getting Warm! (+/- 10-19)', cool: 'Cool... (+/- 20-39)', cold: 'Brr, cold! (+/- 40+)'})
    },
    methods: {
      swapButton: function (newBtn) {
        let validButtons = this.buttons.map(btn => btn.value)
        if (validButtons.includes(newBtn)) {
          this.btnSeen = newBtn
        } else {
          console.warn('That button is not a valid option')
        }
      },
      startGame: function () {
        this.response = '',
        this.history = '',
        this.swapButton('Submit Guess')
        this.brain.startGame()
      },
      guessHandler: function () {
        if (this.userInput) {
          // only runs if the user has entered something into the user input box
          let output = this.brain.turnHandler(this.userInput)
          this.userInput = ''
          this.response = output.message
          this.history = this.brain.formattedHistory
          if (output.gameState === 'finished') {
            this.swapButton('Restart Game?')
          }
        }
      }
    }
  })
}







