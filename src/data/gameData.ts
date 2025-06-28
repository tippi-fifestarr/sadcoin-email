import { Email, Character } from '@/types/game'

export const emails: Email[] = [
  {
    id: "1",
    from: "officer@company.com",
    subject: "URGENT: Q4 Fundraising Strategy",
    preview: "We need to leverage synergies...",
    character: "officer",
  },
  {
    id: "2",
    from: "agent@company.com",
    subject: "Re: Special Assignment 🎯",
    preview: "The package has been delivered...",
    character: "agent",
  },
  {
    id: "3",
    from: "monkey@company.com",
    subject: "banana banana BANANA!!! 🍌",
    preview: "GM GM GM fire fire...",
    character: "monkey",
  },
  {
    id: "4",
    from: "yourself@company.com",
    subject: "Important - Don't forget to...",
    preview: "Hey, just a reminder about...",
    character: "intern",
  },
]

export const characterResponses = {
  officer: {
    name: "CORPORATE OFFICER",
    response:
      "Listen up, intern! We need to LEVERAGE this opportunity to CREATE SYNERGIES across all verticals. This is MISSION-CRITICAL for our Q4 deliverables. Let's circle back on this ASAP and ideate some solutions that will MOVE THE NEEDLE. Time to think outside the box and disrupt the paradigm!",
    miniGame: "Budget Juggling Simulator",
    emailHelp: "I'll add corporate buzzwords and action items to make this sound important.",
  },
  agent: {
    name: "FIELD AGENT",
    response:
      "The target has been... *ahem*... identified. Your mission, should you choose to accept it, involves careful handling of sensitive materials. The package contains everything you need to know. Remember: trust no one, question everything, and always have an exit strategy. The coffee machine on floor 3 is compromised.",
    miniGame: "Stealth Sniper Challenge",
    emailHelp: "I'll encode hidden meanings and add mysterious attachments to your email.",
  },
  monkey: {
    name: "BANANA MONKEY",
    response:
      "BANANA BANANA BANANA!!! 🍌🍌🍌 GM GM GM!!! Did someone say FIRE?? 🔥🔥🔥 Wait what were we talking about? OH RIGHT! Emails! I LOVE emails! They're like bananas but for your BRAIN! Want to play the banana game? It's TOTALLY not broken I promise!!! BANANA POWER ACTIVATE!!!",
    miniGame: "Banana Collection Frenzy",
    emailHelp: "I'll make your email fun and chaotic with lots of emojis and random tangents!",
  },
  intern: {
    name: "FELLOW INTERN",
    response:
      "Hey! I'm just trying to figure this out too. Maybe we can help each other? I've been here for like... 3 days and I'm still not sure what anyone actually does. But I found this cool matching game that might help us organize our thoughts! Also, you only need to complete 2 out of 3 tasks because, you know, we're learning!",
    miniGame: "File Organization Puzzle",
    emailHelp: "I'll help you write a simple, honest email that gets the job done.",
  },
} 