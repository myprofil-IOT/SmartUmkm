import { useContext } from "react"
import { CartContext } from "../context/CartContext"

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext)

  const total = cart.reduce((acc, item) => acc + item.price, 0)

  return (
    <div>
      <h2>Cart</h2>

      {cart.length === 0 && <p>Cart kosong</p>}

      {cart.map((item, index) => (
        <div key={index}>
          <p>{item.name} - Rp {item.price}</p>
          <button onClick={() => removeFromCart(index)}>Hapus</button>
        </div>
      ))}

      <h3>Total: Rp {total}</h3>
    </div>
  )
}