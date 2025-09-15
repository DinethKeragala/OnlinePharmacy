import { Link } from 'react-router-dom';
import { FaTruck, FaHeadset, FaLock } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Your Health,<br />Delivered
            </h1>
            <p className="text-xl text-blue-100">
              Get your medications and health products delivered
              to your doorstep with our safe and reliable online
              pharmacy service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/medicines" 
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors text-center"
              >
                Shop Medicines
              </Link>
              <Link 
                to="/prescriptions"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                Upload Prescription
              </Link>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-2">
                <FaTruck className="text-2xl" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <FaHeadset className="text-2xl" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <FaLock className="text-2xl" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-full">
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIRzCC-rYiqc7KmGdz071CZuHZoHKpAcMo1w&s"
                alt="Various medicines and health products"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;