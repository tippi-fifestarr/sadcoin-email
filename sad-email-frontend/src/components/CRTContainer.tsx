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
        width: "100vw",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "#000",
        paddingTop: "30px",
        boxSizing: "border-box"
      }}
    >
      <div style={{
        position: "relative",
        width: "min(75vw, 700px)",
        maxWidth: "700px",
        aspectRatio: "1/1",
        height: "auto",
        maxHeight: "calc(100vh - 200px)",
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
            background: "rgba(0, 0, 0, 0.1)",
            color: "#39ff14",
            fontFamily: "monospace",
            borderRadius: "6px",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.8) inset",
            padding: "2vw 2vw 2vw 2vw",
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