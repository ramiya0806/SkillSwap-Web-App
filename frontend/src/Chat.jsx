import { useEffect, useState, useRef } from "react"

function Chat({ email, partnerEmail, onBack }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [partnerTyping, setPartnerTyping] = useState(false)

  const chatMessagesRef = useRef(null)

  // MARK MESSAGES AS SEEN
  const markMessagesAsSeen = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/chat/seen/${email}/${partnerEmail}`,
        {
          method: "PUT"
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  // GET TYPING STATUS
  const getTypingStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/typing/${partnerEmail}/${email}`
      )

      const data = await response.json()

      if (response.ok) {
        setPartnerTyping(data.isTyping)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // GET MESSAGES
  useEffect(() => {
    const getMessages = async () => {
      try {
        // First mark incoming messages as seen
        await markMessagesAsSeen()

        const response = await fetch(
          `http://localhost:5000/api/chat/${email}/${partnerEmail}`
        )

        const data = await response.json()

        if (response.ok) {
          setMessages(data.messages)
        } else {
          alert(data.message)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (email && partnerEmail) {
      getMessages()

      const interval = setInterval(() => {
        getMessages()
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [email, partnerEmail])

  // GET TYPING STATUS EVERY 2 SECONDS
  useEffect(() => {
    if (email && partnerEmail) {
      getTypingStatus()

      const interval = setInterval(() => {
        getTypingStatus()
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [email, partnerEmail])

  // AUTO SCROLL TO BOTTOM
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop =
        chatMessagesRef.current.scrollHeight
    }
  }, [messages, partnerTyping])

  // SEND MESSAGE
  const sendMessage = async () => {
    if (message.trim() === "") {
      return
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            senderEmail: email,
            receiverEmail: partnerEmail,
            message: message
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessages([...messages, data.newMessage])
        setMessage("")
        setIsTyping(false)
        setPartnerTyping(false)

        await fetch(
          "http://localhost:5000/api/chat/typing",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userEmail: email,
              partnerEmail: partnerEmail,
              isTyping: false
            })
          }
        )
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Server connection failed")
      console.log(error)
    }
  }

  return (
    <div className="page-container">

      <button onClick={onBack}>
        Back to Requests
      </button>

      <h1 className="page-title">
        Chat
      </h1>

      <div className="chat-container">

        <div className="chat-header">
          <h2>Skill Partner</h2>
          <p>{partnerEmail}</p>
        </div>

        <div
          className="chat-messages"
          ref={chatMessagesRef}
        >

          {messages.length === 0 ? (
            <p className="no-messages">
              Start your conversation with your skill partner
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={
                  msg.sender.email === email
                    ? "message sent"
                    : "message received"
                }
              >

                <p>{msg.message}</p>

                {msg.sender.email === email && (
                  <span className="seen-status">
                    {msg.seen ? "✓✓ Seen" : "✓ Sent"}
                    {" • "}
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                  </span>
                )}

              </div>
            ))
          )}

          {partnerTyping && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

        </div>

        {showEmojiPicker && (
          <div className="emoji-list">
            {[
              "😀",
              "😂",
              "❤️",
              "👍",
              "😊",
              "😍",
              "🎉",
              "🙌",
              "🔥",
              "👋",
              "😎",
              "💯",
              "✨"
            ].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setMessage(message + emoji)
                  setShowEmojiPicker(false)
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input">

          <button
            type="button"
            className="emoji-button"
            onClick={() =>
              setShowEmojiPicker(!showEmojiPicker)
            }
          >
            😊
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={async (e) => {
              const value = e.target.value

              setMessage(value)

              const typing = value.trim() !== ""

              setIsTyping(typing)

              try {
                await fetch(
                  "http://localhost:5000/api/chat/typing",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      userEmail: email,
                      partnerEmail: partnerEmail,
                      isTyping: typing
                    })
                  }
                )
              } catch (error) {
                console.log(error)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage()
              }
            }}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>
    </div>
  )
}

export default Chat