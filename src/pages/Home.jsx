import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"

function Home() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nama: "",
    email: "",
    pesan: ""
  })

  const [success, setSuccess] = useState(false)

  const categories = [
    { name: "Fashion", icon: "👕", slug: "fashion" },
    { name: "Makanan", icon: "🍔", slug: "makanan" },
    { name: "Minuman", icon: "🥤", slug: "minuman" },
    { name: "Kerajinan", icon: "🎁", slug: "kerajinan" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.nama || !form.email || !form.pesan) {
      alert("Semua field wajib diisi!")
      return
    }

    // Nanti bisa kirim ke backend di sini
    console.log("Data terkirim:", form)

    setSuccess(true)
    setForm({ nama: "", email: "", pesan: "" })

    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO */}
        <section id="hero" className="text-center py-0 bg-blue-0 text-white mt-0">
      <section className="text-center py-32 bg-blue-600 text-white mt-16">
        <h2 className="text-4xl font-bold mb-4">
          Solusi Digital untuk UMKM Indonesia
        </h2>

        <p className="text-lg mb-8">
          Bantu UMKM naik kelas dengan sistem modern.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              document.getElementById("features")
                .scrollIntoView({ behavior: "smooth" })
            }}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Pelajari Lebih Lanjut
          </button>

          <button 
          onClick={() => navigate("/shop")} 
          className="bg-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition" > 
          Kunjungi Shop 
          </button> 
          </div> 
          </section>
      </section>

      {/* KATEGORI */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12">
            🛍 Kategori Produk
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/shop?category=${cat.slug}`}
                className="bg-gray-100 p-10 rounded-xl shadow hover:shadow-xl hover:scale-105 transition text-center"
              >
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h4 className="text-xl font-semibold">{cat.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12">
            Fitur Unggulan SmartUMKM
          </h3>

          <div className="grid md:grid-cols-3 gap-8 px-6">

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <h4 className="text-xl font-semibold mb-3">
                Pencatatan Keuangan
              </h4>
              <p>
                Catat pemasukan dan pengeluaran dengan mudah dan rapi.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <h4 className="text-xl font-semibold mb-3">
                Manajemen Produk
              </h4>
              <p>
                Kelola stok dan daftar produk UMKM secara digital.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <h4 className="text-xl font-semibold mb-3">
                Laporan Otomatis
              </h4>
              <p>
                Dapatkan laporan keuangan otomatis dan siap cetak.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT */} 
      <section id="about" className="py-20 bg-white" > 
        <div className="container mx-auto px-6 text-center max-w-4xl"> 
          <h3 className="text-3xl font-bold mb-6"> 
            Tentang SmartUMKM </h3> 
            <p className="text-lg text-gray-600 leading-relaxed"> 
              SmartUMKM adalah platform digital yang dirancang untuk membantu pelaku UMKM dalam mengelola keuangan, produk, dan laporan bisnis secara lebih modern dan efisien. Dengan sistem yang sederhana dan mudah digunakan, SmartUMKM membantu UMKM naik kelas dan siap bersaing di era digital. 
              </p> 
              </div> 
              </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">
            Hubungi Kami
          </h3>

          {success && (
            <div className="mb-4 bg-green-500 text-white p-3 rounded-lg">
              Pesan berhasil dikirim!
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Nama"
              value={form.nama}
              onChange={(e) =>
                setForm({ ...form, nama: e.target.value })
              }
              className="p-3 border rounded-lg"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="p-3 border rounded-lg"
            />

            <textarea
              rows="4"
              placeholder="Pesan"
              value={form.pesan}
              onChange={(e) =>
                setForm({ ...form, pesan: e.target.value })
              }
              className="p-3 border rounded-lg"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-6">
            Siap Bawa UMKM Anda Naik Level?
          </h3>

          <button
            onClick={() => navigate("/register")}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Daftar Sekarang
          </button>
        </div>
      </section>

    </div>
  )
}

export default Home