import { useState } from "react"

function Login({ onLogin ,onRegister}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {

   if (!email.toLowerCase().endsWith("@gmail.com")) {
      alert("Please enter a valid Gmail address")
      return
    } 
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert("Login successful!")
        onLogin(data.user.email)
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Server connection failed")
      console.log(error)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>SkillSwap</h1>

        <p>Learn. Share. Connect.</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>
        <button onClick={onRegister}>Create New Account</button>
      </div>
    </div>
  )
}

export default Login