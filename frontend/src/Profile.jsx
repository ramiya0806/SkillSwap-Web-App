import { useEffect, useState } from "react"

function Profile({ email, onBack }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/user/${email}`
        )

        const data = await response.json()

        if (response.ok) {
          setUser(data.user)
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert("Server connection failed")
        console.log(error)
      }
    }

    getUser()
  }, [email])

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <h1>My Profile</h1>
          <p>View your SkillSwap profile and skills</p>
        </div>

      </div>

      {/* Profile Card */}
      <div className="profile-card">

        {/* Profile Top */}
        <div className="profile-top">

          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{user?.name}</h2>
            <p>SkillSwap Member</p>
          </div>

        </div>

        {/* Basic Information */}
        <div className="profile-section">

          <h3>Personal Information</h3>

          <div className="profile-detail">
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>

        </div>

        {/* Teach Skills */}
        <div className="profile-section">

          <h3>🎯 Skills I Can Teach</h3>

          <div className="skill-tags">
            {user?.teachSkills?.length > 0 ? (
              user.teachSkills.map((skill, index) => (
                <span key={index}>
                  {skill}
                </span>
              ))
            ) : (
              <p className="no-skills">
                No skills added yet
              </p>
            )}
          </div>

        </div>

        {/* Learn Skills */}
        <div className="profile-section">

          <h3>📚 Skills I Want to Learn</h3>

          <div className="skill-tags">
            {user?.learnSkills?.length > 0 ? (
              user.learnSkills.map((skill, index) => (
                <span key={index}>
                  {skill}
                </span>
              ))
            ) : (
              <p className="no-skills">
                No skills added yet
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  )
}

export default Profile

