
export interface Coordinates {
  x: number;
  y: number;
}

export interface CrimeIncident {
  id: number;
  location: Coordinates;
  time: number; // Hour of the day (0-23)
}

export enum RiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface RiskZone {
  id: string;
  center: Coordinates;
  radius: number;
  level: RiskLevel;
  incidentCount: number;
}
