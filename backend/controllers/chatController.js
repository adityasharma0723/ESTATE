const Chat = require('../models/Chat');
const Property = require('../models/Property');

// @desc    Get user's chats
// @route   GET /api/chat
exports.getChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({ participants: req.user._id })
            .populate('participants', 'name avatar')
            .populate('property', 'title images')
            .sort('-updatedAt');

        res.json({ success: true, chats });
    } catch (error) {
        next(error);
    }
};

// @desc    Get or create chat for a property
// @route   POST /api/chat/:propertyId
exports.getOrCreateChat = async (req, res, next) => {
    try {
        const { agentId } = req.body;

        // Look for existing chat
        let chat = await Chat.findOne({
            property: req.params.propertyId,
            participants: { $all: [req.user._id, agentId] },
        })
            .populate('participants', 'name avatar')
            .populate('property', 'title images');

        if (!chat) {
            chat = await Chat.create({
                participants: [req.user._id, agentId],
                property: req.params.propertyId,
                messages: [],
            });
            await chat.populate('participants', 'name avatar');
            await chat.populate('property', 'title images');
        }

        res.json({ success: true, chat });
    } catch (error) {
        next(error);
    }
};

// ---- Auto-reply logic ----
function generateAutoReply(userMessage, property, agentName) {
    const msg = userMessage.toLowerCase();

    // Greetings
    if (msg.match(/\b(hi|hello|hey|namaste|good morning|good evening)\b/)) {
        const greetings = [
            `Hello! I'm ${agentName}. Thank you for your interest${property ? ` in "${property.title}"` : ''}. How can I help you today?`,
            `Hi there! Welcome to EstateX. I'd be happy to assist you${property ? ` with "${property.title}"` : ''}. What would you like to know?`,
            `Namaste! Thank you for reaching out. I'm here to help you find your perfect property. What questions do you have?`,
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Price related
    if (msg.match(/\b(price|cost|rate|budget|how much|afford|emi|loan|down payment)\b/)) {
        if (property) {
            const priceStr = property.price >= 10000000
                ? `₹${(property.price / 10000000).toFixed(2)} Cr`
                : property.price >= 100000
                    ? `₹${(property.price / 100000).toFixed(2)} L`
                    : `₹${property.price.toLocaleString('en-IN')}`;
            return `The listed price for "${property.title}" is ${priceStr}${property.status === 'For Rent' ? '/month' : ''}. This is negotiable based on payment terms. I can also help you explore EMI options with our partnered banks. Would you like me to arrange a detailed cost breakdown?`;
        }
        return `I'd be happy to discuss pricing details. Could you share your budget range so I can find properties that match? We have options from ₹15 L to ₹25 Cr across different cities.`;
    }

    // Location / area
    if (msg.match(/\b(location|area|where|address|nearby|distance|metro|connectivity|school|hospital|market)\b/)) {
        if (property) {
            return `"${property.title}" is located in ${property.city}, ${property.state}. The area has excellent connectivity with nearby metro stations, hospitals, schools, and shopping centers. The neighborhood is well-developed with 24/7 security. Would you like me to share a detailed location map?`;
        }
        return `I can help you find properties in your preferred location! Which city or area are you interested in? We have listings across Mumbai, Delhi, Bangalore, Jaipur, Pune, Hyderabad, Chennai, Kolkata, and more.`;
    }

    // Visit / schedule
    if (msg.match(/\b(visit|see|show|schedule|appointment|tour|inspect|view|come|meet)\b/)) {
        return `Absolutely! I can schedule a site visit for you at your convenience. We offer both in-person tours and virtual video walkthroughs. What day and time works best for you? I'm available on weekdays from 10 AM to 7 PM and weekends from 11 AM to 5 PM.`;
    }

    // Size / rooms / amenities
    if (msg.match(/\b(bedroom|bathroom|bhk|size|area|sqft|square|amenit|parking|gym|pool|swimming|garden|furnished)\b/)) {
        if (property) {
            const amenityStr = property.amenities?.slice(0, 5).join(', ') || 'modern amenities';
            return `"${property.title}" offers ${property.bedrooms > 0 ? property.bedrooms + ' bedrooms, ' : ''}${property.bathrooms > 0 ? property.bathrooms + ' bathrooms, ' : ''}and ${property.area} sq.ft of space. Key amenities include: ${amenityStr}. Would you like more details about any specific feature?`;
        }
        return `We have properties ranging from 1 BHK apartments to 5 BHK villas with premium amenities like swimming pool, gym, parking, and more. What configuration are you looking for?`;
    }

    // Document / legal
    if (msg.match(/\b(document|paper|legal|registration|stamp|approval|rera|possession|ready|under construction)\b/)) {
        return `All our listed properties come with verified legal documentation and RERA compliance. I can share the complete document checklist including: title deed, encumbrance certificate, building plan approval, and possession certificate. Would you like me to send these documents for review?`;
    }

    // Negotiation
    if (msg.match(/\b(negotiat|discount|offer|deal|best price|lower|reduce|bargain)\b/)) {
        return `I understand you're looking for the best deal! The current price is competitive for this area, but there's always room for discussion based on payment terms and timeline. If you're a serious buyer, I can arrange a meeting with the owner to discuss a mutually beneficial price. Shall I set that up?`;
    }

    // Comparison / other properties
    if (msg.match(/\b(other|similar|compare|alternative|more options|different|another|suggest)\b/)) {
        return `Great question! I have several similar properties in my portfolio that might interest you. I can send you a curated list of comparable options with side-by-side comparisons of price, area, and amenities. Would you like me to prepare that for you?`;
    }

    // Thank you / bye
    if (msg.match(/\b(thank|thanks|bye|goodbye|great|perfect|ok|okay|sure|nice)\b/)) {
        return `You're welcome! Feel free to reach out anytime you have questions. I'm here to make your property search as smooth as possible. You can also explore more listings on our properties page. Have a wonderful day! 🏡`;
    }

    // Interest / general
    if (msg.match(/\b(interest|want|looking|buy|rent|purchase|invest|book)\b/)) {
        if (property) {
            return `Great to hear you're interested${property ? ` in "${property.title}"` : ''}! This is an excellent choice. Here's what I'd recommend as next steps:\n\n1. Schedule a site visit\n2. Review the property documents\n3. Discuss financing options\n\nWhich of these would you like to start with?`;
        }
        return `I'd love to help you find the perfect property! Could you tell me:\n\n1. Preferred city/location?\n2. Budget range?\n3. Property type (Apartment, Villa, House)?\n4. Number of bedrooms needed?\n\nThis will help me shortlist the best options for you.`;
    }

    // Default fallback
    const fallbacks = [
        `Thank you for your message! I'd be happy to help you with your property search. Could you tell me more about what you're looking for — preferred city, budget, or property type?`,
        `I appreciate your interest! To serve you better, could you share your requirements? I can help with pricing, scheduling visits, property comparisons, or any other queries.`,
        `Thanks for reaching out! I specialize in properties across major Indian cities. Whether you're looking to buy, rent, or invest, I'm here to guide you. What specific information can I provide?`,
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// @desc    AI Property Assistant
// @route   POST /api/chat/ai-assistant
exports.aiAssistant = async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Message is required' });

        const msg = text.toLowerCase();
        let reply = '';

        // Extract search criteria from user message
        const cityPatterns = {
            'mumbai': 'Mumbai', 'delhi': 'Delhi', 'bangalore': 'Bangalore', 'bengaluru': 'Bangalore',
            'hyderabad': 'Hyderabad', 'pune': 'Pune', 'chennai': 'Chennai', 'kolkata': 'Kolkata',
            'jaipur': 'Jaipur', 'ahmedabad': 'Ahmedabad', 'lucknow': 'Lucknow', 'chandigarh': 'Chandigarh', 'goa': 'Goa',
        };
        const typePatterns = {
            'apartment': 'Apartment', 'flat': 'Apartment', 'villa': 'Villa', 'house': 'House',
            'penthouse': 'Penthouse', 'plot': 'Plot', 'land': 'Plot', 'commercial': 'Commercial',
            'office': 'Commercial', 'shop': 'Commercial',
        };

        let detectedCity = null;
        let detectedType = null;
        let detectedBedrooms = null;
        let detectedStatus = null;
        let maxBudget = null;

        // Detect city
        for (const [pattern, city] of Object.entries(cityPatterns)) {
            if (msg.includes(pattern)) { detectedCity = city; break; }
        }
        // Detect type
        for (const [pattern, type] of Object.entries(typePatterns)) {
            if (msg.includes(pattern)) { detectedType = type; break; }
        }
        // Detect bedrooms
        const bedroomMatch = msg.match(/(\d)\s*(?:bhk|bedroom|bed)/);
        if (bedroomMatch) detectedBedrooms = parseInt(bedroomMatch[1]);
        // Detect status
        if (msg.match(/\b(rent|rental|lease)\b/)) detectedStatus = 'For Rent';
        if (msg.match(/\b(buy|purchase|sale|sell)\b/)) detectedStatus = 'For Sale';
        // Detect budget
        const crMatch = msg.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore)/);
        const lMatch = msg.match(/(\d+(?:\.\d+)?)\s*(?:l|lakh|lac)/);
        const kMatch = msg.match(/(\d+)\s*(?:k|thousand)/);
        if (crMatch) maxBudget = parseFloat(crMatch[1]) * 10000000;
        else if (lMatch) maxBudget = parseFloat(lMatch[1]) * 100000;
        else if (kMatch) maxBudget = parseInt(kMatch[1]) * 1000;

        const needsSearch = detectedCity || detectedType || detectedBedrooms || detectedStatus || maxBudget;

        if (needsSearch) {
            // Build query
            const query = { isApproved: true };
            if (detectedCity) query.city = detectedCity;
            if (detectedType) query.propertyType = detectedType;
            if (detectedBedrooms) query.bedrooms = { $gte: detectedBedrooms };
            if (detectedStatus) query.status = detectedStatus;
            if (maxBudget) query.price = { $lte: maxBudget };

            const properties = await Property.find(query).limit(5).sort('-isFeatured -views');

            if (properties.length > 0) {
                const listings = properties.map((p, i) => {
                    const priceStr = p.price >= 10000000
                        ? `₹${(p.price / 10000000).toFixed(2)} Cr`
                        : p.price >= 100000
                            ? `₹${(p.price / 100000).toFixed(2)} L`
                            : `₹${p.price.toLocaleString('en-IN')}`;
                    return `${i + 1}. **${p.title}** — ${priceStr}${p.status === 'For Rent' ? '/mo' : ''}\n   📍 ${p.city}, ${p.state} | ${p.bedrooms > 0 ? p.bedrooms + ' BHK | ' : ''}${p.area} sqft\n   🔗 /properties/${p._id}`;
                }).join('\n\n');

                const filters = [];
                if (detectedCity) filters.push(detectedCity);
                if (detectedType) filters.push(detectedType);
                if (detectedBedrooms) filters.push(`${detectedBedrooms}+ BHK`);
                if (detectedStatus) filters.push(detectedStatus);
                if (maxBudget) {
                    const budgetStr = maxBudget >= 10000000 ? `₹${(maxBudget / 10000000).toFixed(1)} Cr` : `₹${(maxBudget / 100000).toFixed(0)} L`;
                    filters.push(`under ${budgetStr}`);
                }

                reply = `Great news! 🎉 I found ${properties.length} propert${properties.length > 1 ? 'ies' : 'y'} matching your criteria${filters.length ? ' (' + filters.join(', ') + ')' : ''}:\n\n${listings}\n\nWould you like more details about any of these? I can also help you narrow down by budget, bedrooms, or area.`;
            } else {
                reply = `I searched our database but couldn't find properties matching all your criteria. Try broadening your search — for example, remove the budget filter or try a different city. Here are our most popular cities: Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Jaipur, and Goa.`;
            }
        }
        // Greetings
        else if (msg.match(/\b(hi|hello|hey|namaste|good morning|good evening|howdy)\b/)) {
            reply = `Hello! 👋 I'm the EstateX AI Assistant. I can help you:\n\n🔍 **Search properties** — Try: "Show me apartments in Mumbai"\n💰 **Filter by budget** — Try: "Villas under 2 Cr"\n🏠 **Find by type** — Try: "3 BHK flats for rent in Pune"\n📊 **Get market insights** — Ask about any city\n\nHow can I help you today?`;
        }
        // Help
        else if (msg.match(/\b(help|what can you do|features|guide|how to)\b/)) {
            reply = `Here's everything I can help with! 🏡\n\n**🔍 Property Search**\n• "Show me apartments in Bangalore"\n• "2 BHK flats for rent in Delhi"\n• "Villas under 1.5 Cr in Goa"\n\n**💡 Smart Filters**\n• By city: Mumbai, Delhi, Pune, etc.\n• By type: Apartment, Villa, House, Plot, Commercial\n• By budget: "under 50 lakh", "below 2 Cr"\n• By bedrooms: "3 BHK", "4 bedroom"\n• By status: "for rent", "for sale"\n\n**📋 General Info**\n• Market trends & advice\n• Home buying tips\n• Document guidance\n\nJust type your query naturally!`;
        }
        // Market / investment advice
        else if (msg.match(/\b(market|trend|invest|growth|roi|appreciation|future)\b/)) {
            reply = `📊 **Real Estate Market Insights 2024**\n\n🔥 **Top cities for investment:**\n• Bangalore — Strong IT demand, 8-12% YoY appreciation\n• Hyderabad — Emerging tech hub, affordable entry points\n• Pune — Growing infrastructure, excellent connectivity\n• Goa — Booming vacation/rental market\n\n💡 **Tips:**\n• Look for RERA-registered properties for legal safety\n• Areas near upcoming metro lines show 15-20% appreciation\n• Rental yields are highest for 2-3 BHK apartments\n\nWant me to search properties in any of these cities?`;
        }
        // Documents / legal
        else if (msg.match(/\b(document|legal|rera|registration|stamp|process|how to buy)\b/)) {
            reply = `📋 **Home Buying Document Checklist:**\n\n✅ **Before Purchase:**\n• Title Deed verification\n• Encumbrance Certificate (last 15 years)\n• RERA Registration number\n• Building Plan Approval\n• Khata Certificate\n\n✅ **During Purchase:**\n• Sale Agreement\n• Stamp Duty Payment (varies by state: 5-7%)\n• Registration at Sub-Registrar office\n\n✅ **After Purchase:**\n• Mutation of property\n• Possession Certificate\n• Society NOC (for apartments)\n\nAll properties on EstateX are pre-verified and RERA compliant. Would you like to browse properties?`;
        }
        // EMI / loan
        else if (msg.match(/\b(emi|loan|mortgage|finance|bank|interest|home loan)\b/)) {
            reply = `🏦 **Home Loan Quick Guide:**\n\n**Current Interest Rates (approx):**\n• SBI: 8.5% onwards\n• HDFC: 8.7% onwards\n• ICICI: 8.75% onwards\n\n**EMI Examples (20-year tenure):**\n• ₹50 Lakh → ~₹43,000/month\n• ₹1 Crore → ~₹86,000/month\n• ₹2 Crore → ~₹1,72,000/month\n\n**Eligibility Tips:**\n• Maximum loan: 75-90% of property value\n• Income criteria: EMI should be < 50% of income\n• Good credit score (750+) helps get better rates\n\nWant me to find properties in a specific budget range?`;
        }
        // Fallback
        else {
            reply = `Thanks for your message! I'm your AI property assistant. Here's how I can help:\n\n🔍 **Search properties** — "Show me 2 BHK in Mumbai"\n💰 **Budget search** — "Apartments under 80 lakh in Pune"\n🏡 **By type** — "Villas for sale in Goa"\n📊 **Market info** — "Investment trends"\n📋 **Legal help** — "Documents needed to buy a home"\n\nJust describe what you're looking for!`;
        }

        res.json({ success: true, reply });
    } catch (error) {
        next(error);
    }
};

