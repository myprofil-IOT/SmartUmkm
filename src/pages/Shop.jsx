import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Shop() {
  const navigate = useNavigate()
  const [now, setNow] = useState(new Date())
  const [showPopup, setShowPopup] = useState(false)
  const [qty, setQty] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Keripik Singkong",
      price: 15000,
      discount: 20,
      stock: 10,
      promoEnd: "2026-07-07T23:59:59",
      image: "https://source.unsplash.com/400x300/?chips",
    },
    {
      id: 2,
      name: "Kopi Lokal Arabica",
      price: 45000,
      discount: 30,
      stock: 8,
      promoEnd: "2026-07-07T23:59:59",
      image: "https://source.unsplash.com/400x300/?coffee",
    },
    {
      id: 3,
      name: "Tas Anyaman",
      price: 120000,
      discount: 15,
      stock: 25,
      promoEnd: "2026-07-07T23:59:59",
      image: "https://source.unsplash.com/400x300/?bag",
    },
    {
      id: 4,
      name: "Baju Batik",
      price: 200000,
      discount: 25,
      stock: 100,
      promoEnd: "2026-07-07T23:59:59",
      image: "https://source.unsplash.com/400x300/?clothes",
    },
    {
      id: 5,
      name: "Sambal Buatan Sendiri",
      price: 30000,
      discount: 10,
      stock: 50,
      promoEnd: "2026-07-07T23:59:59",
      image: "https://source.unsplash.com/400x300/?sauce",
    },
    {
      id: 6,
      name: "Kerajinan Kayu",
      price: 80000,
      discount: 5,
      stock: 20,
      promoEnd: "2026-07-07T23:59:59",
      image: "https://source.unsplash.com/400x300/?woodwork",
    },
    {
      id: 7,
      name: "Kue Kering Lezat",
      price: 50000,
      discount: 18,
      stock: 30,
      promoEnd: "2026-07-07T23:59:59",
      image: "https://source.unsplash.com/400x300/?cookies",
    },
    {
      id: 8,
      name: "Minuman Herbal",
      price: 25000,
      discount: 12,
      stock: 40,
      promoEnd: "2026-07-07T23:59:59",
      image: "https://source.unsplash.com/400x300/?herbal",
    },
    {
      id: 9,
      name: "Aksesoris Handmade",
      price: 60000,
      discount: 22,
      stock: 15,
      promoEnd: "2026-07-07T23:59:59",
      image: "https://source.unsplash.com/400x300/?accessories",
    },
  ])

  const getCountdown = (endDate) => {
    const diff = new Date(endDate) - now
    if (diff <= 0) return "Promo Berakhir"
    const h = Math.floor(diff / (1000 * 60 * 60))
    const m = Math.floor((diff / (1000 * 60)) % 60)
    const s = Math.floor((diff / 1000) % 60)
    return `${h}j ${m}m ${s}d`
  }

  const finalPrice = (product) =>
    product.price - (product.price * product.discount) / 100

  const totalCartPrice = cart.reduce(
    (acc, item) => acc + item.qty * finalPrice(item),
    0
  )

  const handleAddToCart = () => {
    if (!selectedProduct) return

    setCart((prev) => [...prev, { ...selectedProduct, qty }])

    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, stock: p.stock - qty }
          : p
      )
    )

    setShowPopup(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-16 px-6">
      <button
  onClick={() => navigate("/")}
  className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
>
  ⬅ Kembali
</button>
      <h1 className="text-4xl font-bold text-center mb-8">
        🛒 Marketplace UMKM
      </h1>

      {/* CART BOX */}
      <div className="max-w-6xl mx-auto mb-6 bg-white p-4 rounded-xl shadow">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Keranjang ({cart.length})</h2>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Checkout
          </button>
        </div>
        <p className="mt-2 font-semibold">
          Total: Rp{totalCartPrice.toLocaleString()}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => {
          const soldOut = product.stock === 0
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-md p-4">

              <img src={product.image} className="w-full h-48 object-cover rounded" />

              <h2 className="mt-3 font-semibold">{product.name}</h2>
              <p className="text-gray-500">Stok: {product.stock}</p>

              <p className="text-gray-400 line-through">
                Rp{product.price.toLocaleString()}
              </p>
              <p className="text-red-600 font-bold">
                Rp{finalPrice(product).toLocaleString()}
              </p>

              <p className="text-orange-500 text-sm">
                ⏳ {getCountdown(product.promoEnd)}
              </p>

              <button
                disabled={soldOut}
                onClick={() => {
                  setSelectedProduct(product)
                  setQty(1)
                  setShowPopup(true)
                }}
                className={`mt-3 w-full py-2 rounded ${
                  soldOut
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {soldOut ? "Sold Out" : "Beli"}
              </button>

            </div>
          )
        })}
      </div>

      {/* POPUP with smooth animation */}
      {showPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center animate-fadeIn">
          <div className="bg-white p-8 rounded-xl w-80 text-center transform transition-all scale-100 animate-scaleIn">

            <h3 className="font-bold mb-4">{selectedProduct.name}</h3>

            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                className="bg-gray-200 px-3 rounded"
              >
                -
              </button>
              <span>{qty}</span>
              <button
                onClick={() =>
                  setQty(qty < selectedProduct.stock ? qty + 1 : qty)
                }
                className="bg-gray-200 px-3 rounded"
              >
                +
              </button>
            </div>

            <p className="font-bold mb-4">
              Total: Rp{(finalPrice(selectedProduct) * qty).toLocaleString()}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Tambah
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Shop