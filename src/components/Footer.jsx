function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-20">
      <div className="container mx-auto px-6 text-center">

        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          SmartUMKM
        </h2>

        <p className="mb-6 text-gray-400">
          Solusi digital untuk membantu UMKM Indonesia naik kelas dan go digital.
        </p>

        <div className="flex justify-center gap-6 mb-6">
          <a href="#" className="hover:text-blue-400">Home</a>
          <a href="#" className="hover:text-blue-400">About</a>
          <a href="#" className="hover:text-blue-400">Features</a>
          <a href="#" className="hover:text-blue-400">Contact</a>
        </div>

        <p className="text-sm text-gray-500">
          © 2026 SmartUMKM. All rights reserved.
        </p>

      </div>
    </footer>
  )
}

export default Footer