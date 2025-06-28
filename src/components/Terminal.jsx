// src/components/Terminal.jsx
import React from 'react'

export default function Terminal({ children, title = '' }) {
  return (
    <div
      className="
        relative z-10
        bg-black text-green-400 font-mono
        rounded-xl shadow-lg
        w-[60vw] h-[60vh]
        border-4 border-green-600
      "
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Title Bar */}
      <div className="absolute top-0 left-0 w-full h-5 bg-green-900 flex items-center pl-2 space-x-1 rounded-tl-xl rounded-tr-xl">
        <span className="w-3 h-3 bg-red-600 border border-black rounded-full" />
        <span className="w-3 h-3 bg-yellow-500 border border-black rounded-full" />
        <span className="w-3 h-3 bg-green-600 border border-black rounded-full" />
        {title && (
          <span className="ml-2 text-xs font-pixel uppercase">
            {title}
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="pt-6 h-full overflow-y-auto px-4 pb-4">
        <pre className="whitespace-pre-wrap">
          {children}
        </pre>
      </div>
    </div>
  )
}
