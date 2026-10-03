
import { useEffect, useState } from "react"
import Login from "./Login.jsx"
import Dashboard from "./Dashboard.jsx"
import MySkills from "./MySkills.jsx"
import FindPartners from "./FindPartners.jsx"
import MyRequests from "./MyRequests.jsx"
import Profile from "./Profile.jsx"
import Register from "./Register.jsx"
import Chat from "./Chat.jsx"
import Messages from "./Messages.jsx"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  )

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  )

  const [page, setPage] = useState("dashboard")
  const [partnerEmail, setPartnerEmail] = useState("")
  const [showRegister, setShowRegister] = useState(false)

  // UPDATE ONLINE STATUS
  useEffect(() => {
    if (!userEmail) {
      return
    }

    const updateOnlineStatus = async () => {
      try {
        await fetch("http://localhost:5000/api/chat/online", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: userEmail,
            isOnline: true
          })
        })
      } catch (error) {
        console.log(error)
      }
    }

    updateOnlineStatus()
  }, [userEmail])

  if (!isLoggedIn && showRegister) {
    return (
      <Register
        onRegister={(email) => {
          setUserEmail(email)
          setIsLoggedIn(true)

          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("userEmail", email)
        }}
      />
    )
  }

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={(email) => {
          setUserEmail(email)
          setIsLoggedIn(true)

          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("userEmail", email)
        }}
        onRegister={() => setShowRegister(true)}
      />
    )
  }

  if (page === "skills") {
    return (
      <MySkills
        email={userEmail}
        onBack={() => setPage("dashboard")}
      />
    )
  }

  if (page === "partners") {
    return (
      <FindPartners
        email={userEmail}
        onBack={() => setPage("dashboard")}
      />
    )
  }

  if (page === "messages") {
    return (
      <Messages
        email={userEmail}
        onBack={() => setPage("dashboard")}
        onChat={(partnerEmail) => {
          setPartnerEmail(partnerEmail)
          setPage("chat")
        }}
      />
    )
  }

  if (page === "requests") {
    return (
      <MyRequests
        email={userEmail}
        onBack={() => setPage("dashboard")}
        onChat={(partnerEmail) => {
          setPartnerEmail(partnerEmail)
          setPage("chat")
        }}
      />
    )
  }

  if (page === "profile") {
    return (
      <Profile
        email={userEmail}
        onBack={() => setPage("dashboard")}
      />
    )
  }

  console.log("App User Email:", userEmail)
  console.log("App Partner Email:", partnerEmail)

  if (page === "chat") {
    return (
      <Chat
        email={userEmail}
        partnerEmail={partnerEmail}
        onBack={() => setPage("messages")}
      />
    )
  }

  return (
    <Dashboard
      email={userEmail}
      onMySkills={() => setPage("skills")}
      onFindPartners={() => setPage("partners")}
      onMyRequests={() => setPage("requests")}
      onProfile={() => setPage("profile")}
      onMessages={() => setPage("messages")}
      onLogout={async () => {
        try {
          await fetch("http://localhost:5000/api/chat/online", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: userEmail,
              isOnline: false
            })
          })
        } catch (error) {
          console.log(error)
        }

        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("userEmail")
        setIsLoggedIn(false)
        setUserEmail("")
      }}
    />
  )
}

export default App

