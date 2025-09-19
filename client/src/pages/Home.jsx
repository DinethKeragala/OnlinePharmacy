import Hero from '../components/hero/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Services from '../components/home/Services';
import Testimonials from '../components/home/Testimonials';

const Home = () => {
  return (
    <div>
      <Hero />
  <FeaturedProducts />
  <Services />
  <Testimonials />
    </div>
  );
};

export default Home;