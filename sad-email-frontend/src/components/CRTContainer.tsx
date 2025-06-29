import React from "react"

interface CRTContainerProps {
  children: React.ReactNode
}

// These values are estimated for the screen area of the CRT image
const SCREEN_TOP = "10%"
const SCREEN_LEFT = "8%"
const SCREEN_WIDTH = "84%"
const SCREEN_HEIGHT = "68%"

export default function CRTContainer({ children }: CRTContainerProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      <div style={{
        position: "relative",
        width: "80vw",
        maxWidth: "900px",
        aspectRatio: "1/1",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <img
          src="/img/ctr-monitor.png"
          alt="CRT Monitor"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: SCREEN_TOP,
            left: SCREEN_LEFT,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            overflow: "auto",
            background: "rgba(0, 0, 0, 0)",
            color: "#39ff14",
            fontFamily: "monospace",
            borderRadius: "8px",
            boxShadow: "0 0 24px #000 inset",
            padding: "4vw 4vw 4vw 4vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
} 