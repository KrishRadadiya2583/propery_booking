const sampleListings =[
  {
    "title": "Modern Farm House",
    "description": "Peaceful farmhouse surrounded by green fields with sustainable energy features.",
    "image": [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
      "https://images.unsplash.com/photo-1449156001437-3a16d1daae39",
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae",
      "https://images.unsplash.com/photo-1414438992182-69e404046f80"
    ],
    "price": 2500000,
    "location": "Anand, Gujarat",
    "country": "India"
  },
  {
    "title": "Royal Heritage Palace",
    "description": "A restored heritage property featuring intricate stone carvings and grand courtyards.",
    "image": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      "https://images.unsplash.com/photo-1512914890251-2f96a9b0bbe2"
    ],
    "price": 85000000,
    "location": "Udaipur, Rajasthan",
    "country": "India"
  },
  {
    "title": "Coastal Cliff Villa",
    "description": "Modern glass-walled villa overlooking the Arabian Sea with a private infinity pool.",
    "image": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324"
    ],
    "price": 120000000,
    "location": "Alibaug, Maharashtra",
    "country": "India"
  },
  {
    "title": "The Himalayan Log Cabin",
    "description": "Rustic yet luxurious log cabin nestled in pine forests with snow peak views.",
    "image": [
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c",
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae",
      "https://images.unsplash.com/photo-1444858291040-58f756a3bcd6",
      "https://images.unsplash.com/photo-1414438992182-69e404046f80",
      "https://images.unsplash.com/photo-1505245208761-baad72351bb5"
    ],
    "price": 35000000,
    "location": "Manali, Himachal Pradesh",
    "country": "India"
  },
  {
    "title": "Urban Sky Penthouse",
    "description": "Ultra-modern penthouse with smart home automation and a private rooftop garden.",
    "image": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.unsplash.com/photo-1502672023488-70e25813efdf",
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a"
    ],
    "price": 95000000,
    "location": "Gurgaon, Haryana",
    "country": "India"
  },
  {
    "title": "Eco-Luxury Tea Estate",
    "description": "Sprawling tea garden estate with a colonial-style bungalow and organic farm.",
    "image": [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      "https://images.unsplash.com/photo-1449156001437-3a16d1daae39",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6"
    ],
    "price": 55000000,
    "location": "Munnar, Kerala",
    "country": "India"
  },
  {
    "title": "Desert Oasis Manor",
    "description": "Contemporary desert architecture featuring sand-toned finishes and a sunken fire pit.",
    "image": [
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf",
      "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2"
    ],
    "price": 42000000,
    "location": "Jodhpur, Rajasthan",
    "country": "India"
  },
  {
    "title": "Mediterranean Beach House",
    "description": "White-washed luxury home steps away from the turquoise waters of the Mediterranean.",
    "image": [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739"
    ],
    "price": 2800000,
    "location": "Santorini",
    "country": "Greece"
  },
  {
    "title": "The Oakwood Manor",
    "description": "Grand English-style manor with vast lawns and an equestrian stable.",
    "image": [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266",
      "https://images.unsplash.com/photo-1449156001437-3a16d1daae39",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae"
    ],
    "price": 150000000,
    "location": "Ooty, Tamil Nadu",
    "country": "India"
  },
  {
    "title": "Minimalist Zen Retreat",
    "description": "Architecture focused on light, space, and tranquility with a private meditation garden.",
    "image": [
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266",
      "https://images.unsplash.com/photo-1502672023488-70e25813efdf",
      "https://images.unsplash.com/photo-1513584684374-8bdb7483fe8f",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e"
    ],
    "price": 55000000,
    "location": "Auroville, Pondicherry",
    "country": "India"
  },
  {
    "title": "Vibrant Boho Villa",
    "description": "Eclectic design with colorful mosaics and a tropical pool area.",
    "image": [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1502672023488-70e25813efdf"
    ],
    "price": 38000000,
    "location": "Goa",
    "country": "India"
  },
  {
    "title": "Lakeside Glass Pavilion",
    "description": "A structural masterpiece made of glass and steel with panoramic lake views.",
    "image": [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.unsplash.com/photo-1502672023488-70e25813efdf"
    ],
    "price": 110000000,
    "location": "Lavasa, Maharashtra",
    "country": "India"
  },
  {
    "title": "Forest Edge Lodge",
    "description": "Luxury lodge located on the border of a national park, perfect for wildlife enthusiasts.",
    "image": [
      "https://images.unsplash.com/photo-1464146072230-91cabc968266",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      "https://images.unsplash.com/photo-1449156001437-3a16d1daae39",
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae",
      "https://images.unsplash.com/photo-1505245208761-baad72351bb5",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c"
    ],
    "price": 29000000,
    "location": "Kanha, Madhya Pradesh",
    "country": "India"
  },
  {
    "title": "Industrial Loft Conversion",
    "description": "High ceilings, exposed brickwork, and large factory windows in the heart of the city.",
    "image": [
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.unsplash.com/photo-1502672023488-70e25813efdf",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      "https://images.unsplash.com/photo-1513584684374-8bdb7483fe8f",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858"
    ],
    "price": 65000000,
    "location": "Bangalore, Karnataka",
    "country": "India"
  },
  {
    "title": "The Tuscan Vineyard",
    "description": "Traditional Italian estate with its own vineyard and olive groves.",
    "image": [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    ],
    "price": 180000000,
    "location": "Nashik, Maharashtra",
    "country": "India"
  },
  {
    "title": "Modernist Peak House",
    "description": "Angular architecture perched on a hill for maximum sun exposure.",
    "image": [
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
      "https://images.unsplash.com/photo-1502672023488-70e25813efdf",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e"
    ],
    "price": 72000000,
    "location": "Shimla, Himachal Pradesh",
    "country": "India"
  },
  {
    "title": "Riverside Bamboo Mansion",
    "description": "A sustainable wonder built primarily from treated bamboo and recycled materials.",
    "image": [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1449156001437-3a16d1daae39",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266",
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae",
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c"
    ],
    "price": 18000000,
    "location": "Rishikesh, Uttarakhand",
    "country": "India"
  },
  {
    "title": "Emerald Bay Villa",
    "description": "Secluded beach access and tropical gardens surround this luxury home.",
    "image": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6"
    ],
    "price": 140000000,
    "location": "Phuket",
    "country": "Thailand"
  },
  {
    "title": "The Granite House",
    "description": "Strong architectural lines using raw granite and warm cedar wood.",
    "image": [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      "https://images.unsplash.com/photo-1513584684374-8bdb7483fe8f",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a"
    ],
    "price": 48000000,
    "location": "Hyderabad, Telangana",
    "country": "India"
  },
  {
    "title": "Cloud Nine Cottage",
    "description": "A fairytale cottage high in the hills with a cozy fireplace and sun-room.",
    "image": [
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      "https://images.unsplash.com/photo-1444858291040-58f756a3bcd6",
      "https://images.unsplash.com/photo-1414438992182-69e404046f80",
      "https://images.unsplash.com/photo-1505245208761-baad72351bb5",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
    ],
    "price": 22000000,
    "location": "Kodaikanal, Tamil Nadu",
    "country": "India"
  },
  {
    "title": "Art Deco Residence",
    "description": "Bold geometric patterns and luxurious brass finishes in a historic neighborhood.",
    "image": [
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.unsplash.com/photo-1502672023488-70e25813efdf",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1513584684374-8bdb7483fe8f",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471"
    ],
    "price": 89000000,
    "location": "South Mumbai, Maharashtra",
    "country": "India"
  },
  {
    "title": "Scandinavian Pine Home",
    "description": "Clean lines, light wood, and functional design set in a quiet suburb.",
    "image": [
      "https://images.unsplash.com/photo-1513584684374-8bdb7483fe8f",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
      "https://images.unsplash.com/photo-1502672023488-70e25813efdf",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471"
    ],
    "price": 52000000,
    "location": "Chandigarh",
    "country": "India"
  },
  {
    "title": "The Palm Estate",
    "description": "Extravagant estate with a 10-car garage and private cinema hall.",
    "image": [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf",
      "https://images.unsplash.com/photo-1512914890251-2f96a9b0bbe2"
    ],
    "price": 250000000,
    "location": "Palm Jumeirah",
    "country": "Dubai"
  },
  {
    "title": "Zenith Waterfront Villa",
    "description": "Contemporary architecture with a private dock and floor-to-ceiling glass.",
    "image": [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6"
    ],
    "price": 135000000,
    "location": "Kochi, Kerala",
    "country": "India"
  },
  {
    "title": "The Stone Mill",
    "description": "A converted 19th-century mill house with original stone walls and modern interiors.",
    "image": [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266",
      "https://images.unsplash.com/photo-1449156001437-3a16d1daae39",
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae"
    ],
    "price": 31000000,
    "location": "Surat, Gujarat",
    "country": "India"
  },
  {
    "title": "Terrace Garden Studio",
    "description": "A luxury studio with a massive private terrace overlooking the city park.",
    "image": [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858"
    ],
    "price": 18000000,
    "location": "Ahmedabad, Gujarat",
    "country": "India"
  },
  {
    "title": "The Alpine Chalet",
    "description": "Luxurious winter retreat with a heated pool and ski-in/ski-out access.",
    "image": [
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae",
      "https://images.unsplash.com/photo-1444858291040-58f756a3bcd6",
      "https://images.unsplash.com/photo-1414438992182-69e404046f80",
      "https://images.unsplash.com/photo-1505245208761-baad72351bb5"
    ],
    "price": 62000000,
    "location": "Gulmarg, J&K",
    "country": "India"
  },
  {
    "title": "Majestic Courtyard Villa",
    "description": "Traditional architecture with a central courtyard and marble flooring.",
    "image": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf"
    ],
    "price": 75000000,
    "location": "Jaipur, Rajasthan",
    "country": "India"
  },
  {
    "title": "Breezy Bay Mansion",
    "description": "A tropical paradise featuring a private pier and outdoor chef's kitchen.",
    "image": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2"
    ],
    "price": 98000000,
    "location": "Maldives",
    "country": "Maldives"
  },
  {
    "title": "Suburban Glass Manor",
    "description": "Contemporary family home with high privacy walls and integrated greenery.",
    "image": [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
      "https://images.unsplash.com/photo-1513584684374-8bdb7483fe8f",
      "https://images.unsplash.com/photo-1502672023488-70e25813efdf",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471"
    ],
    "price": 41000000,
    "location": "Pune, Maharashtra",
    "country": "India"
  }
]

module.exports = sampleListings;
