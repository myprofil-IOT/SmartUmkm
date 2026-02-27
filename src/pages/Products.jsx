import { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { logActivity } from "../utils/activityLogger"
import { useRef } from "react"

const formatRupiah = (number) => {
  if (!number) return "Rp 0"
  return "Rp " + new Intl.NumberFormat("id-ID").format(Number(number))
}

function Products() {
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [discount, setDiscount] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [isModalOpen, setIsModalOpen] = useState(false) 
  const [isDragging, setIsDragging] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

 const handleCancelImage = () => {
  setImage(null)
  setPreview(null)

  if (fileInputRef.current) {
    fileInputRef.current.value = ""
  }
}

  // 🔥 TAMBAHAN - drag & drop upload
const handleDrop = (e) => {
  e.preventDefault()
  setIsDragging(false)

  const file = e.dataTransfer.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onloadend = () => {
    setImage(reader.result)
    setPreview(reader.result)
  }
  reader.readAsDataURL(file)
}

  const productsPerPage = 5
const categories = ["Makanan", "Minuman", "Fashion", "Elektronik", "Lainnya"]

useEffect(() => {
const saved = JSON.parse(localStorage.getItem("products")) || []
setProducts(saved)
}, [])
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
    window.dispatchEvent(new Event("productsUpdated")) // Notifikasi ke Shop.jsx / DashboardHome.jsx
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

    if (!name || !price || !category || stock === "" || discount === "") {
  toast.error("Semua field wajib diisi!")
  return
}

// 🔥 TAMBAHAN - stok tidak boleh 0 jika ada diskon
if (Number(discount) > 0 && Number(stock) === 0) {
  toast.error("Produk diskon tidak boleh stok 0!")
  return
}

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price.replace(/\./g, "")),
stock: Math.max(0, Number(stock)),
discount: Math.min(100, Math.max(0, Number(discount))),      
      category,
      image
    }

    setProducts([newProduct, ...products])

    // 🔥 LOG TAMBAH
    logActivity(user, `Menambahkan produk ${name}`)

    toast.success("Produk berhasil ditambahkan 🚀")

    setName("")
    setPrice("")
    setStock("")
    setDiscount("")
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
    setSelectedProduct({...product})
     setPreview(product.image)
  }

  // ================= UPDATE PRODUCT =================
  const handleUpdateProduct = () => {
  if (
  !selectedProduct.name ||
  !selectedProduct.price ||
  !selectedProduct.category
  ) {
    toast.error("Semua field wajib diisi!")
    return
  }

  const updatedProducts = products.map((p) =>
    p.id === selectedProduct.id ? selectedProduct : p
  )

  setProducts(updatedProducts)

  logActivity(user, `Mengupdate produk ${selectedProduct.name}`)

  setSelectedProduct(null) // tutup form edit
  toast.success("Produk berhasil diupdate 🎉")


  // 🔥 TAMBAHAN - pastikan harga number
  selectedProduct.price = Number(
    selectedProduct.price.toString().replace(/\./g, "")
  )

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
            className="border p-2 rounded w-full md:w-1/5 dark:bg-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* 🔥 DIUBAH - harga auto format Indonesia */}
      <input
          type="text"
          placeholder="Harga"
          className="border p-2 rounded w-full md:w-1/5 dark:bg-gray-700"
          value={price}
          onChange={(e) => {
          let raw = e.target.value.replace(/\D/g, "")
          if (!raw) {
          setPrice("")
      return
    }
        setPrice(new Intl.NumberFormat("id-ID").format(raw))
    }}
  />

      {/* 🔥 DIUBAH - stok tidak bisa minus */}
    <input
      type="number"
      min="0"
      placeholder="Stok"
      className="border p-2 rounded w-full md:w-1/5 dark:bg-gray-700"
      value={stock}
      onChange={(e) =>
      setStock(Math.max(0, Number(e.target.value)))
    }
  />

        {/* 🔥 DIUBAH - diskon 0-100 */}
    <input
      type="number"
      min="0"
      max="100"
      placeholder="Diskon %"
      className="border p-2 rounded w-full md:w-1/5 dark:bg-gray-700"
      value={discount}
      onChange={(e) =>
      setDiscount(
      Math.min(100, Math.max(0, Number(e.target.value)))
    )
  }
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
<div
  onDragOver={(e) => {
    e.preventDefault()
    setIsDragging(true)
  }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={handleDrop}
  className={`border-2 border-dashed p-4 rounded w-full md:w-1/5 text-center cursor-pointer 
  ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"}`}
>
  <input
  type="file"
  accept="image/*"
  ref={fileInputRef}   
  onChange={handleImageChange}
  className="hidden"
  id="upload"
/>

  <label htmlFor="upload" className="cursor-pointer block">
    📸 Klik atau Drag Gambar
  </label>
</div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded"
          >
            Tambah
          </button>
        </div>

        {preview && (
  <div className="flex flex-col items-center gap-2 mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
    <img
      src={preview}
      className="w-32 h-32 object-cover rounded"
      alt="Preview"
    />

    <button
      type="button"
      onClick={handleCancelImage}
      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
    >
      Hapus Gambar
    </button>
  </div>
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
    <div className="flex items-center gap-4">

  {product.image && (
    <img
      src={product.image}
      alt={product.name}
      className="w-16 h-16 object-cover rounded shadow"
    />
  )}

  <div>
    <p className="font-semibold">{product.name}</p>

      <div className="mt-1">

  {product.discount > 0 && (
    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mr-2">
      -{product.discount}%
    </span>
  )}

  <p className="text-sm">

          {product.discount > 0 ? (
    <>
        <span className="line-through text-red-400 mr-2">
            {formatRupiah(product.price)}
    </span>
        <span className="text-green-600 font-semibold">
          {formatRupiah(
          product.price -
            (product.price * product.discount) / 100
        )}
        </span>
          </>
          ) : (
            <span className="font-semibold">
            {formatRupiah(product.price)}
            </span>
          )}
      </p>
      </div>
              <p className="text-xs text-gray-500">Stok: {product.stock}</p>

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
                </div>
              </li>
            ))}
          </ul>
        )}
        
      </div>

      {/* ================= EDIT FORM ================= */}
{selectedProduct && (
  <div className="bg-yellow-50 p-6 rounded-xl shadow-md mt-6">
    <h2 className="text-lg font-bold mb-4">Edit Produk</h2>

    {/* Nama */}
    <input
      type="text"
      value={selectedProduct.name}
      onChange={(e) =>
        setSelectedProduct({
          ...selectedProduct,
          name: e.target.value,
        })
      }
      className="border p-2 rounded w-full mb-3"
    />

    {/* Harga */}
    <input
      type="number"
      value={selectedProduct.price}
      onChange={(e) =>
        setSelectedProduct({
          ...selectedProduct,
          price: Number(e.target.value),
        })
      }
      className="border p-2 rounded w-full mb-3"
    />

    {/* Stok */}
    <input
      type="number"
      value={selectedProduct.stock}
      onChange={(e) =>
        setSelectedProduct({
          ...selectedProduct,
          stock: Number(e.target.value),
        })
      }
      className="border p-2 rounded w-full mb-3"
    />

    {/* Diskon */}
    <input
      type="number"
      value={selectedProduct.discount}
      onChange={(e) =>
        setSelectedProduct({
          ...selectedProduct,
          discount: Number(e.target.value),
        })
      }
      className="border p-2 rounded w-full mb-3"
    />

    {/* Category */}
    <select
      value={selectedProduct.category}
      onChange={(e) =>
        setSelectedProduct({
          ...selectedProduct,
          category: e.target.value,
        })
      }
      className="border p-2 rounded w-full mb-4"
    >
      {categories.map((cat) => (
        <option key={cat}>{cat}</option>
      ))}
    </select>

    {/* Tombol Update */}
    <button
      onClick={handleUpdateProduct}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Update
    </button>
  </div>
)}

    </div>
  )
}

export default Products


