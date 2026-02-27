import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "@phosphor-icons/react";

const formatRupiah = (number) => {
  return "Rp " + new Intl.NumberFormat("id-ID").format(number);
};

// ======= COMPONENT POPUP =======
function ProductPopup({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  if (!product) return null;

  const finalPrice = (product) =>
    product.price - (product.price * (product.discount || 0)) / 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
  <div className="bg-white p-6 rounded-xl w-80 text-center transform transition-all duration-300 scale-100 animate-scaleIn">
        <h3 className="font-bold mb-4">{product.name}</h3>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setQty(prev => Math.max(1, prev - 1))} // 🔥 DIUBAH
          className="bg-gray-200 px-3 rounded"
          >
            -
          </button>
          <span>{qty}</span>
          <button
            onClick={() => setQty(prev => Math.min(product.stock, prev + 1))} // 🔥 DIUBAH
          className="bg-gray-200 px-3 rounded"
          >
            +
          </button>
        </div>

        <p className="font-bold mb-4">
          Total: {formatRupiah(finalPrice(product) * qty)}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Batal
          </button>
          <button
            onClick={() => onAdd(qty)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}

// ======= SHOP COMPONENT =======
function Shop() {
  const navigate = useNavigate();

  const categories = ["Semua", "Makanan", "Minuman", "Fashion", "Elektronik", "Lainnya"];

  const [products, setProducts] = useState([]);

useEffect(() => {
  const saved = localStorage.getItem("products");
  setProducts(saved ? JSON.parse(saved) : []);
}, []);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Simpan ke localStorage setiap update products atau cart

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  useEffect(() => {
  const handleUpdate = () => {
    const updated = localStorage.getItem("products");
    setProducts(updated ? JSON.parse(updated) : []);
  };

  window.addEventListener("productsUpdated", handleUpdate);

  return () => {
    window.removeEventListener("productsUpdated", handleUpdate);
  };
}, []);

  const finalPrice = (product) =>
    product.price - (product.price * (product.discount || 0)) / 100;

  const addToCart = (product, qty) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
    // 🔥 DIUBAH - tambah qty jika sudah ada
    setCart(cart.map(item =>
      item.id === product.id
        ? { ...item, qty: item.qty + qty }
        : item
    ));
  } else {
    setCart([...cart, { ...product, qty }]);
  }
};

  const handleAddFromPopup = (qty) => {
    if (!selectedProduct) return;

    if (qty > selectedProduct.stock) return;
    addToCart(selectedProduct, qty);

    setProducts(products.map(p =>
      p.id === selectedProduct.id
        ? { ...p, stock: Math.max(0, p.stock - qty) } // 🔥 DIUBAH
      : p
    ));

    setShowPopup(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // FILTER GABUNGAN (Kategori + Search + Sort)
  const filteredProducts = products
    .filter((product) =>
      selectedCategory === "Semua"
        ? true
        : product.category === selectedCategory
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "low") return finalPrice(a) - finalPrice(b);
      if (sortOption === "high") return finalPrice(b) - finalPrice(a);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-gray-100 px-6 py-2 pt-20 rounded hover:bg-gray-100"
      >
        ⬅ Kembali
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">
        🛒 Toko Online SmartUMKM
      </h1>

      {/* Kategori */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => {
          const count =
            cat === "Semua"
              ? products.length
              : products.filter((p) => p.category === cat).length;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border transition ${
                isActive
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Search + Sort */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded border"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 rounded border"
        >
          <option value="default">Urutkan</option>
          <option value="low">Termurah</option>
          <option value="high">Termahal</option>
        </select>
      </div>

      {/* Produk */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          Tidak ada produk ditemukan.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow p-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500 mb-1">Stok: {product.stock}</p>
              <p className="text-gray-400 line-through text-sm">
                {formatRupiah(product.price)}
              </p>
              <p className="text-green-600 font-bold text-lg">
                {formatRupiah(finalPrice(product))}
              </p>

              {/* Tombol Beli aktif jika ada stock */}
              <button
                disabled={!product.stock || product.stock === 0}
                onClick={() => {
                  if (product.stock > 0) {
                    setSelectedProduct(product);
                    setShowPopup(true);
                  }
                }}
                className={`mt-3 w-full py-2 rounded ${
                  !product.stock || product.stock === 0
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {!product.stock || product.stock === 0 ? "Sold Out" : "Beli"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Keranjang fixed */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate("/checkout")}
          className="bg-green-500 hover:bg-green-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative transition"
        >
          <ShoppingCart size={26} color="white" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-green-700 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* POPUP */}
      {showPopup && selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={() => setShowPopup(false)}
          onAdd={handleAddFromPopup}
        />
      )}
      {showToast && (
  <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn z-50">
    ✅ Produk berhasil ditambahkan ke keranjang
  </div>
)}
    </div>
  );
}

export default Shop;