import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { logActivity } from "../utils/activityLogger"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()

    const users = [
      { email: "admin@gmail.com", password: "1234", role: "admin", username: "Admin" },
      { email: "staff@gmail.com", password: "2222", role: "staff", username: "Staff" },
      { email: "user@gmail.com", password: "1111", role: "user", username: "User" }
    ]

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      login(foundUser)

      // 🔥 LOG ACTIVITY
      logActivity(foundUser, "Login ke sistem")

      if (foundUser.role === "admin" || foundUser.role === "staff") {
        navigate("/dashboard")
      } else {
        navigate("/")
      }
    } else {
      setError("Email atau Password salah!")
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login