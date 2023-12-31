import {TextWindow} from './TextWindow.js'
export {CanvasEditor}
/*
The Canvas Editor takes a canvas DOM object, mset,
and a TextWindow object representing the state of the document.
It responds to canvas events by calling methods on the TextWindow
object to update its state, and it redraws the screen using data
from the TextWindow object.

When the TextWindow object is updated remotely, it will also redraw
the screen. This is done by passing the redraw method into the TextWindow
object.
*/
class CanvasEditor{

  constructor(mset,textWindow){
    this.msetCanvas = mset
    this.state = textWindow

    this.fontColor = "black"
    this.fonttype = "32pt Courier"
    this.fontNumericSize = "32"

    this.allLetters = "!@#{$%^&*()_+-={}|[]\\:\";'<>?,./~`}abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"
    this.letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"

    this.msetCanvas.style["font-size"]="40"

    this.ctx = null;
    this.charWidth = 100;
    this.lineSep = 10
    this.lineHeight=20
    this.lineDescent = 2


    let msetCE = this

    this.fontSize = this.getFontSize()



    this.msetCanvas.width = window.innerWidth*0.9;
    this.msetCanvas.height = window.innerHeight*0.9;
    let numRows = Math.floor(this.msetCanvas.height/this.lineHeight);
    let numCols = Math.floor(this.msetCanvas.width/(this.charWidth))

    this.state.setRowsCols(numRows,numCols);

    // this.state =
    //    {text:[""],
    //     cursor:[0,0],
    //     rowOffset:0,
    //     colOffset:0,
    //     rows:numRows,cols:numCols}

    let theState = this.state


    // here is how we can get the key which is pressed
    this.msetCanvas.addEventListener('keydown', function(event) {
        msetCE.getFontSize()
        msetCE.addKeyPress(event);
        msetCE.redrawmsetCanvas();
            });

    // here is how we can get the position of the mouseclick
    this.msetCanvas.addEventListener('mousedown', function(event){
        msetCE.getFontSize()
        let row = Math.floor(event.offsetY/msetCE.lineHeight)
                             //+ msetCE.state.rowOffset
        let col = Math.round(event.offsetX/(msetCE.charWidth)) +
                             msetCE.state.colOffset
        //console.log(`mousedown row=${row} col=${col} cursorPos=${msetCE.state.cursorPos}`)
        // the row corresponds to the row in this.state.lines
        const pos = msetCE.state.getPosFAST(row,col)
        msetCE.state.cursorPos = pos
        //console.log(`new cursorPos is ${pos}`)

        msetCE.redrawmsetCanvas()
    });

    // When the window is resized it changes the size of the canvas to fit the window
    // This can be expensive as it needs to read it new lines if it is expanded
    // Also when the user changes the font-size this is a kind of resizing!
    // We can test the font size before every operation!
    window.addEventListener('resize', function(event){
      msetCE.msetCanvas.width = window.innerWidth*0.9
      msetCE.msetCanvas.height = window.innerHeight*0.9
      msetCE.getFontSize()
      msetCE.state.recenterView()
      msetCE.redrawmsetCanvas()

    });

    const redrawCanvas = this.redrawmsetCanvas.bind(this)
    this.state.setRedrawCanvas(redrawCanvas)

  }

  getFontSize(){

      this.ctx = this.msetCanvas.getContext('2d')
      this.charWidth = this.ctx.measureTextWidth(this.letters).width/this.letters.length
      this.fontName = this.fontNumericSize+"px courier"
      this.ctx.font = this.fontName
      this.msetCanvas.style["font-size"]=this.fontNumericSize
      this.ctx.fillStyle='black'
      this.fontSize = this.ctx.measureText(this.letters)
      this.lineSep = Math.round(this.fontSize.height*0.5) // additional distance between lines ...
      this.lineHeight = this.fontSize.height+this.lineSep //
      this.lineDescent = this.fontSize.descent
      let numRows = Math.floor(this.msetCanvas.height/this.lineHeight);
      let numCols = Math.floor(this.msetCanvas.width/(this.charWidth))
      this.state.setRowsCols(numRows,numCols)

      return this.ctx.measureText(this.letters);
  }


