/* global VERBOSE, Brain */

class GuesserBrain extends Brain { // eslint-disable-line no-unused-vars
  constructor () {
    super()
    this.guess = 0
    this.upperBound = 99
    this.lowerBound = 0
    this.lieResponse = "You lied to me! Nothing makes sense! I don't want to play any more. :("
    this.instructions = "The game will guess your number! Think of a number between 0 and 99. The game will output it's guess and you need to tell it if it's too high, too low, or correct. Don't lie though, or the game will call you out!"
    this.buttons = ['Start Game', 'Restart Game?', 'Higher', 'Correct', 'Lower']
  }

  get winResponse () {
    return `Your number was ${this.guess} and I won in ${this.guessCount} turns!`
  }

  get formattedHistory () {
    let output = []
    let count = 1
    if (this.guessHistory) {
      for (let item of this.guessHistory) {
        if (count > 10) {
          break
        }
        output.push(`My guess was ${item.guess} and you responded ${item.response}`)
        count++
      }
    }
    return output
  }

  get oldGuesses () {
    return this.guessHistory.map(obj => obj.guess)
  }

  startGame () {
    super.startGame()
    this.guess = 0
    this.upperBound = 99
    this.lowerBound = 0
    if (VERBOSE) {
      console.log(`Guess: ${this.guess}, Upper Bound: ${this.upperBound}, Lower Bound: ${this.lowerBound}`)
    }
    this.computerGuess()
    return this.guess
  }

  detectLies (userResponse, newBound) {
    let liesDetected = false
    if (userResponse === 'Try Higher') {
      if (newBound < 0 || newBound >= this.upperBound || newBound === this.lowerBound) {
        liesDetected = true
      }
    } else if (userResponse === 'Try Lower') {
      // deal with upper bound
      if (newBound > 99 || newBound <= this.lowerBound || newBound === this.lowerBound + 1) {
        liesDetected = true
      }
    }
    if (VERBOSE && liesDetected) {
      console.log(`Detected Lies while updating bounds`)
    }
    return liesDetected
  }

  updateBounds (userResponse) {
    let success = true
    if (userResponse === 'Try Higher') {
      let newLowerBound = this.guess
      if (!this.detectLies(userResponse, newLowerBound)) {
        this.lowerBound = newLowerBound
        if (VERBOSE) {
          console.log(`Lower Bound was shifted to ${this.lowerBound}`)
        }
      } else {
        success = false
      }
    } else if (userResponse === 'Try Lower') {
      let newUpperBound = this.guess
      if (!this.detectLies(userResponse, newUpperBound)) {
        this.upperBound = newUpperBound
        if (VERBOSE) {
          console.log(`Upper Bound was shifted to ${this.upperBound}`)
        }
      } else {
        success = false
      }
    }
    return success
  }

  computerGuess () {
    let success = true
    let newGuess = Math.ceil((this.upperBound + this.lowerBound) / 2)
    if (!this.oldGuesses.includes(newGuess)) {
      this.guess = newGuess
      this.guessCount++
    } else {
      success = false
      if (VERBOSE) {
        console.log('Detected lies while generating new guess')
      }
    }
    return success
  }

  turnHandler (userResponse) {
    this.guessHistory.unshift({guess: this.guess, response: userResponse})
    let computerResponse = ''
    if (userResponse === 'Correct') {
      // if the guess was correct, update the game state and return the victory response
      this.gameState = 'finished'
      computerResponse = this.winResponse
    } else {
      if (this.updateBounds(userResponse) && this.computerGuess()) {
        computerResponse = this.guess
      } else {
        this.gameState = 'finished'
        computerResponse = this.lieResponse
      }
    }
    return {response: computerResponse, gameState: this.gameState}
  }
}
