
import React from 'react';

interface TimeSliderProps {
  time: number;
  setTime: (time: number) => void;
}

const formatTime = (hour: number): string => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour.toString().padStart(2, '0')}:00 ${ampm}`;
};

const TimeSlider: React.FC<TimeSliderProps> = ({ time, setTime }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <label htmlFor="time-slider" className="mb-2 text-lg font-semibold text-gray-200">
        Time of Day
      </label>
      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
        {formatTime(time)}
      </div>
      <input
        id="time-slider"
        type="range"
        min="0"
        max="23"
        step="1"
        value={time}
        onChange={(e) => setTime(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${((time) / 23) * 100}%, #4b5563 ${((time) / 23) * 100}%)`
        }}
      />
      <div className="flex justify-between w-full text-xs text-gray-400 mt-2 px-1">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>11 PM</span>
      </div>
    </div>
  );
};

export default TimeSlider;
