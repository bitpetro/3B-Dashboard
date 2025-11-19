import { BodyType, FrameworkData, HazardLevel, Polarity } from '../types';

export interface GeoPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'volcanic_hotspot' | 'magnetic_anomaly' | 'impact_crater';
  intensity: number; // 0-100
  hazard: HazardLevel;
  description: string;
}

export interface WeatherSystem {
  id: string;
  name: string;
  type: 'solar_wind' | 'aurora' | 'cyclone' | 'tectonic_plate' | 'magma_plume';
  coordinates: [number, number]; // [lng, lat]
  radius: number;
  hazard: HazardLevel;
  description: string;
}

export interface FeedbackEdge {
  source: string; 
  target: string; 
  weight: number; 
  type: 'amplification' | 'dampening';
}

export interface SimulationPoint {
  year: number;
  p10: number; 
  p50: number; 
  p90: number; 
}

export interface EnhancedFrameworkData extends FrameworkData {
  geoLocations: GeoPoint[];
  weatherSystems: WeatherSystem[];
  feedbackEdges: FeedbackEdge[];
  simulation: SimulationPoint[];
}

function generateNormal(mean: number, stdDev: number): number {
  const u = 1 - Math.random(); 
  const v = Math.random();
  const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  return z * stdDev + mean;
}

function runMonteCarloSimulation(): SimulationPoint[] {
  const simulations = 2000; 
  const years = 5;
  const startYear = 2025;
  const currentPrice = 98000;
  const trajectories: number[][] = [];

  for(let i=0; i<simulations; i++) {
    let price = currentPrice;
    const path: number[] = [];
    for(let y=0; y<years; y++) {
       // "Extinction Level Event" impactor risk (Tail risk)
       const impactorEvent = Math.random() > 0.97 ? -0.6 : 0.0; // 3% chance of 60% drop (Meteor)
       const solarInjection = Math.random() > 0.8 ? 0.4 : 0.0;   // 20% chance of massive liquidity (CME)
       
       const drift = 0.12 + impactorEvent + solarInjection; 
       const shock = generateNormal(0, 0.5); // High volatility environment
       
       price *= (1 + drift + shock);
       path.push(price);
    }
    trajectories.push(path);
  }
  
  const results: SimulationPoint[] = [];
  for(let y=0; y<years; y++) {
     const yearPrices = trajectories.map(t => t[y]).sort((a,b) => a-b);
     results.push({
       year: startYear + y + 1,
       p10: yearPrices[Math.floor(simulations * 0.1)],
       p50: yearPrices[Math.floor(simulations * 0.5)],
       p90: yearPrices[Math.floor(simulations * 0.9)]
     });
  }
  return results;
}

