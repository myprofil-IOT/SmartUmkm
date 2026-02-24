import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Checkout() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const [method, setMethod] = useState("bank")
  const [qrisTime, setQrisTime] = useState(60)
  const [qrisDone, setQrisDone] = useState(false)

  /* ================= LOAD ================= */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders")) || []
    setOrders(saved)
  }, [])

  /* ================= SAVE ================= */
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  /* ================= AUTO STATUS UPDATE + AUTO DELETE ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev
          .map((order) => {
            const now = Date.now()
            const diff = now - order.time

            if (order.status === "paid" && diff > 2 * 60 * 1000) {
              return { ...order, status: "process", time: now }
            }

            if (order.status === "process" && diff > 2 * 60 * 1000) {
              return { ...order, status: "delivered", time: now }
            }

            return order
          })
          .filter((order) => {
            if (order.status === "delivered") {
              const now = Date.now()
              return now - order.time < 10000 // auto hapus 10 detik setelah delivered
            }
            return true
          })
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  /* ================= QRIS TIMER ================= */
  useEffect(() => {
    if (method !== "qris" || !showPayment) return

    setQrisTime(60)
    setQrisDone(false)

    const timer = setInterval(() => {
      setQrisTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setQrisDone(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [method, showPayment])

  /* ================= CREATE ORDER ================= */
  const handleCreateOrder = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    if (cart.length === 0) return alert("Keranjang kosong!")

    const newOrders = cart.map((item) => ({
      ...item,
      id: Date.now() + Math.random(),
      status: "unpaid",
      time: Date.now(),
    }))

    setOrders([...orders, ...newOrders])
    localStorage.removeItem("cart")
  }

  const handlePay = (order) => {
    setSelectedOrder(order)
    setMethod("bank")
    setShowPayment(true)
  }

  const confirmPayment = () => {
    const updated = orders.map((o) =>
      o.id === selectedOrder.id
        ? { ...o, status: "paid", time: Date.now() }
        : o
    )

    setOrders(updated)
    setShowPayment(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  /* ================= PROGRESS BAR ================= */
  const getProgress = (status) => {
    if (status === "unpaid") return 25
    if (status === "paid") return 50
    if (status === "process") return 75
    if (status === "delivered") return 100
    return 0
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-10">

      <button
        onClick={() => navigate("/shop")}
        className="mb-6 text-blue-600"
      >
        ← Kembali ke Shop
      </button>

      <h1 className="text-3xl font-bold mb-8">Checkout PRO</h1>

      <button
        onClick={handleCreateOrder}
        className="mb-10 bg-green-600 text-white px-6 py-2 rounded"
      >
        Buat Order dari Keranjang
      </button>

      {/* ================= 4 COLUMN LAYOUT ================= */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        {orders.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition"
          >
            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
            <p>Qty: {item.qty}</p>
            <p className="font-bold mb-3">
              Rp{(item.price * item.qty).toLocaleString("id-ID")}
            </p>

            {/* PROGRESS BAR */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-700"
                style={{ width: `${getProgress(item.status)}%` }}
              ></div>
            </div>

            <p className="text-sm capitalize mb-3">
              Status: {item.status}
            </p>

            {item.status === "unpaid" && (
              <button
                onClick={() => handlePay(item)}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Bayar
              </button>
            )}
          </div>
        ))}

      </div>

      {/* ================= PAYMENT POPUP ================= */}
      {showPayment && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-[420px]">

            <h2 className="text-xl font-bold mb-4">Pembayaran</h2>

            <p>{selectedOrder.name}</p>
            <p className="mb-4 font-semibold">
              Rp{(selectedOrder.price * selectedOrder.qty).toLocaleString("id-ID")}
            </p>

            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            >
              <option value="bank">Transfer Bank</option>
              <option value="qris">QRIS</option>
            </select>

            {method === "bank" && (
              <>
                <div className="bg-gray-100 p-4 rounded mb-4">
                  <p className="font-semibold">BCA</p>
                  <p>1234567890</p>
                  <p>a.n UMKM Smart</p>
                </div>

                <button
                  onClick={confirmPayment}
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Konfirmasi Transfer
                </button>
              </>
            )}

            {method === "qris" && (
              <>
                <div className="text-center mb-4">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UMKM-PAYMENT"
                    alt="QRIS"
                    className="mx-auto mb-3"
                  />
                  {!qrisDone && (
                    <p className="text-red-500">
                      Sisa waktu: {qrisTime} detik
                    </p>
                  )}
                </div>

                {qrisDone && (
                  <button
                    onClick={confirmPayment}
                    className="w-full bg-green-600 text-white py-2 rounded"
                  >
                    Selesai QRIS
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-3 text-gray-500"
            >
              Tutup
            </button>

          </div>
        </div>
      )}

      {/* ================= SUCCESS POPUP ================= */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center w-80">
            <h2 className="text-green-600 font-bold text-lg mb-2">
              Pembayaran Berhasil
            </h2>
            <p>Barang sedang diproses 🚚</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default Checkout