import { Link, Outlet, Route, Routes } from 'react-router-dom'
import { BagProvider } from './bag/BagContext'
import BagDrawer from './components/BagDrawer'
import Footer from './components/Footer'
import Nav from './components/Nav'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import Preorder from './pages/Preorder'
import Product from './pages/Product'
import Shop from './pages/Shop'

function Layout() {
  return (
    <>
      <ScrollManager />
      <Nav />
      <Outlet />
      <Footer />
      <BagDrawer />
    </>
  )
}

function NotFound() {
  return (
    <main className="page-product"><div className="wrap">
      <div className="missing">
        <h1>This page does not exist</h1>
        <p>The link may be old or mistyped.</p>
        <Link to="/">Back to the home page</Link>
      </div>
    </div></main>
  )
}

export default function App() {
  return (
    <BagProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="preorder" element={<Preorder />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BagProvider>
  )
}
