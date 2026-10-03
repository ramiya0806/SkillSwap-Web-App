
import { useEffect, useState } from "react"

const sendSwapRequest = async (
  senderEmail,
  receiverEmail,
  skillOffered,
  skillWanted
) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/swap/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          senderEmail,
          receiverEmail,
          skillOffered,
          skillWanted
        })
      }
    )

    const data = await response.json()

    if (response.ok) {
      alert("Swap request sent successfully!")
      console.log(data)
    } else {
      alert(data.message)
    }
  } catch (error) {
    alert("Server connection failed")
    console.log(error)
  }
}

function FindPartners({ email, onBack }) {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    const getMatches = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/match/${email}`
        )

        const data = await response.json()

        if (response.ok) {
          setMatches(data.matches)
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert("Server connection failed")
        console.log(error)
      }
    }

    getMatches()
  }, [email])

  return (
    <div className="partners-page">

      {/* Header */}
      <div className="partners-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <h1>Find Skill Partners</h1>
          <p>
            Discover people who can teach what you want to learn
          </p>
        </div>

      </div>

      {/* Partners */}
      <div className="partners-list">

        {matches.length === 0 ? (
          <div className="empty-partners">

            <div className="empty-partner-icon">
              🤝
            </div>

            <h3>No matching partners found</h3>

            <p>
              Add more skills to your profile to find
              suitable skill partners.
            </p>

          </div>
        ) : (
          matches.map((user) => (

            <div
              className="partner-profile-card"
              key={user.id}
            >

              {/* Partner Header */}
              <div className="partner-profile-header">

                <div className="partner-profile-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2>{user.name}</h2>
                  <span>Skill Partner</span>
                </div>

              </div>

              {/* Skills */}
              <div className="partner-skills">

                <div className="partner-skill-box teach-box">

                  <div className="skill-box-title">
                    🎯
                    <strong>Can Teach</strong>
                  </div>

                  <p>
                    {user.teachSkills.join(", ")}
                  </p>

                </div>

                <div className="partner-skill-box learn-box">

                  <div className="skill-box-title">
                    📚
                    <strong>Wants to Learn</strong>
                  </div>

                  <p>
                    {user.learnSkills.join(", ")}
                  </p>

                </div>

              </div>

              {/* Request Button */}
              <button
                className="send-request-button"
                onClick={() =>
                  sendSwapRequest(
                    email,
                    user.email,
                    user.teachSkills[0],
                    user.learnSkills[0]
                  )
                }
              >
                Send Swap Request
              </button>

            </div>

          ))
        )}

      </div>

    </div>
  )
}

export default FindPartners
