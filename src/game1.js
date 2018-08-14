/* global Vue */

function main () { // eslint-disable-line no-unused-vars
  Vue.component('game-instructions', {
      props: ['instructions'],
      template: '<div><h2>Instructions</h2> {{ instructions }}</div>'
    })
    
  Vue.component('game-btn', {
    props: ['newButton', 'method'],
    template: '<input type="button" class="gameBtn" v-bind:value="newButton.value" @click="method">'
  }) // couldn't figure out how to bind v-if successfully within a template at this stage

  var game1 = new Vue({ // eslint-disable-line no-unused-vars
    el: '#game-container',
    data: {
      // messages
      instructions: 'instructions go here',
      responseOptions: [ 'try higher!',
        'try lower!',
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
        // hide undesired buttons
        this.btnSeen = 'submit'
      },
      checkInput: function () {
        this.userGuess = Number(this.userInput)
        let isValid = false
        if (!isNaN(this.userGuess)) {
          this.userGuess = Math.round(this.userGuess)
          if (0 <= this.userGuess && this.userGuess <= 99) {
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
          if (this.userGuess > this.number) {
            this.response = this.responseOptions[1]
          } else if (this.userGuess < this.number) {
            this.response = this.responseOptions[0]
          } else if (this.userGuess === this.number) {
            // this one would show 'undefined' instead of guessCount if I put it in the responseOptions array... might be worth investigating.
            this.response = `You got it in ${this.guessCount} trials!`
            this.btnSeen = 'restart'
          }
        } else {
          this.response = this.responseOptions[2]
        }
      }
    }
  })
}