// @desc    Send message in chat
// @route   POST /api/chat/:chatId/message
exports.sendMessage = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.chatId).populate('property');
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        if (!chat.participants.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not a participant' });
        }

        // Save user message
        const message = {
            sender: req.user._id,
            text: req.body.text,
            timestamp: new Date(),
        };

        chat.messages.push(message);
        chat.lastMessage = req.body.text;

        // Determine the other participant (the agent)
        const agentId = chat.participants.find(
            (p) => p.toString() !== req.user._id.toString()
        );

        // Generate auto-reply from the agent
        const agentUser = await require('../models/User').findById(agentId);
        const agentName = agentUser?.name || 'Agent';
        const replyText = generateAutoReply(req.body.text, chat.property, agentName);

        const autoReply = {
            sender: agentId,
            text: replyText,
            timestamp: new Date(Date.now() + 1500), // slight delay timestamp
        };

        chat.messages.push(autoReply);
        chat.lastMessage = replyText;
        await chat.save();

        // Get the saved messages with their _ids
        const savedUserMsg = chat.messages[chat.messages.length - 2];
        const savedAutoReply = chat.messages[chat.messages.length - 1];

        res.json({ success: true, message: savedUserMsg, autoReply: savedAutoReply });
    } catch (error) {
        next(error);
    }
};