    clearmsetCanvas(){
      const ctx = this.msetCanvas.getContext('2d')
      ctx.fillStyle='white'
      ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
    }




    addKeyPress(event){
      const key = event.key
      let state = this.state
      if (event.ctrlKey){
        return
      } else if (key=='ArrowLeft'){
        this.state.moveCursorLeft()
        return
      } else if (key=='ArrowRight'){
        this.state.moveCursorRight()
        return
      } else if (key=='ArrowUp'){
        this.state.moveCursorUp()
        return
      } else if (key=='ArrowDown'){
        this.state.moveCursorDown()
        return
      } else if (key=='Backspace'){
        this.state.removeCharBeforeCursorPos()
        return
      } else if (key=='Enter'){
        this.state.insertCharAtCursorPos('\n')
        return
      } else if (this.allLetters.indexOf(key)<0) {
        // don't handle anything but printable characters, backspace, arrows, and enter
        //const [row, col] = this.state.getVisRowColFAST(this.state.cursorPos)
        //console.log('cursorPos: ' + this.state.cursorPos + ' viewStart: ' + this.state.viewStart + ' viewEnd: ' + this.state.viewEnd + ' colOffset: ' + this.state.colOffset + ' col: ' + col)
        return
      } else {
        this.state.insertCharAtCursorPos(key)

      }
    }


    //=============


    redrawmsetCanvas(){
      /*
        This method simply draws theState.lines on the screen skipping over
        the first colOffset columns. We assume that this.state.lines is an
        accurate representation of our viewing window...
        When cursor movement drop above or below the view window, we will
        update this.state.lines accordingly
      */
      //console.log("\n****\nredrawmsetCanvas")
      //this.state.updateLinesAroundCursorPosSLOW()
      //this.lines = this.state.reloadLinesFAST()
      //console.log("ready to draw")
      this.getFontSize()
      this.clearmsetCanvas()
      let theState = this.state
      const ctx = this.msetCanvas.getContext('2d')
      ctx.fillStyle='black'
      //console.log("getColOffset")
      let colOffset = this.state.colOffset
      //console.log('before loop ')
      //console.log(`len = ${this.state.lines.length}`)

      for (let i =0; i<this.state.lines.length; i++){
        //console.log("in loop over i")
        //console.log(`IN printmsetcanvas: i=${i} len = ${this.state.lines.length}`)
        //console.log(`lines[i]=${this.state.lines[i]}`)
        let line =this.state.lines[i].substring(colOffset,colOffset+this.state.cols+5)
        //console.log(`fullline = ${this.state.lines[i]} colOffset = ${colOffset} numCols=${this.state.cols}`)
        //console.log(`line= ${line}`)
        //const text = ctx.measureText(line)
        const start = 0
        const baseline = (1+i)*this.lineHeight+this.lineDescent
        //console.log(`fillText(${JSON.stringify(line,null,2)},${start},${baseline})`)
        ctx.fillText(line,start,baseline)
      }
      //console.log("done drawing")

      this.drawCursor()
    }

    printState(){
      //console.log(JSON.stringify(this.state))
    }


    drawCursor(){

      const [row,col] = this.state.getVisRowColFAST(this.state.cursorPos)
      //console.log(`in drawCursor, row=${row} col=${col}`)
      const visibleRow = row
      const visibleCol = col-this.state.colOffset

      const start = visibleCol*this.charWidth
      const baseline = visibleRow*this.lineHeight+this.lineSep+this.lineDescent
      const topline = this.lineHeight-this.lineSep+this.lineDescent+1

      const ctx = this.msetCanvas.getContext('2d')
      ctx.fillStyle='black'
      ctx.fillRect(start-1,baseline, 3,topline)
    }



}

/*
const ddllSpec= {namespace:"/demo2", documentId:"default"}
const tw = new TextWindow(ddllSpec)

const ed1 = new CanvasEditor(mset,tw)
*/
