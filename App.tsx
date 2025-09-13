
import React, { useState, useEffect, useMemo } from 'react';
import Map from './components/Map';
import TimeSlider from './components/TimeSlider';
import Legend from './components/Legend';
import { generateCrimeData, clusterIncidents } from './services/safetyService';
import type { CrimeIncident, RiskZone } from './types';

const App: React.FC = () => {
  const [time, setTime] = useState<number>(18); // Default to 6 PM
  const [crimeData, setCrimeData] = useState<CrimeIncident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Generate the arbitrary dataset once on component mount.
    // In a real application, this would be an API call.
    setCrimeData(generateCrimeData());
    setIsLoading(false);
  }, []);

  const riskZones: RiskZone[] = useMemo(() => {
    if (crimeData.length === 0) {
      return [];
    }
    // Re-run the clustering model whenever the time changes.
    return clusterIncidents(crimeData, time, 5); // Using 5 clusters
  }, [crimeData, time]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Mumbai Safety Zones
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Visualizing Women's Safety Hotspots by Time of Day
          </p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow lg:w-2/3 bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700">
            {isLoading ? (
              <div className="aspect-video w-full flex items-center justify-center">
                <p>Loading Map Data...</p>
              </div>
            ) : (
              <Map riskZones={riskZones} />
            )}
          </div>
          <div className="lg:w-1/3 flex flex-col gap-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
              <TimeSlider time={time} setTime={setTime} />
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
              <Legend />
            </div>
             <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 text-sm text-gray-400">
                <h3 className="font-bold text-lg text-white mb-2">How it Works</h3>
                <p>This map uses a simulated K-Means clustering algorithm on an arbitrary dataset of incidents. The model identifies areas with a higher density of incidents at specific times, classifying them into risk zones. Adjust the slider to see how these hotspots shift throughout the day.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
