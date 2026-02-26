import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeaturedProperties } from '../../store/slices/propertySlice';
import PropertyCard from '../property/PropertyCard';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const FeaturedListings = () => {
    const dispatch = useDispatch();
    const { featured } = useSelector((state) => state.properties);

    useEffect(() => {
        dispatch(fetchFeaturedProperties());
    }, [dispatch]);

    // Show placeholder cards if no featured listings
    const displayProperties = featured.length > 0 ? featured : [
        { _id: '1', title: 'Modern Downtown Apartment', price: 4500000, city: 'Mumbai', state: 'MH', propertyType: 'Apartment', bedrooms: 3, bathrooms: 2, area: 1200, status: 'For Sale', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'] },
        { _id: '2', title: 'Luxury Villa with Pool', price: 15000000, city: 'Bangalore', state: 'KA', propertyType: 'Villa', bedrooms: 5, bathrooms: 4, area: 3500, status: 'For Sale', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600'], isFeatured: true },
        { _id: '3', title: 'Riverside Studio Flat', price: 18000, city: 'Pune', state: 'MH', propertyType: 'Apartment', bedrooms: 1, bathrooms: 1, area: 550, status: 'For Rent', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'] },
        { _id: '4', title: 'Premium Penthouse Suite', price: 32000000, city: 'Delhi', state: 'DL', propertyType: 'Penthouse', bedrooms: 4, bathrooms: 3, area: 2800, status: 'For Sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600'], isFeatured: true },
        { _id: '5', title: 'Green Valley Plot', price: 2500000, city: 'Hyderabad', state: 'TS', propertyType: 'Plot', bedrooms: 0, bathrooms: 0, area: 2400, status: 'For Sale', images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600'] },
        { _id: '6', title: 'Commercial Office Space', price: 55000, city: 'Chennai', state: 'TN', propertyType: 'Commercial', bedrooms: 0, bathrooms: 2, area: 1800, status: 'For Rent', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600'] },
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Curated for You</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
                            Featured Properties
                        </h2>
                        <p className="text-gray-500 dark:text-dark-text mt-3 max-w-lg">
                            Hand-picked premium listings from our verified agents across India&apos;s top cities.
                        </p>
                    </div>
                    <Link
                        to="/properties"
                        className="hidden sm:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
                    >
                        View All <HiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayProperties.map((property) => (
                        <PropertyCard key={property._id} property={property} />
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link
                        to="/properties"
                        className="inline-flex items-center gap-2 text-primary font-semibold"
                    >
                        View All Properties <HiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedListings;