export const getInitialData = (): EnhancedFrameworkData => {
  return {
    timestamp: "Nov 18, 2025 [Post-Tariff Epoch]", 
    bodies: {
      [BodyType.Protocol]: [
        {
          id: "security_sensor",
          name: "1. Security Sensor",
          scientificName: "Core Geothermal Monitor",
          body: BodyType.Protocol,
          hazardLevel: HazardLevel.Nominal,
          polarity: 'positive',
          condition: "Magmatic Uplift (Heat Wave)",
          summary: "Hash rate acting as planetary core heat. Temperatures rising, indicating strong crustal defense against external attack vectors.",
          metrics: [
            { id: "hash_rate", name: "Global Hash Rate", value: "780", unit: "EH/s", description: "Network Security Budget", hazardLevel: HazardLevel.Nominal, trend: 'intensifying' },
            { id: "difficulty", name: "Crust Density", value: "105", unit: "T", description: "Mining Difficulty", hazardLevel: HazardLevel.Nominal, trend: 'intensifying', isSecondary: true },
            { id: "energy_mix", name: "Thermal Efficiency", value: "62", unit: "%", description: "Sustainable Power Mix", hazardLevel: HazardLevel.Nominal, trend: 'stable', isSecondary: true }
          ]
        },
        {
          id: "sovereignty_sensor",
          name: "2. Sovereignty Sensor",
          scientificName: "Planetary Magnetosphere",
          body: BodyType.Protocol,
          hazardLevel: HazardLevel.Elevated,
          polarity: 'negative',
          condition: "Field Weakening / Pole Shift",
          summary: "Solar wind (institutional capital) penetrating the magnetosphere. Aurora Borealis visible at lower latitudes (Retail ETFs).",
          metrics: [
            { id: "etf_aum", name: "ETF Holdings", value: "1.25", unit: "M BTC", description: "Custodial Concentration", hazardLevel: HazardLevel.Critical, trend: 'intensifying' },
            { id: "node_count", name: "Field Generators", value: "17,420", unit: "Nodes", description: "Reachable Nodes", hazardLevel: HazardLevel.Elevated, trend: 'dissipating', isSecondary: true },
            { id: "self_custody", name: "Shield Integrity", value: "68", unit: "%", description: "Supply in Self-Custody", hazardLevel: HazardLevel.Nominal, trend: 'stable', isSecondary: true }
          ]
        },
        {
          id: "scalability_sensor",
          name: "3. Scalability Sensor",
          scientificName: "Lithospheric Tectonics",
          body: BodyType.Protocol,
          hazardLevel: HazardLevel.Nominal,
          polarity: 'neutral',
          condition: "Subduction Stable",
          summary: "Tectonic plates (L1/L2) moving smoothly. No major seismic events (congestive earthquakes) detected in the mempool fault lines.",
          metrics: [
            { id: "l2_tvl", name: "L2 Value Mass", value: "4.8", unit: "$B", description: "Total Value Locked", hazardLevel: HazardLevel.Nominal, trend: 'intensifying' },
            { id: "fees", name: "Friction coeff.", value: "4", unit: "sat/vB", description: "Avg Transaction Fee", hazardLevel: HazardLevel.Nominal, trend: 'stable', isSecondary: true },
            { id: "lightning", name: "Channel Capacity", value: "5,600", unit: "BTC", description: "Off-chain Liquidity", hazardLevel: HazardLevel.Elevated, trend: 'dissipating', isSecondary: true }
          ]
        }
      ],
      [BodyType.Price]: [
        {
          id: "digital_sensor",
          name: "4. Digital Sensor",
          scientificName: "Oceanic Oscillation (Spot)",
          body: BodyType.Price,
          hazardLevel: HazardLevel.Elevated,
          polarity: 'positive',
          condition: "El Niño Warming Phase",
          summary: "Surface temperatures rising. Deep currents (Long-term holders) providing buoyancy against atmospheric pressure.",
          metrics: [
            { id: "price", name: "Surface Level", value: "98,250", unit: "USD", description: "BTC/USD Exchange Rate", hazardLevel: HazardLevel.Elevated, trend: 'intensifying' },
            { id: "mvrv", name: "Thermal Anomaly", value: "2.4", unit: "Z", description: "MVRV Z-Score", hazardLevel: HazardLevel.Elevated, trend: 'intensifying', isSecondary: true },
            { id: "realized", name: "Base Level", value: "34,100", unit: "USD", description: "Realized Price", hazardLevel: HazardLevel.Nominal, trend: 'intensifying', isSecondary: true }
          ]
        },
        {
          id: "spectral_sensor",
          name: "5. Spectral Sensor",
          scientificName: "Atmospheric Cyclonics (Derivs)",
          body: BodyType.Price,
          hazardLevel: HazardLevel.Critical,
          polarity: 'negative',
          condition: "Derecho / Flash Crash Warning",
          summary: "Supercell forming in the upper atmosphere. High wind shear (Leverage) creating conditions for a rapid downdraft event.",
          metrics: [
            { id: "open_interest", name: "Storm Energy", value: "42.5", unit: "$B", description: "Open Interest", hazardLevel: HazardLevel.Critical, trend: 'intensifying' },
            { id: "funding", name: "Pressure Diff", value: "0.04", unit: "%", description: "Funding Rate (8h)", hazardLevel: HazardLevel.Elevated, trend: 'intensifying', isSecondary: true },
            { id: "iv", name: "Turbulence", value: "65", unit: "%", description: "Implied Volatility", hazardLevel: HazardLevel.Elevated, trend: 'stable', isSecondary: true }
          ]
        },
        {
          id: "liquidity_sensor",
          name: "6. Liquidity Sensor",
          scientificName: "Heliophysics (Macro)",
          body: BodyType.Price,
          hazardLevel: HazardLevel.Critical,
          polarity: 'negative',
          condition: "Solar Minimum / CME Risk",
          summary: "The Central Bank Star is dimming (QT). Solar wind velocity (M2) is low, reducing the protective plasma sheath around assets.",
          metrics: [
            { id: "global_m2", name: "Solar Wind", value: "98.2", unit: "$T", description: "Global M2 Supply", hazardLevel: HazardLevel.Critical, trend: 'dissipating' },
            { id: "dxy", name: "Gravity Well", value: "104.5", unit: "idx", description: "USD Strength Index", hazardLevel: HazardLevel.Elevated, trend: 'intensifying', isSecondary: true },
            { id: "yield_10y", name: "Radiation", value: "4.5", unit: "%", description: "US 10Y Yield", hazardLevel: HazardLevel.Critical, trend: 'intensifying', isSecondary: true }
          ]
        }
      ],
      [BodyType.Environment]: [
        {
          id: "physical_sensor",
          name: "7. Physical Sensor",
          scientificName: "Biosphere / Energy Grid",
          body: BodyType.Environment,
          hazardLevel: HazardLevel.Nominal,
          polarity: 'positive',
          condition: "Stable Symbiosis",
          summary: "Mining fleet acting as a load-balancer for the energy grid. Algal blooms of renewable capacity co-locating with data centers.",
          metrics: [
            { id: "power_draw", name: "Metabolic Rate", value: "18.5", unit: "GW", description: "Network Power Draw", hazardLevel: HazardLevel.Nominal, trend: 'intensifying' },
            { id: "sustainable", name: "Photosynthesis", value: "59", unit: "%", description: "Sustainable Energy Mix", hazardLevel: HazardLevel.Nominal, trend: 'intensifying', isSecondary: true },
            { id: "heat_reuse", name: "Symbiosis", value: "3", unit: "GW", description: "Heat Recycling Capacity", hazardLevel: HazardLevel.Nominal, trend: 'intensifying', isSecondary: true }
          ]
        },
        {
          id: "law_sensor",
          name: "8. Law Sensor",
          scientificName: "Anthropogenic Forcing",
          body: BodyType.Environment,
          hazardLevel: HazardLevel.Critical,
          polarity: 'negative',
          condition: "Acid Rain / Smog",
          summary: "Industrial pollutants (Regulations) causing localized toxicity. Sanctions creating dead zones where capital cannot flow.",
          metrics: [
            { id: "sanctions", name: "Toxicity Level", value: "High", unit: "Risk", description: "Regulatory Hostility", hazardLevel: HazardLevel.Critical, trend: 'intensifying' },
            { id: "ofac", name: "Filtered Flow", value: "0.01", unit: "%", description: "OFAC Compliant Blocks", hazardLevel: HazardLevel.Nominal, trend: 'stable', isSecondary: true }
          ]
        },
        {
          id: "social_sensor",
          name: "9. Social Sensor",
          scientificName: "Terrestrial Topography",
          body: BodyType.Environment,
          hazardLevel: HazardLevel.Elevated,
          polarity: 'neutral',
          condition: "Erosion & Migration",
          summary: "Wealth concentration causing topsoil erosion in developed markets. Mass migration of users to L2 alluvial plains.",
          metrics: [
            { id: "active_addrs", name: "Population", value: "1.2", unit: "M", description: "Daily Active Addresses", hazardLevel: HazardLevel.Elevated, trend: 'dissipating' },
            { id: "gini", name: "Elevation Diff", value: "0.82", unit: "idx", description: "Wealth Gini Coeff", hazardLevel: HazardLevel.Critical, trend: 'stable', isSecondary: true },
            { id: "hodl", name: "Sedimentation", value: "70", unit: "%", description: "Supply Unmoved >1yr", hazardLevel: HazardLevel.Nominal, trend: 'intensifying', isSecondary: true }
          ]
        }
      ]
    },
    geoLocations: [],
    weatherSystems: [
      { 
        id: "solar_min", 
        name: "Liquidity Drought", 
        type: "solar_wind", 
        coordinates: [-77.0, 38.9], 
        radius: 45, 
        hazard: HazardLevel.Critical, 
        description: "Fed QT: Solar Minimum" 
      },
      { 
        id: "etf_aurora", 
        name: "ETF Aurora", 
        type: "aurora", 
        coordinates: [-74.0, 40.7], 
        radius: 35, 
        hazard: HazardLevel.Elevated, 
        description: "Wall St. Magnetic Reconnection" 
      },
      { 
        id: "mining_plume", 
        name: "Texan Hash Plume", 
        type: "magma_plume", 
        coordinates: [-100.0, 31.0], 
        radius: 28, 
        hazard: HazardLevel.Nominal, 
        description: "Geothermal Venting (780 EH/s)" 
      },
      { 
        id: "derivs_derecho", 
        name: "Derivatives Derecho", 
        type: "cyclone", 
        coordinates: [114.1, 22.3], 
        radius: 20, 
        hazard: HazardLevel.Critical, 
        description: "Leverage Storm ($42B OI)" 
      }
    ],
    feedbackEdges: [
      { source: "mining_plume", target: "derivs_derecho", weight: 0.7, type: "amplification" },
      { source: "solar_min", target: "etf_aurora", weight: 0.9, type: "dampening" },
    ],
    simulation: runMonteCarloSimulation()
  };
};