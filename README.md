# undoRedo
undoRedo is a javascript library for histories management.

# Usage

```javascript
const udrd = new UndoRedo({
  maxLength: 5,
  onChange: function () {
    console.log('changed')
  }
})

udrd.init('aaa') // aaa
udrd.push('bbb') // aaa, bbb

udrd.canUndo() // true
udrd.canRedo() // false

udrd.undo() // aaa
udrd.canUndo() // false
udrd.canRedo() // true

udrd.redo() // bbb

```