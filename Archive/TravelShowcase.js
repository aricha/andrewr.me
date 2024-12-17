const { useState } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } = Recharts;
const { Calendar, Globe, Image, Clock } = lucide;

// Mock travel data (replace with your actual data)
const travelData = {
  destinations: [
    { 
      name: 'Japan', 
      coordinates: [0.6, 0.8], 
      dates: 'March 2023',
      photoCount: 237,
      highlights: ['Tokyo', 'Kyoto', 'Mount Fuji']
    },
    { 
      name: 'New Zealand', 
      coordinates: [0.3, 0.2], 
      dates: 'May 2023',
      photoCount: 412,
      highlights: ['Auckland', 'Wellington', 'Queenstown']
    },
    { 
      name: 'Portugal', 
      coordinates: [0.5, 0.5], 
      dates: 'September 2023',
      photoCount: 289,
      highlights: ['Lisbon', 'Porto', 'Algarve']
    }
  ],
  stats: [
    { month: 'Mar', countries: 1, days: 21 },
    { month: 'May', countries: 1, days: 25 },
    { month: 'Sep', countries: 1, days: 18 }
  ]
};

const TravelShowcase = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        My Global Journey
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Map Section */}
        <div className="bg-gray-100 rounded-lg p-4 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Globe className="mr-2 text-blue-600" size={24} /> 
            Destinations
          </h2>
          <svg 
            viewBox="0 0 1000 500" 
            className="w-full h-96 bg-blue-50 rounded-lg"
          >
            {/* World map outline */}
            <path 
              d="M10 10 L990 10 L990 490 L10 490 Z" 
              fill="#e0e0e0" 
              stroke="#a0a0a0" 
              strokeWidth="2"
            />
            
            {/* Destination markers */}
            {travelData.destinations.map((dest, index) => (
              <g 
                key={index}
                transform={`translate(${dest.coordinates[0] * 1000}, ${dest.coordinates[1] * 500})`}
                onClick={() => setSelectedDestination(dest)}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <circle 
                  r="15" 
                  fill="#2575fc" 
                  fillOpacity="0.7" 
                  stroke="#ffffff" 
                  strokeWidth="3"
                />
                <text 
                  x="20" 
                  y="5" 
                  fill="#2c3e50" 
                  fontSize="12"
                  fontWeight="bold"
                >
                  {dest.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-100 rounded-lg p-4 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Clock className="mr-2 text-blue-600" size={24} />
            Travel Statistics
          </h2>
          <LineChart 
            width={500} 
            height={250} 
            data={travelData.stats}
            className="mx-auto"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="countries" stroke="#8884d8" />
            <Line type="monotone" dataKey="days" stroke="#82ca9d" />
          </LineChart>
          <div className="grid grid-cols-3 text-center mt-4">
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-gray-600">Countries</p>
            </div>
            <div>
              <p className="text-2xl font-bold">64</p>
              <p className="text-gray-600">Total Days</p>
            </div>
            <div>
              <p className="text-2xl font-bold">938</p>
              <p className="text-gray-600">Photos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Details */}
      {selectedDestination && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <Image className="mr-2 text-blue-600" size={24} />
            {selectedDestination.name} Details
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="font-bold">Dates Visited:</p>
              <p>{selectedDestination.dates}</p>
            </div>
            <div>
              <p className="font-bold">Photos Taken:</p>
              <p>{selectedDestination.photoCount}</p>
            </div>
            <div>
              <p className="font-bold">Highlights:</p>
              <ul>
                {selectedDestination.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Make the component globally available
window.TravelShowcase = TravelShowcase;
