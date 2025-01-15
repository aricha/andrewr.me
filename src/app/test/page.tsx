import React from 'react';

const ResponsiveGridDemo = () => {
  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6">Responsive Grid Layout</h2>
      
      {/* Grid container using CSS Grid via Tailwind */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-md sm:max-w-3xl mx-auto">
        {/* Item A - spans full width on mobile, first column on desktop */}
        <div className="bg-blue-500 text-white p-8 rounded-lg col-span-2 sm:col-span-1 sm:h-auto flex flex-col items-center justify-center text-2xl">
          <div>Item A</div>
          <div className="text-sm mt-2 text-blue-100">
            (Height based on content)
          </div>
          <div className="mt-4">
            Some extra content
            <br />
            to demonstrate 
            <br />
            natural height
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
        
        {/* Container for B and C on desktop */}
        <div className="col-span-2 xs sm:col-span-1 grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-4 sm:h-full">
          {/* Item B */}
          <div className="bg-green-500 text-white p-8 rounded-lg w-full h-full flex items-center justify-center text-2xl aspect-[5/4] sm:aspect-auto">
            <div>
              Item B
              <div className="text-sm mt-2 text-green-100">
                (Equal height on desktop)
              </div>
            </div>
          </div>
          
          {/* Item C */}
          <div className="bg-purple-500 text-white p-8 rounded-lg w-full h-full flex items-center justify-center text-2xl">
            <div>
              Item C
              <div className="text-sm mt-2 text-purple-100">
                (Equal height on desktop)
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Viewport size indicator */}
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full">
        <span className="hidden sm:inline">Desktop View</span>
        <span className="sm:hidden">Mobile View</span>
      </div>
    </div>
  );
};

export default ResponsiveGridDemo;