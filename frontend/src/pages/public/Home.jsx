import Hero from '../../components/home/Hero';
import FeaturedListings from '../../components/home/FeaturedListings';
import Stats from '../../components/home/Stats';
import CTASection from '../../components/home/CTASection';

const Home = () => {
    return (
        <div>
            <Hero />
            <FeaturedListings />
            <Stats />
            <CTASection />
        </div>
    );
};

export default Home;
