import { sigmoid } from './utils.mjs'

export class BrainType {
  constructor (options = {}) {
    this.options = options

    const {
      inputs = 1,
      hiddens = [],
      outputs = 1,
      bias = false,
      fn = sigmoid
    } = options
    this.bias = bias
    this.fn = fn
    const layers = [inputs, ...hiddens, outputs]
    this.layers = layers
    this.weights = 0
    for (let i = 0; i < layers.length - 1; i++) {
      this.weights += (bias ? layers[i] + 1 : layers[i]) * layers[i + 1]
    }
  }

  makeRandom () {
    const weights = []
    for (let i = 0; i < this.weights; i++) {
      weights.push(Math.random() * 2 - 1)
    }
    return weights
  }

  /**
   * Actually *mutates* the array lol (as in, it edits the items of the given
   * array)
   */
  radiation (weights) {
    if (weights.length !== this.weights) {
      throw new Error('Wucky: I do not associate with these aliens!')
    }
    const { mutationRange = 0.5, mutationChance = 0.1 } = this.options
    for (let i = 0; i < weights.length; i++) {
      if (Math.random() < mutationChance) {
        weights[i] += mutationRange * (Math.random() * 2 - 1)
      }
    }
    return weights
  }

  sex (a, b) {
    if (a.length !== this.weights || b.length !== this.weights) {
      throw new Error('Wucky: These are not my people!')
    }
    const { aPreference = 0.5 } = this.options
    const newWeights = []
    for (let i = 0; i < this.weights; i++) {
      if (Math.random() < aPreference) {
        newWeights.push(a[i])
      } else {
        newWeights.push(b[i])
      }
    }
    return newWeights
  }

  ponder (weights, inputs) {
    const { layers, bias, fn } = this
    if (inputs.length !== layers[0]) {
      throw new Error('Wucky: Weird number of inputs given')
    }
    let previousLayer = inputs
    let weight = 0
    for (const layerLength of this.layers.slice(1)) {
      const currentLayer = []
      for (let i = 0; i < layerLength; i++) {
        let sum = 0
        for (const val of previousLayer) {
          sum += weights[weight] * val
          weight++
        }
        if (bias) {
          sum += weights[weight]
          weight++
        }
        currentLayer.push(fn ? fn(sum) : sum)
      }
      previousLayer = currentLayer
    }
    return previousLayer
  }
}
