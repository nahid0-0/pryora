import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer id="about">
      <div className="foot">
        <div className="about">
          <div className="mark">PRYORA</div>
          <p>Jewellery designed in small batches and finished by hand. Made to be worn for decades.</p>
        </div>
        <div>
          <h4>ABOUT US</h4>
          <ul>
            <li><Link to="/#about">Our story</Link></li>
            <li><Link to="/#about">The craft</Link></li>
            <li><Link to="/#about">Materials</Link></li>
            <li><Link to="/#about">Journal</Link></li>
          </ul>
        </div>
        <div>
          <h4>SHOP</h4>
          <ul>
            <li><Link to="/shop?type=rings">Rings</Link></li>
            <li><Link to="/shop?type=necklaces">Necklaces</Link></li>
            <li><Link to="/shop?type=bangles">Bangles</Link></li>
            <li><Link to="/preorder">Pre-order</Link></li>
          </ul>
        </div>
        <div>
          <h4>HELP</h4>
          <ul>
            <li><Link to="/preorder#faq">Shipping</Link></li>
            <li><Link to="/preorder#faq">Returns</Link></li>
            <li><Link to="/shop?type=rings">Ring sizes</Link></li>
            <li><Link to="/#about">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="legal">
        <span>&copy; {new Date().getFullYear()} Pryora. All rights reserved.</span>
        <span>Delivery in 2 to 4 days. Cash on delivery available.</span>
      </div>
    </footer>
  )
}
