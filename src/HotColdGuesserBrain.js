/* global VERBOSE, GuesserBrain */

class HotColdGuesserBrain extends GuesserBrain { // eslint-disable-line no-unused-vars
  detectLies (newUpperBound, newLowerBound) {
    let liesDetected = false
    if (this.guess === this.upperBound) {
      if (newUpperBound > this.upperBound || newUpperBound < this.lowerBound) {
        liesDetected = true
      }
    } else if (this.guess === this.lowerBound) {
      if (newLowerBound < this.lowerBound || newLowerBound > this.upperBound) {
        liesDetected = true
      }
    }
    return liesDetected
  }

  updateBounds (userResponse) {
    let success = true
    let newUpperBound = this.upperBound
    let newLowerBound = this.lowerBound
    if (this.guess === this.upperBound) {
      switch (userResponse) {
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
      switch (userResponse) {
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
    this.guess = (this.guessCount % 2 === 0 ? this.lowerBound : this.upperBound)
    this.guessCount++
    console.log(`Guess #${this.guessCount}: ${this.guess}`)
    return true
  }
}
