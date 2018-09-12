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
      history: '',
      btnSeen: 'Start Game'
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
