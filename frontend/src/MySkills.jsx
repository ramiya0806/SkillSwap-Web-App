
import { useState } from "react"

function MySkills({ email, onBack }) {
  const [teachSkill, setTeachSkill] = useState("")
  const [learnSkill, setLearnSkill] = useState("")

  const addSkills = async () => {
    if (
      teachSkill.trim() === "" &&
      learnSkill.trim() === ""
    ) {
      alert("Please enter at least one skill")
      return
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/skills/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            teachSkill,
            learnSkill
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        alert("Skills added successfully!")
        setTeachSkill("")
        setLearnSkill("")
        console.log(data)
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Server connection failed")
      console.log(error)
    }
  }

  return (
    <div className="skills-page">

      {/* Header */}
      <div className="skills-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <h1>My Skills</h1>
          <p>Share what you know and what you want to learn</p>
        </div>

      </div>

      {/* Skills Card */}
      <div className="skills-card">

        {/* Teach */}
        <div className="skill-section">

          <div className="skill-icon teach-icon">
            🎯
          </div>

          <div className="skill-content">

            <h2>Skills I Can Teach</h2>

            <p>
              Add skills that you are comfortable sharing
              with others.
            </p>

            <input
              type="text"
              placeholder="Example: UI/UX Design"
              value={teachSkill}
              onChange={(e) => setTeachSkill(e.target.value)}
            />

          </div>

        </div>

        {/* Learn */}
        <div className="skill-section">

          <div className="skill-icon learn-icon">
            📚
          </div>

          <div className="skill-content">

            <h2>Skills I Want to Learn</h2>

            <p>
              Add skills you would like to learn from
              another person.
            </p>

            <input
              type="text"
              placeholder="Example: Python"
              value={learnSkill}
              onChange={(e) => setLearnSkill(e.target.value)}
            />

          </div>

        </div>

        {/* Save */}
        <button
          className="save-skills-button"
          onClick={addSkills}
        >
          Save Skills
        </button>

      </div>

    </div>
  )
}

export default MySkills

