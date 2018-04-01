/**
 * undoRedo for histories management
 * @example options
 * {
 *   maxLength: 50, // max length of data array
 *   onChange: function () {}
 * }
 */

function UndoRedo(options) {
  options = options || {}
  this._max = options.maxLength || 50
  this._onChange = options.onChange || function () {}
  this._data = new Array(this._max)
  this._currentIndex = 0
  this._headIndex = 0
  this._tailIndex = 0
}

UndoRedo.prototype = {
  constructor: UndoRedo,
  init: function (data) {
    this._data[0] = data
  },
  push: function (data) {
    // update index
    this._headIndex = this._currentIndex = (this._currentIndex + 1) % this._max
    if (this._headIndex === this._tailIndex) {
      this._tailIndex = (this._tailIndex + 1) % this._max
    }

    // save data
    this._data[this._headIndex] = data

    this._onChange && this._onChange.call(this)

    return data
  },
  undo: function () {
    if (this.canUndo()) {
      return this._goTo((this._max + this._currentIndex - 1) % this._max)
    } else {
      throw new Error('undo failed, reach to the last item')
    }
  },
  redo: function () {
    if (this.canRedo()) {
      return this._goTo((this._currentIndex + 1) % this._max)
    } else {
      throw new Error('redo failed, reach to the newest item')
    }
  },
  _goTo: function (index) {
    if (index < this._max) {
      this._currentIndex = index
      this._onChange && this._onChange.call(this)
      return this._data[this._currentIndex]
    } else {
      throw new Error(index + 'th item dose not exist')
    }
  },
  canUndo: function () {
    // 1. current index is not the tail index
    // 2. the data before current index is exists
    return this._currentIndex !== this._tailIndex && typeof(this._data[(this._max + this._currentIndex - 1) % this._max]) !== 'undefined'
  },
  canRedo: function () {
    // 1. current index is not the head index
    // 2. the data after current index is exists
    return this._currentIndex !== this._headIndex && typeof(this._data[(this._currentIndex + 1) % this._max]) !== 'undefined'
  },
  getList: function () {
    if (this._headIndex === this._tailIndex) {
      // just init data
      return this._data.slice(0, 1)
    } else if (this._headIndex > this._tailIndex) {
      // no reach to max, (0, head + 1)
      return this._data.slice(0, this._headIndex + 1)
    } else {
      // over max, (tail, max) + (0, head)
      return this._data.slice(this._tailIndex - this._max).concat(this._data.slice(0, this._headIndex + 1))
    }
  },
  toString: function () {
    return this._data.join(',')
  }
};