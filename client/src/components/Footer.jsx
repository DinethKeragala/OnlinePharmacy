import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold flex items-center mb-4">
              MediCare
              <span className="text-3xl">+</span>
            </Link>
            <p className="text-blue-100 mb-4">
              Your trusted online pharmacy for all your healthcare needs.
              We're committed to providing quality medications and
              exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-100 hover:text-white">Home</Link></li>
              <li><Link to="/about" className="text-blue-100 hover:text-white">About Us</Link></li>
              <li><Link to="/medicines" className="text-blue-100 hover:text-white">Medicines</Link></li>
              <li><Link to="/prescriptions" className="text-blue-100 hover:text-white">Prescriptions</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/prescription-refills" className="text-blue-100 hover:text-white">Prescription Refills</Link></li>
              <li><Link to="/delivery" className="text-blue-100 hover:text-white">Medication Delivery</Link></li>
              <li><Link to="/consultation" className="text-blue-100 hover:text-white">Online Consultation</Link></li>
              <li><Link to="/health-packages" className="text-blue-100 hover:text-white">Health Packages</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p>📞 (800) 555-0123</p>
              <p>✉️ support@medicare.com</p>
              <p>📍 123 Health Street, Medical Center, NY 20001</p>
            </div>
          </div>
        </div>

        {/* Social Media and Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-blue-500 pt-6">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-blue-100 hover:text-white">
              <FacebookIcon />
            </a>
            <a href="#" className="text-blue-100 hover:text-white">
              <TwitterIcon />
            </a>
            <a href="#" className="text-blue-100 hover:text-white">
              <InstagramIcon />
            </a>
          </div>

          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-l-full focus:outline-none text-gray-800"
            />
            <button className="bg-white text-blue-600 px-6 py-2 rounded-r-full font-semibold hover:bg-blue-50 transition">
              Subscribe
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-blue-100 text-sm mt-8">
          <p>© 2023 MediCare+. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/cookie" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
