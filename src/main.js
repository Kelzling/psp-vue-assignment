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
      swapButton: function (newBtn) {
        let validButtons = ['Start Game', 'Restart Game?', 'User Response Buttons']
        if (validButtons.includes(newBtn)) {
          this.btnSeen = newBtn
        } else {
          console.warn('That button is not a valid option')
        }
      },
      startGame: function () {
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
      turnHandler: function (message) {
        // add the previous guess and the users response to the history
        this.history.unshift({guess: this.guess, response: message})
        if (VERBOSE) {
          console.log(this.history)
        }
        if (message !== 'Correct') {
          // if the game is still going, update the bounds, generate and output the new guess from the computer
          if (this.updateBounds(message)) {
            this.response = this.computerGuess()
            if (VERBOSE) {
              console.log('waiting for user response')
            }
          } else {
            this.response = `You lied to me! Nothing makes sense any more! I don't want to play now.`
            this.swapButton('Restart Game?')
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
      computerGuess: function () {
        // guess the halfway point between the upper and lower bounds
        let newGuess = Math.ceil((this.upperBound + this.lowerBound) / 2)
        let oldGuesses = this.history.map(obj => obj.guess)
        if (!oldGuesses.includes(newGuess)) {
          this.guess = newGuess
          this.guessCount++
          return this.guess
        } else {
          this.swapButton('Restart Game?')
          return `You lied to me! Nothing makes sense any more! I don't want to play now.`
        }
      },
      updateBounds: function (message) {
        let success = true
        if (message === 'Try Higher') {
          // if we need to try higher, set the lowest possible to the previous guess
          let newLowerBound = this.guess
          if (!this.detectLies(message, newLowerBound)) {
            // if no lies are detected
            this.lowerBound = newLowerBound
            if (VERBOSE) {
              console.log(`Lower Bound was shifted to   ${this.lowerBound}`)
            }
          } else {
            // if lies were detected, updating the bound did not succeed, and the calling function should be informed.
            success = false
          }
        } else if (message === 'Try Lower') {
          // if we need to try lower, set the highest possible to the previous guess
          let newUpperBound = this.guess
          if (!this.detectLies(message, newUpperBound)) {
            // if no lies are detected
            this.upperBound = newUpperBound
            if (VERBOSE) {
              console.log(`Upper Bound was shifted to ${this.upperBound}`)
            }
          } else {
            // if lies were detected, updating the bound did not succeed, and the calling function should be informed.
            success = false
          }
        }
        return success
      },
      detectLies: function (message, newBound) {
        let liesDetected = false
        if (message === 'Try Higher') {
          // deal with lower bound
          if (newBound < 0 || newBound >= this.upperBound || newBound === this.lowerBound) {
            liesDetected = true
          }
        } else if (message === 'Try Lower') {
          // deal with upper bound
          if (newBound > 99 || newBound <= this.lowerBound || newBound === this.lowerBound + 1) {
            liesDetected = true
          }
        }
        return liesDetected
      }
    }
  })

  var game4 = new Vue({ // eslint-disable-line no-unused-vars
    el: '#game4-container',
    data: {
      instructions: "The game will guess your number! Think of a number between 0 and 99. The game will output it's guess and you need to tell it if it's COLD (more than 40 from the target number), COOL (within 20-39 of the target number), WARM (within 10-19 of the target number), HOT (within 9 of the target number), or correct. Don't lie though, or the game will call you out!",
      buttons: [{value: 'Start Game'}, {value: 'Restart Game?'}, {value: 'Hot'}, {value: 'Warm'}, {value: 'Cool'}, {value: 'Cold'}, {value: 'Correct'}],
      response: '',
      history: [],
      btnSeen: 'Start Game',
      guess: 0,
      upperBound: 99,
      lowerBound: 0,
      guessCount: 0
    },
    methods: {
      swapButton: function (newBtn) {
        let validButtons = ['Start Game', 'Restart Game?', 'User Response Buttons']
        if (validButtons.includes(newBtn)) {
          this.btnSeen = newBtn
        } else {
          console.warn('That button is not a valid option')
        }
      },
      startGame: function () {
        // reinitialise variables
        this.guess = 0
        this.upperBound = 99
        this.lowerBound = 0
        this.response = ''
        this.history = []
        this.guessCount = 0
        if (VERBOSE) {
          console.log(`Guess: ${this.guess}, Upper Bound: ${this.upperBound}, Lower Bound: ${this.lowerBound}, history: ${this.history}, Guess Count: ${this.guessCount}, Response: ${this.response}`)
        }
        // display user buttons and get the first guess
        this.swapButton('User Response Buttons')
        this.response = this.computerGuess()
      },
      turnHandler: function (message) {
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
      computerGuess: function () {
        if (this.guessCount % 2 === 0) { // could probably refactor this into a ternary operator for a one liner
          this.guess = this.lowerBound
        } else if (this.guessCount % 2 === 1) {
          this.guess = this.upperBound
        }
        this.guessCount++
        console.log(`Guess #${this.guessCount}: ${this.guess}`)
        return this.guess
      },
      updateBounds: function (message) {
        let newUpperBound = this.upperBound
        let newLowerBound = this.lowerBound
        if (message === 'Hot') {
          // HOT indicates the guess was within 1-9 of the target
          if (this.guess === this.upperBound) {
            // if guess was the upper bound, lower it by 1
            newUpperBound--
            // then set the lower bound to the highest of the current one or 9 below the new upper bound
            newLowerBound = Math.max(newLowerBound, (newUpperBound - 9))
          } else if (this.guess === this.lowerBound) {
            // if guess was the lower bound, raise it by 1
            newLowerBound++
            // then set the upper bound to the lowest of the current one or 9 above the new lower bound
            newUpperBound = Math.min(newUpperBound, (newLowerBound + 9))
          }
        } else if (message === 'Warm') {
          // WARM indicates the guess was in a range of 10-19 from the target
          if (this.guessCount % 2 === 1) {
            // if it is now an odd guess, we were guessing the lower bound
            // raise the lower bound by 10 and set the upper bound to the lowest of the current one or the new lower + 9
            newLowerBound += 10
            newUpperBound = Math.min(newUpperBound, (newLowerBound + 9))
          } else {
            // else it was guessing the upper bound
            // drop the upper bound by 10 and set the lower to the higher of the current one or the new upper - 9
            newUpperBound -= 10
            newLowerBound = Math.max(newLowerBound, (newUpperBound - 9))
          }
        } else if (message === 'Cool') {
          // COOL indicates the guess was in a range of 20-39 from the target
          if (this.guessCount % 2 === 1) {
            // if it is now an odd guess, we were guessing the lower bound
            // raise the lower bound by 20 and set the upper to the lowest of the current one or the new lower + 19
            newLowerBound += 20
            newUpperBound = Math.min(newUpperBound, (newLowerBound + 19))
          } else {
            // else we were guessing the upper bound
            // lower the upper bound by 20 and set the lower to the highest of the current one or the new upper - 19
            newUpperBound -= 20
            newLowerBound = Math.max(newLowerBound, (newUpperBound - 19))
          }
        } else if (message === 'Cold') {
          // COLD indicates the guess was over 40 from the target and we can't surmise anything about the opposite bound
          if (this.guessCount % 2 === 1) {
            // if it is now an odd guess, we were guessing the lower bound, so raise it by 40
            newLowerBound += 40
          } else {
            // else we were guessing the upper bound, so drop it by 40
            newUpperBound -= 40
          }
        }
        console.log(`New upper: ${newUpperBound}, New lower: ${newLowerBound}`)
        // lie detect here?
        this.upperBound = newUpperBound
        this.lowerBound = newLowerBound
      }
    }
  })
}
