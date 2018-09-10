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
      brain: new ThinkerBrain('HighLow', {tooHigh: 'Try a lower number!', tooLow: 'Try a higherNumber!', justRight: `You got it in ${this.guessCount} guesses!`})
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
      clickHandler: function () {
        if (this.userInput) {
          // only runs if the user has entered something into the user input box
          let output = this.brain.turnHandler(this.userInput)
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
      responseOptions: [ 'Hot!',
        'Warm!',
        'Cool!',
        'Cold!',
        'Please enter a number between 0-99' ],
      response: '',
      history: '',
      placeholder: 'Enter your guess',
      // for hiding buttons
      btnSeen: 'start',
      // variables
      buttons: [{value: 'Start Game'}, {value: 'Submit Guess'}, {value: 'Restart Game?'}],
      userInput: '',
      userGuess: 0,
      guessCount: 0,
      number: 0
    },
    methods: {
      startGame: function () {
        // ensure all variables are reset upon game start
        this.response = ''
        this.history = ''
        this.userGuess = 0
        this.guessCount = 0
        this.number = Math.round(Math.random() * 100)
        // this.number = 50 // for testing purposes
        // hide undesired buttons
        this.btnSeen = 'submit'
      },
      checkInput: function () {
        this.userGuess = Number(this.userInput)
        let isValid = false
        if (!isNaN(this.userGuess)) {
          this.userGuess = Math.round(this.userGuess)
          if (this.userGuess >= 0 && this.userGuess <= 99) {
            isValid = true
          }
        } else {
          // input is invalid
        }
        this.userInput = ''
        return isValid
      },
      compareGuess: function () {
        if (this.checkInput()) {
          this.guessCount += 1
          this.history += `${this.userGuess} `
          if (this.userGuess === this.number) {
            this.response = `You got it in ${this.guessCount} trial`
            this.response += (this.guessCount === 1) ? `!` : `s!`
            this.btnSeen = 'restart'
          } else if (this.userGuess <= this.number + 9 && this.userGuess >= this.number - 9) {
            this.response = this.responseOptions[0]
          } else if (this.userGuess <= this.number + 19 && this.userGuess >= this.number - 19) {
            this.response = this.responseOptions[1]
          } else if (this.userGuess <= this.number + 39 && this.userGuess >= this.number - 39) {
            this.response = this.responseOptions[2]
          } else {
            this.response = this.responseOptions[3]
          }
        }
      }
    }
  })
}