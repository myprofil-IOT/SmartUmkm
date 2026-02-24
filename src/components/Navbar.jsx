import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem("darkMode")
    if (saved === "true") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    localStorage.setItem("darkMode", newMode)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white dark:bg-gray-900 dark:text-white shadow-md p-4 fixed w-full top-0 z-50 transition-colors">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-yellow-400">
          SmartUMKM
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 font-medium items-center">

          <li><a href="#hero" className="hover:text-blue-600 dark:hover:text-yellow-400">Home</a></li>
          <li><a href="#features" className="hover:text-blue-600 dark:hover:text-yellow-400">Features</a></li>
          <li><a href="#about" className="hover:text-blue-600 dark:hover:text-yellow-400">About</a></li>
          <li><a href="#contact" className="hover:text-blue-600 dark:hover:text-yellow-400">Contact</a></li>

          {/* Jika Login */}
          {user ? (
            <>
              {user.role === "admin" && (
                <li>
                  <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-yellow-400">
                    Dashboard
                  </Link>
                </li>
              )}

              <li className="text-sm">
                👤 {user.username}
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="hover:text-blue-600 dark:hover:text-yellow-400">
                Login
              </Link>
            </li>
          )}

          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="ml-4 px-3 py-1 rounded bg-gray-800 text-white dark:bg-yellow-500 dark:text-black transition"
          >
            {darkMode ? "☀" : "🌙"}
          </button>

        </ul>

        {/* Mobile Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="px-2 py-1 rounded bg-gray-800 text-white dark:bg-yellow-500 dark:text-black transition"
          >
            {darkMode ? "☀" : "🌙"}
          </button>

          <button 
            className="text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col items-center gap-4 mt-4 pb-4 font-medium bg-white dark:bg-gray-900 transition-colors">
          <li><a href="#hero" onClick={() => setIsOpen(false)}>Home</a></li>
          <li><a href="#features" onClick={() => setIsOpen(false)}>Features</a></li>
          <li><a href="#about" onClick={() => setIsOpen(false)}>About</a></li>
          <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>

          {user ? (
            <>
              {user.role === "admin" && (
                <li>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </li>
              )}

              <li>👤 {user.username}</li>

              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  )
}

export default Navbar