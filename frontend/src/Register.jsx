import { useState } from "react"

function Register({ onRegister }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {

   if (!email.toLowerCase().endsWith("@gmail.com")) {
    alert("Please enter a valid Gmail address")
    return
  }  
  
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        alert("Registration successful!")
        onRegister(data.user.email)
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
        <h1>Create Account</h1>

        <p>Join SkillSwap</p>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>
          Create Account
        </button>
      </div>
    </div>
  )
}

export default Register