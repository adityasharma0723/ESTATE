const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Models
const User = require('./models/User');
const Property = require('./models/Property');

// ---- Config ----
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/estatex';

// Unsplash property images (free to use)
const propertyImages = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
    'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    'https://images.unsplash.com/photo-1602941525421-8f8b81d3edba?w=800&q=80',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?w=800&q=80',
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function getRandomImages() {
    const count = randBetween(2, 4);
    const shuffled = [...propertyImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Indian city data with approximate lat/lng & pincodes
const cities = [
    { city: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777, pincodes: ['400001', '400050', '400053', '400067', '400076'] },
    { city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209, pincodes: ['110001', '110017', '110025', '110048', '110070'] },
    { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, pincodes: ['560001', '560034', '560038', '560068', '560103'] },
    { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, pincodes: ['302001', '302012', '302017', '302020', '302033'] },
    { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, pincodes: ['411001', '411004', '411014', '411038', '411045'] },
    { city: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867, pincodes: ['500001', '500016', '500034', '500049', '500081'] },
    { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, pincodes: ['600001', '600017', '600028', '600040', '600086'] },
    { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, pincodes: ['700001', '700019', '700029', '700039', '700091'] },
    { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, pincodes: ['380001', '380006', '380015', '380051', '380058'] },
    { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, pincodes: ['226001', '226010', '226016', '226021', '226024'] },
    { city: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, pincodes: ['160001', '160009', '160017', '160019', '160036'] },
    { city: 'Goa', state: 'Goa', lat: 15.2993, lng: 74.124, pincodes: ['403001', '403110', '403501', '403516', '403601'] },
];

const propertyTypes = ['Apartment', 'Villa', 'House', 'Penthouse', 'Plot', 'Commercial'];
const statuses = ['For Sale', 'For Rent'];
const amenityPool = [
    'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Security',
    'Power Backup', 'Lift', 'Club House', 'Children\'s Play Area', 'CCTV',
    'Fire Safety', 'Intercom', 'Rain Water Harvesting', 'Vastu Compliant',
    'Modular Kitchen', 'Visitor Parking', 'Jogging Track', 'Indoor Games',
    'Wi-Fi', 'Air Conditioning', 'Furnished', 'Semi-Furnished',
];

const localities = {
    'Mumbai': ['Bandra West', 'Andheri East', 'Juhu', 'Powai', 'Worli', 'Lower Parel', 'Goregaon', 'Malad West', 'Thane West', 'Navi Mumbai'],
    'Delhi': ['Connaught Place', 'Hauz Khas', 'Dwarka', 'Greater Kailash', 'Vasant Kunj', 'Saket', 'Rohini', 'Janakpuri', 'Lajpat Nagar', 'Defence Colony'],
    'Bangalore': ['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Electronic City', 'Jayanagar', 'Marathahalli', 'Sarjapur Road', 'JP Nagar', 'Hebbal'],
    'Jaipur': ['C-Scheme', 'Vaishali Nagar', 'Malviya Nagar', 'Mansarovar', 'Tonk Road', 'Jagatpura', 'Ajmer Road', 'Sodala', 'Raja Park', 'Bani Park'],
    'Pune': ['Koregaon Park', 'Hinjewadi', 'Baner', 'Kharadi', 'Wakad', 'Viman Nagar', 'Hadapsar', 'Aundh', 'NIBM Road', 'Kothrud'],
    'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kondapur', 'Kukatpally', 'Secunderabad', 'Manikonda', 'Hitech City', 'Kompally'],
    'Chennai': ['Adyar', 'Anna Nagar', 'T Nagar', 'Velachery', 'OMR', 'ECR', 'Nungambakkam', 'Besant Nagar', 'Thiruvanmiyur', 'Porur'],
    'Kolkata': ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge', 'Alipore', 'Rajarhat', 'Dum Dum', 'EM Bypass', 'Tollygunge', 'Behala'],
    'Ahmedabad': ['Satellite', 'Prahlad Nagar', 'SG Highway', 'Bodakdev', 'Navrangpura', 'Vastrapur', 'Thaltej', 'Ambawadi', 'Paldi', 'Maninagar'],
    'Lucknow': ['Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Aliganj', 'Mahanagar', 'Vikas Nagar', 'Alambagh', 'Chinhat', 'Jankipuram', 'Sushant Golf City'],
    'Chandigarh': ['Sector 17', 'Sector 22', 'Sector 35', 'Sector 43', 'Sector 44', 'Manimajra', 'Panchkula', 'Mohali', 'Zirakpur', 'Kharar'],
    'Goa': ['Panaji', 'Calangute', 'Anjuna', 'Mapusa', 'Margao', 'Candolim', 'Vasco da Gama', 'Ponda', 'Dona Paula', 'Siolim'],
};

function generateDescription(type, locality, cityName, bed, bath, area) {
    const descriptions = [
        `Stunning ${type.toLowerCase()} in the heart of ${locality}, ${cityName}. This ${bed} BHK property spans ${area} sq.ft and features ${bath} modern bathrooms. Perfect for families looking for a premium lifestyle with access to top schools, hospitals, and shopping centers.`,
        `Premium ${type.toLowerCase()} located in the sought-after ${locality} area of ${cityName}. Spread across ${area} sq.ft with ${bed} spacious bedrooms and ${bath} bathrooms. Enjoy modern amenities, excellent connectivity, and a vibrant neighborhood.`,
        `Beautifully designed ${bed} BHK ${type.toLowerCase()} in ${locality}, ${cityName}. This ${area} sq.ft home offers ${bath} well-appointed bathrooms, contemporary interiors, and panoramic views. Ideal for professionals and growing families.`,
        `Luxurious ${type.toLowerCase()} available in the prestigious ${locality} neighborhood of ${cityName}. Features ${bed} bedrooms, ${bath} bathrooms, and ${area} sq.ft of elegant living space. Close to metro stations, IT parks, and entertainment hubs.`,
        `Elegant ${bed} BHK ${type.toLowerCase()} in prime ${locality}, ${cityName}. This ${area} sq.ft property boasts ${bath} bathrooms, high-quality finishes, and world-class amenities. A rare find in one of the city's most desirable locations.`,
    ];
    return pick(descriptions);
}

function generateTitle(type, locality, bed) {
    const titles = [
        `${bed} BHK ${type} in ${locality}`,
        `Premium ${bed} BHK ${type} — ${locality}`,
        `Luxurious ${type} in ${locality}`,
        `Modern ${bed} BHK ${type} at ${locality}`,
        `Spacious ${type} for Sale in ${locality}`,
        `Elegant ${bed} BHK ${type} — ${locality}`,
    ];
    return pick(titles);
}

function getPriceByTypeAndCity(type, cityName, status) {
    const baseMultiplier = {
        'Mumbai': 2.5, 'Delhi': 2.0, 'Bangalore': 1.8, 'Hyderabad': 1.4,
        'Pune': 1.3, 'Chennai': 1.5, 'Kolkata': 1.1, 'Jaipur': 1.0,
        'Ahmedabad': 1.1, 'Lucknow': 0.8, 'Chandigarh': 1.3, 'Goa': 1.6,
    };
    const typeBase = {
        'Apartment': 5000000, 'Villa': 15000000, 'House': 8000000,
        'Penthouse': 20000000, 'Plot': 3000000, 'Commercial': 10000000,
    };
    const mult = baseMultiplier[cityName] || 1;
    let price = Math.round((typeBase[type] * mult * (0.7 + Math.random() * 0.6)) / 100000) * 100000;
    if (status === 'For Rent') {
        price = Math.round(price * 0.004 / 1000) * 1000; // ~0.4% of sale price per month
    }
    return Math.max(price, status === 'For Rent' ? 8000 : 1500000);
}

function getArea(type) {
    const ranges = {
        'Apartment': [600, 2500], 'Villa': [2000, 6000], 'House': [1000, 4000],
        'Penthouse': [2500, 5000], 'Plot': [1000, 10000], 'Commercial': [500, 5000],
    };
    const [min, max] = ranges[type] || [500, 3000];
    return randBetween(min, max);
}

function getRandomAmenities() {
    const count = randBetween(4, 10);
    const shuffled = [...amenityPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// ---- MAIN ----
async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Property.deleteMany({});
        console.log('🗑  Cleared existing users and properties');

        // Create demo users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@estatex.com',
            password: 'password123',
            role: 'admin',
            phone: '+91-9876543210',
            bio: 'Platform administrator for EstateX.'
        });

        const agent1 = await User.create({
            name: 'Rajesh Sharma',
            email: 'agent@estatex.com',
            password: 'password123',
            role: 'agent',
            phone: '+91-9876543211',
            bio: 'Senior real estate agent with 10+ years of experience across metro cities. Specializing in luxury apartments and villas.'
        });

        const agent2 = await User.create({
            name: 'Priya Patel',
            email: 'priya@estatex.com',
            password: 'password123',
            role: 'agent',
            phone: '+91-9876543212',
            bio: 'Certified property consultant helping clients find their dream homes in South India.'
        });

        const agent3 = await User.create({
            name: 'Amit Verma',
            email: 'amit@estatex.com',
            password: 'password123',
            role: 'agent',
            phone: '+91-9876543213',
            bio: 'Real estate expert specializing in commercial properties and investment opportunities.'
        });

        const normalUser = await User.create({
            name: 'John Doe',
            email: 'user@estatex.com',
            password: 'password123',
            role: 'user',
            phone: '+91-9876543214',
        });

        const agents = [agent1, agent2, agent3];
        console.log('👤 Created 5 demo users');

        // Generate properties
        const properties = [];
        let featuredCount = 0;

        for (let i = 0; i < 60; i++) {
            const cityData = pick(cities);
            const type = pick(propertyTypes);
            const status = pick(statuses);
            const locList = localities[cityData.city] || [cityData.city + ' Central'];
            const locality = pick(locList);
            const bed = type === 'Plot' || type === 'Commercial' ? 0 : randBetween(1, 5);
            const bath = type === 'Plot' ? 0 : Math.max(1, bed - randBetween(0, 1));
            const area = getArea(type);
            const price = getPriceByTypeAndCity(type, cityData.city, status);
            const isFeatured = featuredCount < 8 && Math.random() > 0.6;
            if (isFeatured) featuredCount++;

            properties.push({
                title: generateTitle(type, locality, bed),
                description: generateDescription(type, locality, cityData.city, bed, bath, area),
                price,
                propertyType: type,
                bedrooms: bed,
                bathrooms: bath,
                area,
                amenities: getRandomAmenities(),
                address: `${randBetween(1, 500)}, ${locality}`,
                city: cityData.city,
                state: cityData.state,
                pincode: pick(cityData.pincodes),
                location: {
                    lat: cityData.lat + (Math.random() - 0.5) * 0.1,
                    lng: cityData.lng + (Math.random() - 0.5) * 0.1,
                },
                images: getRandomImages(),
                isFeatured,
                status,
                isApproved: true,
                agent: pick(agents)._id,
                views: randBetween(10, 5000),
            });
        }

        await Property.insertMany(properties);
        console.log(`🏠 Inserted ${properties.length} properties`);

        console.log('\n========================================');
        console.log('🎉 Seeding complete! Demo accounts:');
        console.log('========================================');
        console.log('Admin:  admin@estatex.com / password123');
        console.log('Agent:  agent@estatex.com / password123');
        console.log('Agent:  priya@estatex.com / password123');
        console.log('Agent:  amit@estatex.com  / password123');
        console.log('User:   user@estatex.com  / password123');
        console.log('========================================\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
