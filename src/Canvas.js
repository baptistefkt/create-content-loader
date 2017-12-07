import React, { Component } from 'react'
import { SketchField, Tools } from 'react-sketch'
import classnames from 'classnames'

import { SVGtoFabric, JsonToSVG, CanvasAddedProp } from './utils'
import selectIcon from './assets/select.svg'
import trashtIcon from './assets/trash.svg'
import rectIcon from './assets/rect.svg'
import circleIcon from './assets/circle.svg'

class Canvas extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showCanvas: true,
    }
  }

  componentDidMount() {
    this._Events()
    this._SVGtoCanvas()
  }

  _SVGtoCanvas = () => {
    const canvas = this._sketch._fc
    const arrFabric = SVGtoFabric(this.props.draw)

    arrFabric.forEach(a => {
      let draw
      if (a.type === 'rect') {
        draw = new window.fabric.Rect(a)
      } else if (a.type === 'circle') {
        draw = new window.fabric.Circle(a)
      }

      canvas.add(draw)
    })

    canvas.renderAll()
  }

  _RenderCanvas = () => {
    if (this._sketch) {
      const draw = JsonToSVG(this._sketch._fc.toJSON())
      this.props._HandleDraw(draw)
    }
  }

  _RemoveItem = () => {
    const canvas = this._sketch._fc
    canvas.remove(canvas.getActiveObject())
  }

  _Events = () => {
    const self = this

    this._sketch._fc.on({
      'after:render': () => self._RenderCanvas(),
      'object:selected': item =>
        (item.target = CanvasAddedProp(item.target)) && self.props._HandleSeletedItem(true),
      'object:added': item => (item.target = CanvasAddedProp(item.target)),
      'object:moving': item => (item.target = CanvasAddedProp(item.target)),
      'selection:cleared': () => self.props._HandleSeletedItem(false),
    })
  }

  render() {
    const { _HandleTool, width, height, activeItem, tool, children } = this.props
    return [
      <div className="app-handlers">
        <button className={} onClick={() => _HandleTool(Tools.Select)}>
          <img src={selectIcon} alt="select tool"/>
        </button>
        <button onClick={() => _HandleTool(Tools.Rectangle)}>
          <img src={rectIcon} alt="rect tool" />
        </button>
        <button onClick={() => _HandleTool(Tools.Circle)}>
          <img src={circleIcon} alt="circle tool" />
        </button>
        {activeItem && (
          <button className="app-handler__trash" onClick={this._RemoveItem}>
            <img src={trashtIcon} alt="remove item" />
          </button>
        )}
      </div>,

      <div className="app-canvas">
        {children}
        <SketchField
          width={`${width}px`}
          height={`${height}px`}
          tool={tool}
          lineWidth={0}
          color="black"
          ref={c => (this._sketch = c)}
          className="app-canvas__sketch"
        />
      </div>,
    ]
  }
}

export default Canvas