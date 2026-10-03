
import { useEffect, useState } from "react"

function MyRequests({ email, onBack, onChat }) {
  const [requests, setRequests] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const requestResponse = await fetch(
          `http://localhost:5000/api/swap/my-requests/${email}`
        )

        const requestData = await requestResponse.json()

        if (requestResponse.ok) {
          setRequests(requestData.requests)
        } else {
          alert(requestData.message)
        }

        const notificationResponse = await fetch(
          `http://localhost:5000/api/notifications/${email}`
        )

        const notificationData = await notificationResponse.json()

        if (notificationResponse.ok) {
          setNotifications(notificationData.notifications)
        } else {
          alert(notificationData.message)
        }
      } catch (error) {
        alert("Server connection failed")
        console.log(error)
      }
    }

    if (email) {
      getData()
    }
  }, [email])

  // Get accepted partners
  const acceptedRequests = requests.filter(
    (request) => request.status === "accepted"
  )

  // Accept or reject request
  const respondToRequest = async (requestId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/swap/respond/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        alert(
          status === "accepted"
            ? "Swap request accepted!"
            : "Swap request rejected!"
        )

        window.location.reload()
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Server connection failed")
      console.log(error)
    }
  }

  return (
    <div className="requests-page">

      {/* Header */}
      <div className="requests-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <h1>My Requests</h1>
          <p>Manage your skill swap requests</p>
        </div>

      </div>

      {/* Accepted Partners */}
      {acceptedRequests.length > 0 && (
        <section className="requests-section">

          <div className="section-heading">
            <h2>My Skill Partners</h2>
            <span>{acceptedRequests.length}</span>
          </div>

          <div className="requests-container">

            {acceptedRequests.map((request) => {
              const partner =
                request.sender.email === email
                  ? request.receiver
                  : request.sender

              return (
                <div
                  className="request-card accepted-card"
                  key={request._id}
                >

                  <div className="request-card-top">
                    <div className="request-avatar">
                      {partner.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3>{partner.name}</h3>

                      <span className="accepted-status">
                        ● Accepted
                      </span>
                    </div>
                  </div>

                  <div className="request-details">

                    <p>
                      <strong>Email</strong>
                      <span>{partner.email}</span>
                    </p>

                    <p>
                      <strong>Skill Offered</strong>
                      <span>{request.skillOffered}</span>
                    </p>

                    <p>
                      <strong>Skill Wanted</strong>
                      <span>{request.skillWanted}</span>
                    </p>

                  </div>

                  <button
                    className="chat-button"
                    onClick={() => onChat(partner.email)}
                  >
                    💬 Open Chat
                  </button>

                </div>
              )
            })}

          </div>
        </section>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <section className="requests-section">

          <div className="section-heading">
            <h2>Notifications</h2>
            <span>{notifications.length}</span>
          </div>

          <div className="notifications-list">

            {notifications.map((notification) => (

              <div
                className="request-notification"
                key={notification._id}
              >

                {/* New Skill Swap Request */}
                {notification.type === "swap_request" && (
                  <>
                    <div className="notification-title">
                      <span>🔔</span>
                      <h3>New Skill Swap Request</h3>
                    </div>

                    <p>
                      <strong>
                        {notification.sender?.name}
                      </strong>{" "}
                      ({notification.sender?.email}) sent you a skill swap
                      request.
                    </p>

                    <div className="notification-skills">
                      <span>
                        Offered: {notification.skillOffered}
                      </span>

                      <span>
                        Wanted: {notification.skillWanted}
                      </span>
                    </div>

                    <div className="notification-actions">

                      <button
                        className="accept-button"
                        onClick={() =>
                          respondToRequest(
                            notification.requestId,
                            "accepted"
                          )
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="reject-button"
                        onClick={() =>
                          respondToRequest(
                            notification.requestId,
                            "rejected"
                          )
                        }
                      >
                        Reject
                      </button>

                    </div>
                  </>
                )}

                {/* Accepted Notification */}
                {notification.type === "swap_accepted" && (
                  <>
                    <div className="notification-title">
                      <span>✅</span>
                      <h3>Swap Request Accepted</h3>
                    </div>

                    <p>
                      <strong>
                        {notification.sender?.name}
                      </strong>{" "}
                      ({notification.sender?.email}) accepted your skill
                      swap request.
                    </p>

                    <p className="notification-info">
                      You can now start chatting with your skill partner.
                    </p>
                  </>
                )}

                {/* Rejected Notification */}
                {notification.type === "swap_rejected" && (
                  <>
                    <div className="notification-title">
                      <span>❌</span>
                      <h3>Swap Request Rejected</h3>
                    </div>

                    <p>
                      <strong>
                        {notification.sender?.name}
                      </strong>{" "}
                      ({notification.sender?.email}) rejected your skill
                      swap request.
                    </p>
                  </>
                )}

              </div>

            ))}

          </div>
        </section>
      )}

      {/* Request List */}
      <section className="requests-section">

        <div className="section-heading">
          <h2>Swap Requests</h2>
        </div>

        <div className="requests-container">

          {requests.length === 0 ? (

            <div className="empty-requests">
              <div>📩</div>
              <h3>No swap requests found</h3>
              <p>
                Your skill swap requests will appear here.
              </p>
            </div>

          ) : (

            requests
              .filter(
                (request) =>
                  !(
                    request.receiver.email === email &&
                    request.status === "pending"
                  )
              )
              .map((request) => (

                <div
                  className="request-card"
                  key={request._id}
                >

                  <div className="request-card-top">

                    <div className="request-avatar">
                      {(request.sender.email === email
                        ? request.receiver.name
                        : request.sender.name
                      )?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3>
                        {request.sender.email === email
                          ? `To: ${request.receiver.name}`
                          : `From: ${request.sender.name}`}
                      </h3>

                      <span
                        className={`request-status ${request.status}`}
                      >
                        ● {request.status}
                      </span>
                    </div>

                  </div>

                  <div className="request-details">

                    <p>
                      <strong>Skill Offered</strong>
                      <span>{request.skillOffered}</span>
                    </p>

                    <p>
                      <strong>Skill Wanted</strong>
                      <span>{request.skillWanted}</span>
                    </p>

                  </div>

                  {/* Start Chat */}
                  {request.status === "accepted" && (
                    <button
                      className="chat-button"
                      onClick={() => {
                        const partnerEmail =
                          request.sender.email === email
                            ? request.receiver.email
                            : request.sender.email

                        onChat(partnerEmail)
                      }}
                    >
                      💬 Start Chat
                    </button>
                  )}

                  {/* Backup Accept / Reject */}
                  {request.receiver.email === email &&
                    request.status === "pending" && (

                      <div className="request-actions">

                        <button
                          className="accept-button"
                          onClick={() =>
                            respondToRequest(
                              request._id,
                              "accepted"
                            )
                          }
                        >
                          Accept
                        </button>

                        <button
                          className="reject-button"
                          onClick={() =>
                            respondToRequest(
                              request._id,
                              "rejected"
                            )
                          }
                        >
                          Reject
                        </button>

                      </div>

                  )}

                </div>

              ))

          )}

        </div>

      </section>

    </div>
  )
}

export default MyRequests

