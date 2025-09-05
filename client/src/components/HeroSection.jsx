import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';

const HeroSection = () => {
  return (
    <div className="bg-blue-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Health, Delivered
            </h1>
            <p className="text-lg mb-8">
              Get your medications and health products delivered
              to your doorstep with our safe and reliable online
              pharmacy service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/medicines"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
              >
                Shop Medicines
              </Link>
              <Link
                to="/prescriptions"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
              >
                Upload Prescription
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="flex items-center">
                <LocalShippingIcon className="mr-2" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center">
                <AccessTimeIcon className="mr-2" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center">
                <SecurityIcon className="mr-2" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden md:block">
            <img
              src="/images/hero-medicines.jpg"
              alt="Various medicines"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
