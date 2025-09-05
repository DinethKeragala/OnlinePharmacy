import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';

const HomePage = () => {
  return (
    <div className="space-y-8">
      <HeroSection />
      <div className="container mx-auto px-4">
        <FeaturedProducts />
      </div>
    </div>
  );
};

export default HomePage;
