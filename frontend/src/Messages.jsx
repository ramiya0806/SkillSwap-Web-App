
import { useEffect, useState } from "react"

function Messages({ email, onBack, onChat }) {
  const [partners, setPartners] = useState([])
  const [typingPartners, setTypingPartners] = useState({})
  const [unreadCounts, setUnreadCounts] = useState({})
  const [lastMessages, setLastMessages] = useState({})
  const [onlineStatus, setOnlineStatus] = useState({})

  // GET ACCEPTED PARTNERS
  useEffect(() => {
    const getPartners = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/swap/my-requests/${email}`
        )

        const data = await response.json()

        if (response.ok) {
          const acceptedRequests = data.requests.filter(
            (request) => request.status === "accepted"
          )

          const partnerMap = new Map()

          acceptedRequests.forEach((request) => {
            const partner =
              request.sender.email === email
                ? request.receiver
                : request.sender

            if (!partnerMap.has(partner.email)) {
              partnerMap.set(partner.email, {
                ...partner,
                learnSkill: request.skillWanted
              })
            }
          })

          setPartners(Array.from(partnerMap.values()))
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (email) {
      getPartners()
    }
  }, [email])

  // CHECK TYPING STATUS
  useEffect(() => {
    if (!email || partners.length === 0) {
      return
    }

    const checkTyping = async () => {
      const typingData = {}

      for (const partner of partners) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/chat/typing/${partner.email}/${email}`
          )

          const data = await response.json()

          if (response.ok && data.isTyping) {
            typingData[partner.email] = true
          }
        } catch (error) {
          console.log(error)
        }
      }

      setTypingPartners(typingData)
    }

    checkTyping()

    const interval = setInterval(checkTyping, 2000)

    return () => clearInterval(interval)
  }, [email, partners])

  // GET UNREAD MESSAGE COUNTS
  useEffect(() => {
    if (!email || partners.length === 0) {
      return
    }

    const getUnreadCounts = async () => {
      const counts = {}

      for (const partner of partners) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/chat/unread/${email}/${partner.email}`
          )

          const data = await response.json()

          if (response.ok) {
            counts[partner.email] = data.unreadCount
          }
        } catch (error) {
          console.log(error)
        }
      }

      setUnreadCounts(counts)
    }

    getUnreadCounts()

    const interval = setInterval(getUnreadCounts, 2000)

    return () => clearInterval(interval)
  }, [email, partners])

  // CHECK ONLINE STATUS
  useEffect(() => {
    if (!email || partners.length === 0) {
      return
    }

    const checkOnlineStatus = async () => {
      const statusData = {}

      for (const partner of partners) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/chat/online/${partner.email}`
          )

          const data = await response.json()

          if (response.ok) {
            statusData[partner.email] = data.isOnline
          }
        } catch (error) {
          console.log(error)
        }
      }

      setOnlineStatus(statusData)
    }

    checkOnlineStatus()

    const interval = setInterval(checkOnlineStatus, 3000)

    return () => clearInterval(interval)
  }, [email, partners])

  // GET LAST MESSAGE
  useEffect(() => {
    if (!email || partners.length === 0) {
      return
    }

    const getLastMessages = async () => {
      const messages = {}

      for (const partner of partners) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/chat/${email}/${partner.email}`
          )

          const data = await response.json()

          if (response.ok && data.messages.length > 0) {
            const lastMessage =
              data.messages[data.messages.length - 1]

            messages[partner.email] = {
              message: lastMessage.message || lastMessage.text || "",
              time: lastMessage.createdAt
            }
          }
        } catch (error) {
          console.log(error)
        }
      }

      setLastMessages(messages)
    }

    getLastMessages()

    const interval = setInterval(getLastMessages, 2000)

    return () => clearInterval(interval)
  }, [email, partners])

  return (
    <div className="messages-page">

      {/* Header */}
      <div className="messages-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <h1>Messages</h1>
          <p>Your skill connections</p>
        </div>

      </div>

      {/* Partner List */}
      <div className="messages-list">

        {partners.length === 0 ? (
          <div className="empty-messages">
            <div className="empty-icon">💬</div>

            <h3>No messages yet</h3>

            <p>
              Start a conversation with your accepted
              skill partners.
            </p>
          </div>
        ) : (
          partners.map((partner) => (

            <div
              className="message-partner-card"
              key={partner.email}
              onClick={() => onChat(partner.email)}
            >

              {/* Avatar */}
              <div className="partner-avatar">
                {partner.name?.charAt(0).toUpperCase()}
              </div>

              {/* Partner information */}
              <div className="partner-message-info">

                <div className="partner-name-row">
                  <h3>{partner.name}</h3>

                  <span
                    className={
                      onlineStatus[partner.email]
                        ? "online-status"
                        : "offline-status"
                    }
                  >
                    {onlineStatus[partner.email]
                      ? "● Online"
                      : "● Offline"}
                  </span>
                </div>

                <p
                  className={
                    unreadCounts[partner.email] > 0
                      ? "unread-message-text"
                      : ""
                  }
                >
                  {typingPartners[partner.email]
                    ? "typing..."
                    : unreadCounts[partner.email] > 0
                      ? `${unreadCounts[partner.email]} new messages`
                      : lastMessages[partner.email]
                        ? `${lastMessages[partner.email].message} • ${new Date(
                            lastMessages[partner.email].time
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}`
                        : partner.learnSkill}
                </p>

              </div>

              {/* Arrow */}
              <span className="chat-arrow">
                →
              </span>

            </div>

          ))
        )}

      </div>

    </div>
  )
}

export default Messages

