import { useState, useEffect } from "react"

function Users() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const usersPerPage = 5

  // ================= LOAD =================
  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("users")) || []

  // 🔥 pastikan admin & staff ada
  const adminExists = saved.find(u => u.email === "admin@gmail.com")

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

    const updated = [...defaultUsers, ...saved]
    localStorage.setItem("users", JSON.stringify(updated))
    setUsers(updated)
  } else {
    setUsers(saved)
  }
}, [])

  // ================= SAVE =================
  useEffect(() => {
  if (users.length > 0) {
    localStorage.setItem("users", JSON.stringify(users))
  }
}, [users])

  // ================= ADD USER =================
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email) return

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: "123456", 
      role: "user"
    }

    setUsers([...users, newUser])
    setName("")
    setEmail("")
  }

  // ================= DELETE =================
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus user?")
    if (!confirmDelete) return

    setUsers(users.filter((u) => u.id !== id))
  }

  // ================= EDIT =================
  const handleEditClick = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleUpdateUser = () => {
    if (!selectedUser.name || !selectedUser.email) return

    const updated = users.map((u) =>
      u.id === selectedUser.id ? selectedUser : u
    )

    setUsers(updated)
    setIsModalOpen(false)
  }

  // ================= SEARCH =================
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  )

  // ================= PAGINATION =================
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  )

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white p-6 transition">

      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {/* ================= STATISTIK ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-2xl font-bold">{users.length}</h2>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search user..."
        className="border p-2 rounded w-full mb-4 dark:bg-gray-800"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
      />

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6"
      >
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Nama"
            className="border p-2 rounded w-full md:w-1/4 dark:bg-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-full md:w-1/4 dark:bg-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded"
          >
            Tambah
          </button>
        </div>
      </form>

      {/* ================= LIST ================= */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        {currentUsers.length === 0 ? (
          <p className="text-gray-500">User tidak ditemukan</p>
        ) : (
          <ul className="space-y-4">
            {currentUsers.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-blue-500">{user.role}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL EDIT ================= */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <input
              type="text"
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  name: e.target.value
                })
              }
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="email"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  email: e.target.value
                })
              }
              className="border p-2 w-full mb-3 rounded"
            />

            <p className="text-sm text-gray-500 mb-4">
                Role: {selectedUser.role}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 rounded text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 rounded text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users