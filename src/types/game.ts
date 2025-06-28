export type GameState = 
  | "boot" 
  | "login" 
  | "loading-a" 
  | "loading-b" 
  | "loading-c" 
  | "email-input" 
  | "inbox" 
  | "reading" 
  | "character-select" 
  | "mini-game" 
  | "writing" 
  | "sent" 
  | "about"
  | "agent-responses"
  | "email-view"

export type Character = "officer" | "agent" | "monkey" | "intern"

export interface Email {
  id: string
  from: string
  subject: string
  preview: string
  character: Character
  content?: string
} 