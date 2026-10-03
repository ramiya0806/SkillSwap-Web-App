
import { useEffect, useState } from "react"

function Dashboard({
  email,
  onMySkills,
  onFindPartners,
  onMyRequests,
  onProfile,
  onMessages,
  onLogout
}) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const getUnreadCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/chat/unread/${email}`
        )

        const data = await response.json()

        if (response.ok) {
          setUnreadCount(data.unreadCount)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (email) {
      getUnreadCount()

      const interval = setInterval(getUnreadCount, 2000)

      return () => clearInterval(interval)
    }
  }, [email])

  return (
    <div className="dashboard">

      {/* Messages */}
      <div className="messages-icon" onClick={onMessages}>
        💬

        {unreadCount > 0 && (
          <span className="message-badge">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <h1>SkillSwap</h1>

        <p className="dashboard-tagline">
          Learn. Share. Connect.
        </p>
      </div>

      {/* Welcome */}
      <div className="dashboard-welcome">
        <h2>Welcome to SkillSwap 👋</h2>

        <p>
          Learn new skills, share your knowledge,
          <br />
          and connect with skill partners.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-buttons">

        <button onClick={onMySkills}>
          <span>🎯</span>
          <div>
            <strong>My Skills</strong>
            <small>Manage your skills</small>
          </div>
        </button>

        <button onClick={onFindPartners}>
          <span>🤝</span>
          <div>
            <strong>Find Partners</strong>
            <small>Discover skill partners</small>
          </div>
        </button>

        <button onClick={onMyRequests}>
          <span>📩</span>
          <div>
            <strong>My Requests</strong>
            <small>View your swap requests</small>
          </div>
        </button>

        <button onClick={onProfile}>
          <span>👤</span>
          <div>
            <strong>Profile</strong>
            <small>View your profile</small>
          </div>
        </button>

      </div>

      {/* Logout */}
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>

    </div>
  )
}

export default Dashboard

