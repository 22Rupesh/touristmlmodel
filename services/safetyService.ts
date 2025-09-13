
import type { CrimeIncident, Coordinates, RiskZone } from '../types';
import { RiskLevel } from '../types';

// Helper function to calculate Euclidean distance between two points
const getDistance = (p1: Coordinates, p2: Coordinates): number => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

/**
 * Generates a realistic but arbitrary dataset of crime incidents.
 * Certain areas have higher concentrations of incidents at specific times of day.
 */
export const generateCrimeData = (): CrimeIncident[] => {
  const incidents: CrimeIncident[] = [];
  let id = 0;

  // Area 1: Business district - Higher risk during late evenings
  for (let i = 0; i < 150; i++) {
    incidents.push({
      id: id++,
      location: { x: 20 + Math.random() * 15, y: 30 + Math.random() * 15 },
      time: Math.floor(18 + Math.random() * 5) % 24, // 6 PM - 11 PM
    });
  }

  // Area 2: Residential area - Sporadic incidents, slightly higher after midnight
  for (let i = 0; i < 100; i++) {
    incidents.push({
      id: id++,
      location: { x: 70 + Math.random() * 20, y: 60 + Math.random() * 20 },
      time: (23 + Math.floor(Math.random() * 6)) % 24, // 11 PM - 5 AM
    });
  }

  // Area 3: Entertainment hub - High risk late at night
  for (let i = 0; i < 200; i++) {
    incidents.push({
      id: id++,
      location: { x: 50 + Math.random() * 15, y: 20 + Math.random() * 15 },
      time: (21 + Math.floor(Math.random() * 7)) % 24, // 9 PM - 4 AM
    });
  }

  // General scattered incidents throughout the day
  for (let i = 0; i < 250; i++) {
    incidents.push({
      id: id++,
      location: { x: Math.random() * 100, y: Math.random() * 100 },
      time: Math.floor(Math.random() * 24),
    });
  }

  return incidents;
};

/**
 * SIMULATED K-MEANS CLUSTERING ALGORITHM
 * This function mimics the behavior of a K-Means clustering model from libraries like scikit-learn.
 * It identifies clusters of incidents based on location for a specific time of day.
 *
 * @param allIncidents - The complete dataset of crime incidents.
 * @param currentTime - The current hour selected by the user (0-23).
 * @param numClusters - The number of clusters (risk zones) to identify (K).
 * @returns An array of RiskZone objects.
 */
export const clusterIncidents = (
  allIncidents: CrimeIncident[],
  currentTime: number,
  numClusters: number
): RiskZone[] => {
  if (allIncidents.length === 0) return [];
  
  // 1. Filter incidents relevant to the current time (+/- 2 hours)
  const relevantIncidents = allIncidents.filter(incident => {
      const timeDiff = Math.abs(incident.time - currentTime);
      return timeDiff <= 2 || timeDiff >= 22; // handles wraparound (e.g., 23:00 and 01:00)
  });

  if (relevantIncidents.length < numClusters) return [];
  
  // 2. Initialize K centroids randomly from the data points
  let centroids: Coordinates[] = [];
  const takenIndices = new Set<number>();
  while (centroids.length < numClusters && centroids.length < relevantIncidents.length) {
      const randomIndex = Math.floor(Math.random() * relevantIncidents.length);
      if (!takenIndices.has(randomIndex)) {
          centroids.push(relevantIncidents[randomIndex].location);
          takenIndices.add(randomIndex);
      }
  }

  let assignments: number[] = new Array(relevantIncidents.length).fill(0);
  const maxIterations = 20;

  for (let iter = 0; iter < maxIterations; iter++) {
    // 3. Assign each point to the nearest centroid
    let changed = false;
    relevantIncidents.forEach((incident, i) => {
      let minDistance = Infinity;
      let closestCentroidIndex = 0;
      centroids.forEach((centroid, j) => {
        const distance = getDistance(incident.location, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroidIndex = j;
        }
      });
      if (assignments[i] !== closestCentroidIndex) {
          changed = true;
      }
      assignments[i] = closestCentroidIndex;
    });

    // 4. Recalculate centroids based on the mean of assigned points
    const newCentroids: Coordinates[] = new Array(numClusters).fill(0).map(() => ({ x: 0, y: 0 }));
    const counts: number[] = new Array(numClusters).fill(0);

    relevantIncidents.forEach((incident, i) => {
      const clusterIndex = assignments[i];
      newCentroids[clusterIndex].x += incident.location.x;
      newCentroids[clusterIndex].y += incident.location.y;
      counts[clusterIndex]++;
    });

    newCentroids.forEach((sum, i) => {
      if (counts[i] > 0) {
        centroids[i] = { x: sum.x / counts[i], y: sum.y / counts[i] };
      }
    });

    // If no assignments changed, the model has converged
    if (!changed) break;
  }

  // 5. Create RiskZone objects from the final clusters
  const clusters: { incidents: CrimeIncident[] }[] = new Array(numClusters).fill(0).map(() => ({ incidents: [] }));
  relevantIncidents.forEach((incident, i) => {
    clusters[assignments[i]].incidents.push(incident);
  });
  
  const incidentCounts = clusters.map(c => c.incidents.length).filter(count => count > 0);
  if (incidentCounts.length === 0) return [];
  
  // Determine risk thresholds
  const maxIncidents = Math.max(...incidentCounts);
  const highThreshold = maxIncidents * 0.66;
  const mediumThreshold = maxIncidents * 0.33;


  return clusters
    .map((cluster, i) => {
      const incidentCount = cluster.incidents.length;
      if (incidentCount === 0) return null;

      let level: RiskLevel;
      if (incidentCount >= highThreshold) {
        level = RiskLevel.High;
      } else if (incidentCount >= mediumThreshold) {
        level = RiskLevel.Medium;
      } else {
        level = RiskLevel.Low;
      }
      
      // Radius is proportional to the number of incidents, with a base size.
      const radius = 20 + incidentCount * 1.5;

      return {
        id: `zone-${i}`,
        center: centroids[i],
        radius,
        level,
        incidentCount
      };
    })
    .filter((zone): zone is RiskZone => zone !== null);
};
