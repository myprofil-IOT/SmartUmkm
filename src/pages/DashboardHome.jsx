import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts"

import { FaBox, FaMoneyBillWave, FaTags } from "react-icons/fa"

function DashboardHome() {
  const [products, setProducts] = useState([])
  const [timeFilter, setTimeFilter] = useState("all")

  useEffect(() => {
    loadProducts()

    const updateListener = () => {
      loadProducts()
    }

    window.addEventListener("productsUpdated", updateListener)

    return () => {
      window.removeEventListener("productsUpdated", updateListener)
    }
  }, [])

  const loadProducts = () => {
    const saved = localStorage.getItem("products")
    if (saved) {
      setProducts(JSON.parse(saved))
    } else {
      setProducts([])
    }
  }

  // ================= FILTER BY TIME =================
  const now = new Date()

  const filteredProducts = products.filter((product) => {
    if (timeFilter === "all") return true

    if (!product.id) return false

    const productDate = new Date(product.id)
    const diffTime = now - productDate
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    if (timeFilter === "today") return diffDays < 1
    if (timeFilter === "7days") return diffDays <= 7
    if (timeFilter === "30days") return diffDays <= 30

    return true
  })

  // ================= LOW STOCK =================
  const lowStockProducts = filteredProducts.filter(
    (product) => product.stock !== undefined && Number(product.stock) <= 5
  )

  // ================= SUMMARY =================
  const totalProducts = filteredProducts.length

  const totalValue = filteredProducts.reduce(
    (acc, product) => acc + Number(product.price || 0),
    0
  )

  const totalCategories = [
    ...new Set(filteredProducts.map((p) => p.category))
  ].length

  // ================= CATEGORY DATA =================
  const categoryData = Object.values(
    filteredProducts.reduce((acc, product) => {
      if (!product.category) return acc

      if (!acc[product.category]) {
        acc[product.category] = {
          category: product.category,
          total: 0
        }
      }

      acc[product.category].total += 1
      return acc
    }, {})
  )

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  // ================= MONTHLY TREND =================
  const monthlyData = Object.values(
    filteredProducts.reduce((acc, product) => {
      if (!product.id) return acc

      const month = new Date(product.id).toLocaleString("default", {
        month: "short"
      })

      if (!acc[month]) {
        acc[month] = { month, total: 0 }
      }

      acc[month].total += 1
      return acc
    }, {})
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white p-6 transition">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>

        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="border p-2 rounded dark:bg-gray-800"
        >
          <option value="all">Semua Data</option>
          <option value="today">Hari Ini</option>
          <option value="7days">7 Hari Terakhir</option>
          <option value="30days">30 Hari Terakhir</option>
        </select>
      </div>

      {/* LOW STOCK ALERT */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-400">
          <h2 className="font-bold mb-2">⚠️ Peringatan Stok Rendah</h2>
          <ul className="list-disc list-inside">
            {lowStockProducts.map((product) => (
              <li key={product.id}>
                {product.name} (Sisa stok: {product.stock})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-2xl">
            <FaBox />
          </div>
          <div>
            <h2 className="text-sm text-gray-500">Total Produk</h2>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-4 rounded-full text-2xl">
            <FaMoneyBillWave />
          </div>
          <div>
            <h2 className="text-sm text-gray-500">Total Nilai</h2>
            <p className="text-2xl font-bold">Rp {totalValue}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-4">
          <div className="bg-purple-100 text-purple-600 p-4 rounded-full text-2xl">
            <FaTags />
          </div>
          <div>
            <h2 className="text-sm text-gray-500">Jumlah Kategori</h2>
            <p className="text-2xl font-bold">{totalCategories}</p>
          </div>
        </div>

      </div>

      {/* BAR CHART */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Produk per Kategori</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Persentase Produk</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="total"
              nameKey="category"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LINE CHART */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Trend Produk per Bulan</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

export default DashboardHome