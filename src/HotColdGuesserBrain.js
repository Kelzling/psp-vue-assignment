/* global VERBOSE, GuesserBrain */

class HotColdGuesserBrain extends GuesserBrain { // eslint-disable-line no-unused-vars
  constructor () {
    super()
    this.instructions = "The game will guess your number! Think of a number between 0 and 99. The game will output it's guess and you need to tell it if it's COLD (more than 40 from the target number), COOL (within 20-39 of the target number), WARM (within 10-19 of the target number), HOT (within 9 of the target number), or correct. Don't lie though, or the game will call you out!"
    this.buttons = ['Start Game', 'Restart Game?', 'Hot', 'Warm', 'Cool', 'Cold', 'Correct']
  }

  detectLies (newUpperBound, newLowerBound) {
    let liesDetected = false
    if (this.guess === this.upperBound) {
      // dealing with the upper bound
      if (newUpperBound > this.upperBound || newUpperBound < this.lowerBound) {
        // if it would go higher than the current upper bound or lower than the current lower bound, this contradicts previous information, thus the user must have lied
        liesDetected = true
      }
    } else if (this.guess === this.lowerBound) {
      // dealing with the lower bound
      if (newLowerBound < this.lowerBound || newLowerBound > this.upperBound) {
        // if it would go lower than the current lower bound or higher than the current upper bound, this contradicts previous information, thus the user must have lied.
        liesDetected = true
      }
    }
    return liesDetected
  }

  updateBounds (userResponse) {
    let success = true
    // declare temporary variables for updating the bounds
    let newUpperBound = this.upperBound
    let newLowerBound = this.lowerBound
    if (this.guess === this.upperBound) {
      // dealing with the upper bound
      switch (userResponse) {
        // adjust the new bounds based upon the user response - lower bound to the higher of either the current bound or the opposite edge of the range implied by the user response
        case 'Hot':
          newUpperBound--
          newLowerBound = Math.max(newLowerBound, newUpperBound - 9)
          break
        case 'Warm':
          newUpperBound -= 10
          newLowerBound = Math.max(newLowerBound, newUpperBound - 9)
          break
        case 'Cool':
          newUpperBound -= 20
          newLowerBound = Math.max(newLowerBound, newUpperBound - 19)
          break
        case 'Cold':
          newUpperBound -= 40
          break
      }
    } else if (this.guess === this.lowerBound) {
      // dealing with the lower bound
      switch (userResponse) {
        // adjust the new bounds based upon the user response - upper bound to the lower of either the current bound or the opposite edge of the range implied by the user response
        case 'Hot':
          newLowerBound++
          newUpperBound = Math.min(newUpperBound, newLowerBound + 9)
          break
        case 'Warm':
          newLowerBound += 10
          newUpperBound = Math.min(newUpperBound, newLowerBound + 9)
          break
        case 'Cool':
          newLowerBound += 20
          newUpperBound = Math.min(newUpperBound, newLowerBound + 19)
          break
        case 'Cold':
          newLowerBound += 40
          break
      }
    }
    if (!this.detectLies(newUpperBound, newLowerBound)) {
      // as long as these new bounds don't contradict previous information, we can move on with updating the bounds
      this.upperBound = newUpperBound
      this.lowerBound = newLowerBound
      if (VERBOSE) {
        console.log(`New upper: ${newUpperBound}, New lower: ${newLowerBound}`)
      }
    } else {
      success = false
    }
    return success
  }

  computerGuess () {
    // alternate the guess between the upper and lower bounds to reduce the ambiguity from only knowing it's within a certain range of the number
    this.guess = (this.guessCount % 2 === 0 ? this.lowerBound : this.upperBound)
    this.guessCount++
    console.log(`Guess #${this.guessCount}: ${this.guess}`)
    // return true in order to maintain a consistent internal interface with the super class
    return true
  }
}
