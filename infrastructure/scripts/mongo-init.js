// PropAI MongoDB initialisation script
db = db.getSiblingDB('propai_property_service');
db.createCollection('properties');
db.properties.createIndex({ 'address.city': 1 });
db.properties.createIndex({ 'address.postcode': 1 });
db.properties.createIndex({ 'type': 1, 'status': 1 });
db.properties.createIndex({ 'price': 1 });
db.properties.createIndex({ 'featured': 1 });
db.properties.createIndex({ 'agentId': 1 });

// Insert sample data
db.properties.insertMany([
  {
    title: '3 Bed Semi-Detached House',
    description: 'A beautifully presented three-bedroom semi-detached home in a highly desirable area.',
    type: 'SALE', category: 'SEMI_DETACHED',
    price: NumberDecimal('425000'), priceFrequency: null,
    address: { line1: '12 Oak Avenue', city: 'Manchester', postcode: 'M21 9JQ', country: 'UK' },
    details: { bedrooms: 3, bathrooms: 2, receptionRooms: 1, squareFootage: 1200, garden: true, parking: true, chainFree: true },
    imageUrls: ['https://picsum.photos/seed/prop1/800/500'],
    epcRating: 'B', tenure: 'Freehold',
    agentId: 'agent1', agentName: 'HomePro Estate Agents', agentPhone: '0161 123 4567',
    status: 'ACTIVE', featured: true, viewCount: 0, saveCount: 0,
    aiHighlights: ['Excellent school catchment', '5 min walk to Metrolink'],
    aiPriceScore: 85, listedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
  },
  {
    title: 'Modern 2 Bed Apartment',
    description: 'Stunning city-centre apartment with panoramic views and premium finishes.',
    type: 'RENT', category: 'FLAT',
    price: NumberDecimal('1800'), priceFrequency: 'PCM',
    address: { line1: 'Flat 4, Riverside Tower', city: 'London', postcode: 'E1 6RF', country: 'UK' },
    details: { bedrooms: 2, bathrooms: 1, receptionRooms: 1, squareFootage: 750, garden: false, parking: false },
    imageUrls: ['https://picsum.photos/seed/prop2/800/500'],
    epcRating: 'C', agentId: 'agent2', agentName: 'London Lettings', agentPhone: '0207 123 4567',
    status: 'ACTIVE', featured: false, viewCount: 0, saveCount: 0,
    aiHighlights: ['Price 8% below local average'],
    aiPriceScore: 78, listedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
  },
  {
    title: 'Spacious 4 Bed Detached House',
    description: 'Exceptional detached family home set in a quiet cul-de-sac with a large rear garden.',
    type: 'SALE', category: 'DETACHED',
    price: NumberDecimal('695000'), priceFrequency: null,
    address: { line1: '7 Elm Close', city: 'Bristol', postcode: 'BS9 1LS', country: 'UK' },
    details: { bedrooms: 4, bathrooms: 3, receptionRooms: 2, squareFootage: 2100, garden: true, parking: true, garage: true },
    imageUrls: ['https://picsum.photos/seed/prop3/800/500'],
    epcRating: 'A', tenure: 'Freehold',
    agentId: 'agent3', agentName: 'Bristol Prestige', agentPhone: '0117 123 4567',
    status: 'ACTIVE', featured: true, viewCount: 0, saveCount: 0,
    aiHighlights: ['Outstanding Ofsted schools nearby', 'Rare chain-free opportunity'],
    aiPriceScore: 91, listedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
  },
  {
    title: 'New Build 2 Bed Flat',
    description: 'Brand new apartment in a modern development with a 10-year NHBC warranty.',
    type: 'NEW_BUILD', category: 'FLAT',
    price: NumberDecimal('320000'), priceFrequency: null,
    address: { line1: 'Apartment 12, The Yard', city: 'Leeds', postcode: 'LS1 4DW', country: 'UK' },
    details: { bedrooms: 2, bathrooms: 1, receptionRooms: 1, squareFootage: 680, garden: false, parking: true },
    imageUrls: ['https://picsum.photos/seed/prop4/800/500'],
    epcRating: 'A', tenure: 'Leasehold', leaseYearsRemaining: 250,
    agentId: 'agent4', agentName: 'Taylor New Homes', agentPhone: '0113 123 4567',
    status: 'ACTIVE', featured: false, viewCount: 0, saveCount: 0,
    aiHighlights: ['Help to Buy eligible', 'Chain free, move-in ready'],
    aiPriceScore: 82, listedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
  }
]);

print('PropAI: MongoDB initialised with sample properties');
