import Hero from '../../components/home/Hero';
import FeaturedListings from '../../components/home/FeaturedListings';
import Stats from '../../components/home/Stats';
import Testimonials from '../../components/home/Testimonials';
import CTASection from '../../components/home/CTASection';

const Home = () => {
    return (
        <div>
            <Hero />
            <FeaturedListings />
            <Stats />
            <Testimonials />
            <CTASection />
        </div>
    );
};

export default Home;
