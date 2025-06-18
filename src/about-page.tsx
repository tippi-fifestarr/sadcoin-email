"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AboutPageProps {
  onBack: () => void
}

type AboutSection = "overview" | "theory" | "mechanics" | "economics" | "philosophy"

export default function AboutPage({ onBack }: AboutPageProps) {
  const [activeSection, setActiveSection] = useState<AboutSection>("overview")

  const sections = {
    overview: {
      title: "THE BEAUTIFUL DECEPTION",
      content: (
        <div className="space-y-4">
          <p className="text-green-300 leading-relaxed">
            {"\"Let's Write An Email\" is a is a "}<span className="text-yellow-400 font-bold">benevolent Trojan horse</span> 
            {"- a productivity tool disguised as a procrastination game."}
          </p>

          <div className="border border-cyan-400 p-4 bg-cyan-900/10">
            <h4 className="text-cyan-400 font-bold mb-2">THE CORE PARADOX:</h4>
            <p className="text-cyan-300 text-sm">
              Players choose immediate gratification (playing a game) over delayed gratification (writing email). But
              the game secretly accomplishes the delayed gratification task. Result: Procrastination becomes
              productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border border-green-400 p-3">
              <h5 className="text-green-400 font-bold">OUTSIDE:</h5>
              <p className="text-green-300 text-sm">A silly Web3 game with intentionally buggy mini-games</p>
            </div>
            <div className="border border-green-400 p-3">
              <h5 className="text-green-400 font-bold">INSIDE:</h5>
              <p className="text-green-300 text-sm">A sophisticated commitment device that overcomes procrastination</p>
            </div>
          </div>

          <div className="text-yellow-400 text-sm mt-4 p-3 border border-yellow-400 bg-yellow-900/10">
            <strong>THE RESULT:</strong> Players thank you for tricking them into being productive.
          </div>
        </div>
      ),
    },
    theory: {
      title: "GAME THEORY ANALYSIS",
      content: (
        <div className="space-y-4">
          <div className="border border-purple-400 p-4 bg-purple-900/10">
            <h4 className="text-purple-400 font-bold mb-3">MULTI-LEVEL GAME STRUCTURE</h4>
            <div className="text-sm space-y-2 text-purple-300">
              <div>Meta-Game (Real World) ↓</div>
              <div className="ml-4">Primary Game (Email Writing) ↓</div>
              <div className="ml-8">Secondary Games (Mini-games) ↓</div>
              <div className="ml-12">Tertiary Game (Token Economy)</div>
            </div>
            <p className="text-purple-200 text-sm mt-3">
              Each level has different incentive structures that push players back to the level above.
            </p>
          </div>

          <div className="border border-red-400 p-4 bg-red-900/10">
            <h4 className="text-red-400 font-bold mb-2">{"THE PRISONER'S DILEMMA OF PRODUCTIVITY"}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="text-red-300 font-bold">Traditional Tools:</h5>
                <p className="text-red-200">• Cooperate (use tool): High effort, uncertain reward</p>
                <p className="text-red-200">• Defect (procrastinate): Low effort, immediate reward</p>
              </div>
              <div>
                <h5 className="text-green-300 font-bold">Our Game:</h5>
                <p className="text-green-200">• Play Game: Low effort, immediate reward, hidden productivity</p>
                <p className="text-green-200">• Write Direct: Still available but less appealing</p>
              </div>
            </div>
          </div>

          <div className="text-cyan-400 text-sm p-3 border border-cyan-400">
            <strong>NASH EQUILIBRIUM:</strong> The optimal strategy for players aligns perfectly with the desired
            outcome (writing emails) through misdirection rather than force.
          </div>
        </div>
      ),
    },
    mechanics: {
      title: "CHARACTER ARCHETYPES AS STRATEGY SPACES",
      content: (
        <div className="space-y-4">
          <p className="text-green-300">Each character represents a different approach to the same problem:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-blue-400 p-4 bg-blue-900/10">
              <h4 className="text-blue-400 font-bold">👮 OFFICER (Authority Strategy)</h4>
              <div className="text-sm text-blue-300 space-y-1 mt-2">
                <p>
                  <strong>Payoff:</strong> Clear requirements, structured approach
                </p>
                <p>
                  <strong>Cost:</strong> High pressure, rigid constraints
                </p>
                <p>
                  <strong>Nash Equilibrium:</strong> Follow orders exactly
                </p>
              </div>
            </div>

            <div className="border border-purple-400 p-4 bg-purple-900/10">
              <h4 className="text-purple-400 font-bold">🕵️ AGENT (Subterfuge Strategy)</h4>
              <div className="text-sm text-purple-300 space-y-1 mt-2">
                <p>
                  <strong>Payoff:</strong> Creative freedom, hidden meanings
                </p>
                <p>
                  <strong>Cost:</strong> Ambiguity, complexity
                </p>
                <p>
                  <strong>Nash Equilibrium:</strong> Read between lines
                </p>
              </div>
            </div>

            <div className="border border-yellow-400 p-4 bg-yellow-900/10">
              <h4 className="text-yellow-400 font-bold">🐵 MONKEY (Chaos Strategy)</h4>
              <div className="text-sm text-yellow-300 space-y-1 mt-2">
                <p>
                  <strong>Payoff:</strong> Maximum humor, low expectations
                </p>
                <p>
                  <strong>Cost:</strong> Incoherence, randomness
                </p>
                <p>
                  <strong>Nash Equilibrium:</strong> Embrace the chaos
                </p>
              </div>
            </div>

            <div className="border border-green-400 p-4 bg-green-900/10">
              <h4 className="text-green-400 font-bold">👨‍💼 INTERN (Learning Strategy)</h4>
              <div className="text-sm text-green-300 space-y-1 mt-2">
                <p>
                  <strong>Payoff:</strong> Easier requirements, tutorial mode
                </p>
                <p>
                  <strong>Cost:</strong> Limited options, training wheels
                </p>
                <p>
                  <strong>Nash Equilibrium:</strong> Complete 2/3 tasks
                </p>
              </div>
            </div>
          </div>

          <div className="border border-orange-400 p-4 bg-orange-900/10 mt-4">
            <h4 className="text-orange-400 font-bold mb-2">OPTIMAL FRUSTRATION POINT</h4>
            <div className="text-sm text-orange-300 space-y-1">
              <p>
                • <strong>Too Easy:</strong> Players stay in mini-games forever
              </p>
              <p>
                • <strong>Too Hard:</strong> Players rage quit
              </p>
              <p>
                • <strong>Just Right:</strong> Players return to email writing feeling productive
              </p>
            </div>
          </div>
        </div>
      ),
    },
    economics: {
      title: "DUAL TOKEN ECONOMY & BEHAVIORAL ECONOMICS",
      content: (
        <div className="space-y-4">
          <div className="border border-red-400 p-4 bg-red-900/10">
            <h4 className="text-red-400 font-bold mb-3">💰 SAD COINS (Explicit Value)</h4>
            <div className="text-sm text-red-300 space-y-2">
              <p>
                <strong>Scarcity:</strong> Limited supply creates urgency
              </p>
              <p>
                <strong>Utility:</strong> Unlock features and characters
              </p>
              <p>
                <strong>Psychology:</strong> Loss aversion (watching value decrease during mini-games)
              </p>
            </div>
          </div>

          <div className="border border-pink-400 p-4 bg-pink-900/10">
            <h4 className="text-pink-400 font-bold mb-3">💖 FEELS (Implicit Value)</h4>
            <div className="text-sm text-pink-300 space-y-2">
              <p>
                <strong>Generation:</strong> Through gameplay and task completion
              </p>
              <p>
                <strong>Utility:</strong> Emotional validation and progress tracking
              </p>
              <p>
                <strong>Psychology:</strong> Intrinsic motivation and positive reinforcement
              </p>
            </div>
          </div>

          <div className="border border-cyan-400 p-4 bg-cyan-900/10">
            <h4 className="text-cyan-400 font-bold mb-3">🎯 THE STAKING MECHANISM</h4>
            <div className="text-center text-cyan-300 text-sm mb-3">
              Stake SAD → Watch value decrease → Generate FEELS
            </div>
            <p className="text-cyan-200 text-sm">
              This creates a <strong>negative sum game that's actually positive sum</strong>: Players "lose" financially
              but gain emotionally. The system captures the psychological cost of financial decisions.
            </p>
          </div>

          <div className="border border-yellow-400 p-4 bg-yellow-900/10">
            <h4 className="text-yellow-400 font-bold mb-3">🧠 COGNITIVE BIASES AT PLAY</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <h5 className="text-yellow-300 font-bold">Present Bias:</h5>
                <p className="text-yellow-200">Immediate game rewards vs delayed email completion</p>
              </div>
              <div>
                <h5 className="text-yellow-300 font-bold">Effort Justification:</h5>
                <p className="text-yellow-200">Time invested in mini-games increases email value</p>
              </div>
              <div>
                <h5 className="text-yellow-300 font-bold">Sunk Cost Fallacy:</h5>
                <p className="text-yellow-200">"I've come this far, might as well finish"</p>
              </div>
              <div>
                <h5 className="text-yellow-300 font-bold">Contrast Effect:</h5>
                <p className="text-yellow-200">Buggy games make email writing seem appealing</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    philosophy: {
      title: "INFORMATION ASYMMETRY & THE META-REVEAL",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-green-400 p-4 bg-green-900/10">
              <h4 className="text-green-400 font-bold mb-3">✅ WHAT PLAYERS KNOW</h4>
              <div className="text-sm text-green-300 space-y-1">
                <p>• They're playing a game</p>
                <p>• They need to write an email</p>
                <p>• Mini-games give rewards</p>
                <p>• It's intentionally silly</p>
              </div>
            </div>

            <div className="border border-red-400 p-4 bg-red-900/10">
              <h4 className="text-red-400 font-bold mb-3">❌ WHAT PLAYERS DON'T KNOW</h4>
              <div className="text-sm text-red-300 space-y-1">
                <p>• AI is analyzing their procrastination patterns</p>
                <p>• Each choice affects email generation</p>
                <p>• They're being productive while procrastinating</p>
                <p>• The frustration is intentional and therapeutic</p>
              </div>
            </div>
          </div>

          <div className="border border-purple-400 p-4 bg-purple-900/10">
            <h4 className="text-purple-400 font-bold mb-3">🎭 THE REVEAL MOMENT</h4>
            <p className="text-purple-300 text-sm leading-relaxed">
              The "aha moment" when players realize they've been tricked into productivity creates a positive
              association with the task. This is the core innovation:{" "}
              <strong>alignment through misdirection rather than force</strong>.
            </p>
          </div>

          <div className="border border-cyan-400 p-4 bg-cyan-900/10">
            <h4 className="text-cyan-400 font-bold mb-3">🌍 APPLICATIONS BEYOND EMAIL</h4>
            <div className="text-sm text-cyan-300 space-y-2">
              <p>
                <strong>Tax Preparation:</strong> "Let's File a Return"
              </p>
              <p>
                <strong>Exercise:</strong> "Let's Take a Walk"
              </p>
              <p>
                <strong>Learning:</strong> "Let's Read a Chapter"
              </p>
              <p>
                <strong>Networking:</strong> "Let's Send a LinkedIn Message"
              </p>
            </div>
            <p className="text-cyan-200 text-sm mt-3">
              The key is maintaining the balance between frustration and engagement while secretly accomplishing the
              avoided task.
            </p>
          </div>

          <div className="border border-yellow-400 p-4 bg-yellow-900/10">
            <h4 className="text-yellow-400 font-bold mb-3">🏆 THE MECHANISM IS INCENTIVE COMPATIBLE</h4>
            <div className="text-sm text-yellow-300 space-y-1">
              <p>
                1. <strong>Individual Rationality:</strong> Players participate voluntarily
              </p>
              <p>
                2. <strong>Incentive Compatibility:</strong> Players' best strategy aligns with desired outcome
              </p>
              <p>
                3. <strong>Efficiency:</strong> Emails get written with less psychological resistance
              </p>
            </div>
          </div>

          <div className="text-center mt-6 p-4 border-2 border-green-400 bg-green-900/20">
            <p className="text-green-300 font-bold text-lg">
              "The true innovation isn't the blockchain integration or the mini-games—
            </p>
            <p className="text-green-400 font-bold text-xl mt-2">
              it's the recognition that sometimes the best way to achieve a goal is to pretend you're doing something
              else entirely."
            </p>
          </div>
        </div>
      ),
    },
  }

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="border-green-400 text-green-400 hover:bg-green-900/20"
        >
          ← Back to Game
        </Button>
        <h2 className="text-xl font-bold text-center flex-1">📚 ABOUT: THE SCIENCE OF PRODUCTIVE PROCRASTINATION</h2>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(sections).map(([key, section]) => (
          <Button
            key={key}
            variant={activeSection === key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection(key as AboutSection)}
            className={
              activeSection === key
                ? "bg-green-600 text-black"
                : "border-green-400 text-green-400 hover:bg-green-900/20"
            }
          >
            {section.title}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="border-2 border-green-400 p-6 min-h-[400px]">
        <h3 className="text-2xl font-bold mb-6 text-green-400">{sections[activeSection].title}</h3>
        {sections[activeSection].content}
      </div>

      {/* Footer */}
      <div className="text-center text-green-600 text-sm p-4 border border-green-600">
        <p>Built at the intersection of game theory, behavioral economics, and Web3 innovation</p>
        <p className="mt-1">A commitment device that makes procrastination productive</p>
      </div>
    </div>
  )
}
