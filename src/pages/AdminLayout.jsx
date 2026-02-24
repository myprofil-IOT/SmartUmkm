import { useNavigate, NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-blue-700 text-white p-6 flex flex-col justify-between">

        <div>
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

          <nav className="flex flex-col gap-4">

            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                isActive
                  ? "bg-blue-900 p-2 rounded"
                  : "hover:bg-blue-600 p-2 rounded"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/dashboard/products"
              className={({ isActive }) =>
                isActive
                  ? "bg-blue-900 p-2 rounded"
                  : "hover:bg-blue-600 p-2 rounded"
              }
            >
              Produk
            </NavLink>

            {user?.role === "admin" && (
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  isActive
                    ? "bg-blue-900 p-2 rounded"
                    : "hover:bg-blue-600 p-2 rounded"
                }
              >
                Users
              </NavLink>
            )}

          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 p-2 rounded mt-10"
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout