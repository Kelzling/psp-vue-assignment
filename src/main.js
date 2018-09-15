/* global Vue, ThinkerBrain */

// global vars for debugging etc
var VERBOSE = true // eslint-disable-line no-unused-vars

// Vue Components
Vue.component('game-instructions', {
  props: ['instructions'],
  template: '<div class="instructions"><h2>Instructions</h2> {{ instructions }}</div>'
})

Vue.component('game-btn', {
  props: ['newButton', 'method'],
  template: '<input type="button" class="gameBtn" v-bind:value="newButton.value" @click="method">'
}) // couldn't figure out how to bind v-if successfully within a template at this stage

// main function to be run after the initial HTML has loaded
function main () { // eslint-disable-line no-unused-vars
  var game1 = new Vue({ // eslint-disable-line no-unused-vars
    el: '#game-container',
    data: {
      // messages
      instructions: 'You guess the number! The game will generate a random number between 0 and 99. Enter your guess in the box below and the game will tell you if your guess is too high or too low!',
      history: '',
      placeholder: 'Enter your guess',
      // for swapping buttons
      btnSeen: 'Start Game',
      // other variables
      buttons: [{value: 'Start Game'}, {value: 'Submit Guess'}, {value: 'Restart Game?'}],
      userInput: '',
      myBrain: new ThinkerBrain('HighLow', {tooHigh: 'Try lower!', tooLow: 'Try higher!'})
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
        this.response = ''
        this.history = ''
        this.swapButton('Submit Guess')
        this.myBrain.startGame()
      },
      guessHandler: function () {
        if (this.userInput) {
          // only runs if the user has entered something into the user input box
          let output = this.myBrain.turnHandler(this.userInput)
          this.userInput = ''
          this.response = output.message
          this.history = this.myBrain.formattedHistory
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
      instructions: 'You guess the number! The game will generate a random number between 0 and 99. Enter your guess in the box below and the game will tell you if you are COLD (more than 40 from the target number), COOL (within 20-39 of the target number), WARM (within 10-19 of the target number), or HOT (within 9 of the target number).',
      response: '',
      history: '',
      placeholder: 'Enter your guess',
      // for swapping buttons
      btnSeen: 'Start Game',
      // other variables
      buttons: [{value: 'Start Game'}, {value: 'Submit Guess'}, {value: 'Restart Game?'}],
      userInput: '',
      myBrain: new ThinkerBrain('HotCold', {hot: 'HOT', warm: 'WARM', cool: 'COOL', cold: 'COLD'})
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
        this.response = ''
        this.history = ''
        this.swapButton('Submit Guess')
        this.myBrain.startGame()
      },
      guessHandler: function () {
        if (this.userInput) {
          // only runs if the user has entered something into the user input box
          let output = this.myBrain.turnHandler(this.userInput)
          this.userInput = ''
          this.response = output.message
          this.history = this.myBrain.formattedHistory
          if (output.gameState === 'finished') {
            this.swapButton('Restart Game?')
          }
        }
      }
    }
  })

  var game3 = new Vue({ // eslint-disable-line no-unused-vars
    el: '#game3-container',
    data: {
      instructions: "The game will guess your number! Think of a number between 0 and 99. The game will output it's guess and you need to tell it if it's too high, too low, or correct. Don't lie though, or the game will call you out!",
      buttons: [{value: 'Start Game'}, {value: 'Restart Game?'}, {value: 'Higher'}, {value: 'Correct'}, {value: 'Lower'}],
      response: '',
      history: [],
      btnSeen: 'Start Game',
      guess: 0,
      upperBound: 99,
      lowerBound: 0,
      guessCount: 0
    },
    methods: {
      swapButton: function(newBtn) {
        let validButtons = ['Start Game', 'Restart Game?', 'User Response Buttons']
        if (validButtons.includes(newBtn)) {
          this.btnSeen = newBtn
        } else {
          console.warn('That button is not a valid option')
        }
      },
      startGame: function() {
        // reinitialise variables
        this.guess = 0
        this.upperBound = 99
        this.lowerBound = 0
        this.response = ''
        this.history = []
        this.guessCount = 0
        if (VERBOSE) {
          console.log(`Guess: ${this.guess}, Upper Bound: ${this.upperBound}, Lower Bound: ${this.lowerBound}, history: ${this.history}, Guess Count: ${this.guessCount}`)
        }
        // display user buttons and get the first guess
        this.swapButton('User Response Buttons')
        this.response = this.computerGuess()
      },
      turnHandler: function(message) {
        // add the previous guess and the users response to the history
        this.history.unshift({guess: this.guess, response: message})
        if (VERBOSE) {
          console.log(this.history)
        }
        if (message !== 'Correct') {
          // if the game is still going, update the bounds, generate and output the new guess from the computer
          this.updateBounds(message)
          this.response = this.computerGuess()
          if (VERBOSE) {
            console.log('waiting for user response')
          }
        } else if (message === 'Correct') {
          // if the game has finished, display the end game message and bring in the restart game button
          this.response = `Guess was ${this.guess} and I won in ${this.guessCount} turns!!`
          if (VERBOSE) {
            console.log(`Game over after ${this.guessCount} turns, correct guess was ${this.guess}`)
          }
          this.swapButton('Restart Game?')
        }
      },
      computerGuess: function() {
        this.guess = Math.ceil((this.upperBound + this.lowerBound)/2)
        this.guessCount++
        return this.guess
      },
      updateBounds: function(message) {
        if (message === 'Try Higher') {
          this.lowerBound = this.guess
          if (VERBOSE) {
            console.log(`Lower Bound was shifted to ${this.lowerBound}`)
          }
        } else if (message === 'Try Lower') {
          this.upperBound = this.guess
          if (VERBOSE) {
            console.log(`Upper Bound was shifted to ${this.upperBound}`)
          }
        }
      }
    }
  })

  var game4 = new Vue({ // eslint-disable-line no-unused-vars
    el: '#game4-container',
    data: {
      instructions: "The game will guess your number! Think of a number between 0 and 99. The game will output it's guess and you need to tell it if it's COLD (more than 40 from the target number), COOL (within 20-39 of the target number), WARM (within 10-19 of the target number), HOT (within 9 of the target number), or correct. Don't lie though, or the game will call you out!",
      buttons: [{value: 'Start Game'}, {value: 'Restart Game?'}, {value: 'Hot'}, {value: 'Warm'}, {value: 'Cool'}, {value: 'Cold'}, {value: 'Correct'}],
      response: '',
      history: '',
      btnSeen: 'Start Game'
    }
  })
}
