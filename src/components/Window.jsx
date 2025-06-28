// src/components/Window.jsx
import React from 'react'
import Draggable from 'react-draggable'

export default function Window({
  title,
  defaultPosition = { x: 100, y: 100 },
  onClose,
  children,
}) {
  return (
    <Draggable handle=".title-bar" defaultPosition={defaultPosition}>
      <div
        className="absolute bg-black border-2 border-green-600 text-green-400 font-mono"
        style={{ width: 320 }}
      >
        {/* Title bar */}
        <div className="title-bar flex justify-between items-center bg-green-800 px-2 py-1 cursor-move">
          <span className="font-bold text-sm uppercase">{title}</span>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-400 text-xl leading-none"
          >
            ×
          </button>
        </div>
        {/* Content */}
        <div className="p-3">{children}</div>
      </div>
    </Draggable>
  )
}
