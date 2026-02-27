import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { logActivity } from "../utils/activityLogger"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
  const existingUsers =
    JSON.parse(localStorage.getItem("users")) || []

  const adminExists = existingUsers.find(
    (u) => u.email === "admin@gmail.com"
  )

  if (!adminExists) {
    const defaultUsers = [
      {
        id: 1,
        name: "Admin",
        email: "admin@gmail.com",
        password: "1234",
        role: "admin"
      },
      {
        id: 2,
        name: "Staff",
        email: "staff@gmail.com",
        password: "2222",
        role: "staff"
      }
    ]

    localStorage.setItem(
      "users",
      JSON.stringify([...defaultUsers, ...existingUsers])
    )
  }
}, [])

  const handleLogin = (e) => {
    e.preventDefault()

    const users = 
      JSON.parse(localStorage.getItem("users")) || []

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      login(foundUser)
       localStorage.setItem("currentUser", JSON.stringify(foundUser))

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