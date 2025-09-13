
import React from 'react';
import type { RiskZone } from '../types';
import { RiskLevel } from '../types';

interface MapProps {
  riskZones: RiskZone[];
}

const riskLevelColors: Record<RiskLevel, string> = {
  [RiskLevel.High]: 'bg-red-500/50 border-red-400',
  [RiskLevel.Medium]: 'bg-yellow-500/50 border-yellow-400',
  [RiskLevel.Low]: 'bg-green-500/50 border-green-400',
};

const RiskZoneCircle: React.FC<{ zone: RiskZone }> = ({ zone }) => {
  const size = zone.radius * 2;
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${zone.center.x}%`,
    top: `${zone.center.y}%`,
    width: `${size}px`,
    height: `${size}px`,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    transition: 'all 0.5s ease-in-out',
  };

  return (
    <div
      style={style}
      className={`flex items-center justify-center border-2 ${riskLevelColors[zone.level]}`}
    >
        <span className="text-white font-bold text-xs drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{zone.incidentCount}</span>
    </div>
  );
};

const Map: React.FC<MapProps> = ({ riskZones }) => {
  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg">
      <img
        src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/3:2/w_1920,c_limit/GoogleMapTA.jpg"
        alt="Street map of Mumbai"
        className="absolute top-0 left-0 w-full h-full object-cover select-none"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
      
      {riskZones.map((zone) => (
        <RiskZoneCircle key={zone.id} zone={zone} />
      ))}
    </div>
  );
};

export default Map;
