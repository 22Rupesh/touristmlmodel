
import React from 'react';

const Legend: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-200 mb-4 text-center">Risk Level Legend</h3>
      <ul className="space-y-3">
        <li className="flex items-center">
          <span className="w-5 h-5 rounded-full bg-red-500/80 border border-red-400 mr-3"></span>
          <span className="text-gray-300">High Risk Zone</span>
        </li>
        <li className="flex items-center">
          <span className="w-5 h-5 rounded-full bg-yellow-500/80 border border-yellow-400 mr-3"></span>
          <span className="text-gray-300">Medium Risk Zone</span>
        </li>
        <li className="flex items-center">
          <span className="w-5 h-5 rounded-full bg-green-500/80 border border-green-400 mr-3"></span>
          <span className="text-gray-300">Low Risk Zone</span>
        </li>
      </ul>
    </div>
  );
};

export default Legend;
