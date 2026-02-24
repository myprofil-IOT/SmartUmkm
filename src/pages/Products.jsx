import { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { logActivity } from "../utils/activityLogger"

function Products() {
  const { user } = useAuth()

  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const productsPerPage = 5
  const categories = ["Makanan", "Minuman", "Fashion", "Elektronik", "Lainnya"]

  useEffect(() => {
    const saved = localStorage.getItem("products")
    if (saved) setProducts(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
    window.dispatchEvent(new Event("productsUpdated"))
  }, [products])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterCategory])

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result)
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // ================= ADD PRODUCT =================
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !price || !category) {
      toast.error("Semua field wajib diisi!")
      return
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      category,
      image
    }

    setProducts([...products, newProduct])

    // 🔥 LOG TAMBAH
    logActivity(user, `Menambahkan produk ${name}`)

    toast.success("Produk berhasil ditambahkan 🚀")

    setName("")
    setPrice("")
    setCategory("")
    setImage(null)
    setPreview(null)
  }

  // ================= DELETE =================
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus produk ini?")
    if (!confirmDelete) return

    const product = products.find((p) => p.id === id)

    setProducts(products.filter((p) => p.id !== id))

    // 🔥 LOG HAPUS
    logActivity(user, `Menghapus produk ${product.name}`)

    toast.success("Produk berhasil dihapus 🗑️")
  }

  // ================= EDIT =================
  const handleEditClick = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  // ================= UPDATE PRODUCT =================
  const handleUpdateProduct = () => {
    if (!selectedProduct.name || !selectedProduct.price || !selectedProduct.category) {
      toast.error("Semua field wajib diisi!")
      return
    }

    const updated = products.map((p) =>
      p.id === selectedProduct.id ? selectedProduct : p
    )

    setProducts(updated)

    // 🔥 LOG UPDATE
    logActivity(user, `Mengupdate produk ${selectedProduct.name}`)

    setIsModalOpen(false)
    toast.success("Produk berhasil diupdate 🎉")
  }

  // ================= EXPORT =================
  const exportToExcel = () => {
    if (products.length === 0) {
      toast.error("Tidak ada data untuk diexport")
      return
    }

    const exportData = products.map(({ id, name, price, category }) => ({
      id,
      name,
      price,
      category
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produk")

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    })

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    })

    saveAs(blob, "Data_Produk.xlsx")
    toast.success("Export Excel berhasil 📥")
  }

  // ================= FILTER =================
  let filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  if (filterCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === filterCategory
    )
  }

  // ================= PAGINATION =================
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white p-6 transition">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search produk..."
          className="border p-2 rounded w-full md:w-1/4 dark:bg-gray-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded dark:bg-gray-800"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          📥 Export Excel
        </button>
      </div>

      {/* FORM TAMBAH */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6"
      >
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Nama Produk"
            className="border p-2 rounded w-full md:w-1/4 dark:bg-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Harga"
            className="border p-2 rounded w-full md:w-1/4 dark:bg-gray-700"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="border p-2 rounded w-full md:w-1/4 dark:bg-gray-700"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full md:w-1/4"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded"
          >
            Tambah
          </button>
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 w-32 h-32 object-cover rounded"
          />
        )}
      </form>

      {/* LIST */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        {currentProducts.length === 0 ? (
          <p className="text-gray-500">Produk tidak ditemukan</p>
        ) : (
          <ul className="space-y-4">
            {currentProducts.map((product) => (
              <li
                key={product.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Rp {product.price}
                  </p>
                  <p className="text-xs text-blue-500">
                    {product.category}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}

export default Products