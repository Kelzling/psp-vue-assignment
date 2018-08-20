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
      btnSeen: 'Start Game',
      // variables
      buttons: [{value: 'Start Game'}, {value: 'Submit Guess'}, {value: 'Restart Game?'}],
      userInput: '',
      userGuess: 0,
      guessCount: 0,
      number: 0
    },
    methods: {
      swapButton: (newBtn) {
        let validButtons = this.buttons.map(btn => btn.value)
        if (validButtons.include(newBtn) {
          btnSeen: newBtn
        } else {
          console.warn('That button is not a valid option')
        }
      },
      startGame: function () {
        // ensure all variables are reset upon game start
        this.response = ''
        this.history = ''
        this.userGuess = 0
        this.guessCount = 0
        this.number = Math.round(Math.random() * 100)
        // hide undesired buttons
        this.swapButton('Submit Guess')
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
          if (this.userGuess > this.number) {
            this.response = this.responseOptions[1]
          } else if (this.userGuess < this.number) {
            this.response = this.responseOptions[0]
          } else if (this.userGuess === this.number) {
            // this one would show 'undefined' instead of guessCount if I put it in the responseOptions array... might be worth investigating.
            this.response = `You got it in ${this.guessCount} trials!`
            this.swapButton('Restart Game?')
          }
        } else {
          this.response = this.responseOptions[2]
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
          }
          else if (this.userGuess <= this.number + 9 && this.userGuess >= this.number - 9) this.response = this.responseOptions[0];
          else if (this.userGuess <= this.number + 19 && this.userGuess >= this.number - 19) this.response = this.responseOptions[1];
          else if (this.userGuess <= this.number + 39 && this.userGuess >= this.number - 39) this.response = this.responseOptions[2];
          else this.response = this.responseOptions[3];
        } else {
          this.response = this.responseOptions[2]
        }
      }
    }
  })
}
