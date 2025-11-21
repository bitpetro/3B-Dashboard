
import { BodyType, FrameworkData, HazardLevel, Polarity } from '../types';

export interface DataSource {
  provider: string;
  lastUpdate: string;
  status: 'live' | 'delayed' | 'offline' | 'estimated';
  gapIdentified: boolean;
}

export interface GeoPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'mining_cluster' | 'strategic_reserve' | 'fiber_trunk' | 'data_center' | 'substation';
  intensity: number; // 0-100
  hazard: HazardLevel;
  description: string;
  source: DataSource;
}

export interface WeatherSystem {
  id: string;
  name: string;
  type: 'high_pressure' | 'low_pressure' | 'storm_front' | 'jet_stream';
  coordinates: [number, number]; // [lat, lng] center
  radius: number; // meters
  intensity: number; // 0-100
  hazard: HazardLevel;
  description: string;
  velocity: number; // movement speed
}

export interface SimulationPoint {
  year: number;
  p10: number; 
  p50: number; 
  p90: number; 
}

export interface IsoZone {
    id: string;
    name: string;
    code: string;
    coordinates: [number, number][];
    price: number; // $/MWh
    trend: 'rising' | 'falling' | 'stable';
    congestionLevel: 'low' | 'medium' | 'high'; // Visual heat
    source: DataSource;
}

export interface PipelineSegment {
    id: string;
    name: string;
    path: [number, number][]; // Array of [lat, lng]
    pricingStatus: 'negative' | 'neutral' | 'premium'; // Color coding basis
    hubPrice: number; // $/MMBtu
    throughput: number; // Bcf/d
    source: DataSource;
}

export interface PowerStation {
    id: string;
    name: string;
    type: 'nuclear' | 'solar' | 'wind' | 'hydro' | 'gas' | 'coal';
    capacity: number; // MW
    lat: number;
    lng: number;
    source: DataSource;
}

export interface EnhancedFrameworkData extends FrameworkData {
  geoLocations: GeoPoint[];
  weatherSystems: WeatherSystem[];
  simulation: SimulationPoint[];
  isoZones: IsoZone[];
  pipelines: PipelineSegment[];
  powerStations: PowerStation[];
}

// Advanced Geometric Brownian Motion for Price Simulation
function runStochasticSimulation(): SimulationPoint[] {
  const simulations = 500; 
  const years = 10; // 2025 to 2035
  const startYear = 2025;
  const startPrice = 98500; // Scenario Baseline: Late 2025 Bull
  
  const dt = 1/12; 
  const steps = years * 12;
  
  const mu = 0.26; 
  const sigma = 0.65; 
  
  const yearlyPrices: number[][] = Array.from({ length: years + 1 }, () => []);

  for(let i=0; i<simulations; i++) {
    let price = startPrice;
    yearlyPrices[0].push(price);

    for(let t=1; t<=steps; t++) {
      const isHalving = (Math.abs(t - 3 * 12) < 2) || (Math.abs(t - 7 * 12) < 2);
      const jump = isHalving ? (0.15 + Math.random() * 0.2) : 0; 

      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      const drift = (mu - 0.5 * sigma * sigma) * dt;
      const diffusion = sigma * Math.sqrt(dt) * z;
      
      price = price * Math.exp(drift + diffusion + jump);
      
      if (t % 12 === 0) {
         const yearIndex = t / 12;
         if (yearIndex <= years) {
            yearlyPrices[yearIndex].push(price);
         }
      }
    }
  }
  
  const results: SimulationPoint[] = [];
  for(let y=0; y<=years; y++) {
     const prices = yearlyPrices[y].sort((a,b) => a-b);
     results.push({
       year: startYear + y,
       p10: prices[Math.floor(simulations * 0.10)] || 0,
       p50: prices[Math.floor(simulations * 0.50)] || 0,
       p90: prices[Math.floor(simulations * 0.90)] || 0
     });
  }
  return results;
}

export const getInitialData = (): EnhancedFrameworkData => {
  return {
    timestamp: "2025-11-20T14:30:00Z", 
    bodies: {
      [BodyType.Protocol]: [
        {
          id: "hash_var",
          name: "1.0 // Hash Rate",
          scientificName: "Kinetic Security",
          body: BodyType.Protocol,
          hazardLevel: HazardLevel.Nominal,
          polarity: 'positive',
          condition: "V2 Transition",
          summary: "Hash Rate Volatility Index (HRVX) indicates healthy miner capitulation processing.",
          metrics: [
            { id: "stratum_v2", name: "Stratum V2 Adoption", value: "5.2", unit: "%", description: "Censorship Resistance", hazardLevel: HazardLevel.Elevated, trend: 'intensifying', sources: ["Braiins"] },
            { id: "hrvx", name: "HRVX (30d)", value: "4.07", unit: "%", description: "Miner Stress Index", hazardLevel: HazardLevel.Nominal, trend: 'stable', isSecondary: true, sources: ["Luxor"] }
          ],
          conceptual: {
            trivium: "Grammar",
            triviumRole: "Structure & Vocabulary",
            forceDescription: "Force 1: What",
            earthSystemAnalogy: "Tectonic Activity",
            analogyDescription: "Like tectonic plates creating mountains through immense pressure, Hash Rate provides the massive, energy-intensive kinetic structure that underpins the entire digital continent."
          }
        },
        {
          id: "gov_var",
          name: "2.0 // Governance",
          scientificName: "Consensus Mechanics",
          body: BodyType.Protocol,
          hazardLevel: HazardLevel.Nominal,
          polarity: 'neutral',
          condition: "Ossification",
          summary: "High Ossification Score confirms protocol resistance to political capture.",
          metrics: [
            { id: "bip_adopt", name: "BIP Adoption Rate", value: "82", unit: "%", description: "Node Signaling", hazardLevel: HazardLevel.Nominal, trend: 'intensifying', sources: ["Bitcoin Core"] },
            { id: "ossification", name: "Ossification Score", value: "0.65", unit: "/1.0", description: "Change Resistance", hazardLevel: HazardLevel.Nominal, trend: 'stable', isSecondary: true, sources: ["GitHub"] }
          ],
          conceptual: {
            trivium: "Logic",
            triviumRole: "Reason & Rules",
            forceDescription: "Force 2: How",
            earthSystemAnalogy: "The Rock Cycle",
            analogyDescription: "Governance acts as the Rock Cycle, a slow process where material is recycled and layered over geological time, ensuring structural integrity without rapid, destabilizing metamorphosis."
          }
        },
        {
          id: "layer_var",
          name: "3.0 // Layers",
          scientificName: "Throughput Physics",
          body: BodyType.Protocol,
          hazardLevel: HazardLevel.Nominal,
          polarity: 'positive',
          condition: "L2 Expansion",
          summary: "Scalability Balance Ratio favoring L2 settlement efficiency.",
          metrics: [
            { id: "scale_ratio", name: "Scalability Ratio", value: "0.95", unit: "L2/L1", description: "Settlement Efficiency", hazardLevel: HazardLevel.Nominal, trend: 'intensifying', sources: ["Glassnode"] },
            { id: "ln_growth", name: "LN Node Growth", value: "7.1", unit: "%", description: "Network Topology", hazardLevel: HazardLevel.Elevated, trend: 'dissipating', isSecondary: true, sources: ["1ML"] }
          ],
          conceptual: {
            trivium: "Rhetoric",
            triviumRole: "Application & Persuasion",
            forceDescription: "Force 3: Why",
            earthSystemAnalogy: "Continental Drift",
            analogyDescription: "Layers represent Continental Drift—the slow expansion and restructuring of the crust that creates new habitats (blockspace) and connects disparate landmasses (payment corridors)."
          }
        }
      ],
      [BodyType.Price]: [
        {
          id: "spot_var",
          name: "4.0 // Spot Market",
          scientificName: "Valuation Physics",
          body: BodyType.Price,
          hazardLevel: HazardLevel.Critical, 
          polarity: 'positive',
          condition: "Super-Cycle Impulse",
          summary: "MVRV Ratio > 2.0 indicates heated valuation relative to realized cost basis.",
          metrics: [
            { id: "mvrv", name: "MVRV Ratio", value: "2.13", unit: "x", description: "Market/Realized Cap", hazardLevel: HazardLevel.Critical, trend: 'intensifying', sources: ["Glassnode"] },
            { id: "hodl_waves", name: "HODL Waves (>1yr)", value: "68", unit: "%", description: "Long-term Conviction", hazardLevel: HazardLevel.Nominal, trend: 'stable', isSecondary: true, sources: ["Glassnode"] }
          ],
          conceptual: {
            trivium: "Grammar",
            triviumRole: "Structure & Vocabulary",
            forceDescription: "Force 1: What",
            earthSystemAnalogy: "Evaporation & Condensation",
            analogyDescription: "The Spot Market is the water cycle of the economy. Capital evaporates (selling) and condenses (buying), transferring energy into the atmosphere and driving the basic weather system."
          }
        },
        {
          id: "deriv_var",
          name: "5.0 // Derivatives",
          scientificName: "Speculative Velocity",
          body: BodyType.Price,
          hazardLevel: HazardLevel.Elevated,
          polarity: 'negative',
          condition: "Leverage Flush",
          summary: "Open Interest Cascade Risk elevated; potential for liquidation wicks.",
          metrics: [
            { id: "cascade_risk", name: "Cascade Risk", value: "18.5", unit: "High", description: "OI / Volume Ratio", hazardLevel: HazardLevel.Critical, trend: 'intensifying', sources: ["CoinGlass"] },
            { id: "funding", name: "Funding Rate", value: "0.01", unit: "%", description: "Perpetual Premium", hazardLevel: HazardLevel.Nominal, trend: 'stable', isSecondary: true, sources: ["CoinGlass"] }
          ],
          conceptual: {
            trivium: "Logic",
            triviumRole: "Reason & Rules",
            forceDescription: "Force 2: How",
            earthSystemAnalogy: "Jet Streams & El Niño",
            analogyDescription: "Derivatives act as high-altitude Jet Streams—fast-moving, invisible currents of leverage that can drastically alter surface weather patterns, creating storms or rapidly clearing skies."
          }
        },
        {
          id: "macro_var",
          name: "6.0 // Macro Environment",
          scientificName: "Global Liquidity",
          body: BodyType.Price,
          hazardLevel: HazardLevel.Critical,
          polarity: 'negative',
          condition: "Monetary Contraction",
          summary: "Fed Net Liquidity contraction exerting downward pressure on risk assets.",
          metrics: [
            { id: "net_liq", name: "Fed Net Liquidity", value: "6.2", unit: "$T", description: "Assets - (RRP+TGA)", hazardLevel: HazardLevel.Critical, trend: 'dissipating', sources: ["FRED"] },
            { id: "m2_impact", name: "M2 Growth Impact", value: "6.7", unit: "%", description: "YoY Supply Change", hazardLevel: HazardLevel.Elevated, trend: 'intensifying', isSecondary: true, sources: ["FRED"] }
          ],
          conceptual: {
            trivium: "Rhetoric",
            triviumRole: "Application & Persuasion",
            forceDescription: "Force 3: Why",
            earthSystemAnalogy: "Atmospheric Circulation",
            analogyDescription: "Macro Liquidity is the Global Atmospheric Circulation—the planetary flow of air/capital that determines the overall climate zones and seasons, affecting all local weather systems."
          }
        }
      ],
      [BodyType.Environment]: [
        {
          id: "energy_var",
          name: "7.0 // Energy",
          scientificName: "Thermodynamics",
          body: BodyType.Environment,
          hazardLevel: HazardLevel.Critical,
          polarity: 'negative',
          condition: "Resource Competition",
          summary: "AI Squeeze Metric > 1.0 implies data centers displacing hashrate.",
          metrics: [
            { id: "ai_squeeze", name: "AI Squeeze Metric", value: "1.42", unit: "Ratio", description: "DC vs Mining Demand", hazardLevel: HazardLevel.Critical, trend: 'intensifying', sources: ["Digiconomist"] },
            { id: "efficiency", name: "Efficiency", value: "24", unit: "J/TH", description: "Network Efficiency", hazardLevel: HazardLevel.Nominal, trend: 'dissipating', isSecondary: true, sources: ["Hashrate Index"] }
          ],
          conceptual: {
            trivium: "Grammar",
            triviumRole: "Structure & Vocabulary",
            forceDescription: "Force 1: What",
            earthSystemAnalogy: "Photosynthesis",
            analogyDescription: "Energy mining is the Photosynthesis of the digital organism—converting raw energy (photons/electrons) into metabolic growth (hash) to sustain the biosphere."
          }
        },
        {
          id: "reg_var",
          name: "8.0 // Regulatory",
          scientificName: "Political Friction",
          body: BodyType.Environment,
          hazardLevel: HazardLevel.Elevated,
          polarity: 'negative',
          condition: "Jurisdictional Arbitrage",
          summary: "Censorship Index remains low, but Sovereignty Ratio needs improvement.",
          metrics: [
            { id: "censorship", name: "Censorship Index", value: "2.4", unit: "%", description: "OFAC Compliant Blocks", hazardLevel: HazardLevel.Nominal, trend: 'stable', sources: ["MEV Watch"] },
            { id: "sovereignty", name: "Sovereignty Ratio", value: "65", unit: "%", description: "Self-Custody Supply", hazardLevel: HazardLevel.Elevated, trend: 'dissipating', isSecondary: true, sources: ["Glassnode"] }
          ],
          conceptual: {
            trivium: "Logic",
            triviumRole: "Reason & Rules",
            forceDescription: "Force 2: How",
            earthSystemAnalogy: "Natural Selection",
            analogyDescription: "Regulation functions as Natural Selection—environmental pressures and rules that dictate which organisms (companies/protocols) survive, adapt, or go extinct."
          }
        },
        {
          id: "social_var",
          name: "9.0 // Social & Land",
          scientificName: "Adoption Topology",
          body: BodyType.Environment,
          hazardLevel: HazardLevel.Elevated,
          polarity: 'neutral',
          condition: "Wealth Concentration",
          summary: "Land Scarcity Heatmap indicates prime grid interconnects are saturated.",
          metrics: [
            { id: "scarcity", name: "Scarcity Index", value: "88", unit: "/100", description: "Land/Power Availability", hazardLevel: HazardLevel.Critical, trend: 'intensifying', sources: ["USGS", "HIFLD"] },
            { id: "gini", name: "Gini Coefficient", value: "0.45", unit: "Idx", description: "Wealth Inequality", hazardLevel: HazardLevel.Elevated, trend: 'stable', isSecondary: true, sources: ["Glassnode"] }
          ],
          conceptual: {
            trivium: "Rhetoric",
            triviumRole: "Application & Persuasion",
            forceDescription: "Force 3: Why",
            earthSystemAnalogy: "Biodiversity & Habitat",
            analogyDescription: "Social & Land variables represent Biodiversity and Habitat—the struggle against fragmentation (inequality) and the challenge of ensuring all participants have access to the ecosystem."
          }
        }
      ]
    },
    geoLocations: [
        {
            id: "sub_1",
            name: "Permian Substation Alpha",
            lat: 31.5, 
            lng: -102.5,
            type: "substation",
            intensity: 100,
            hazard: HazardLevel.Nominal,
            description: "200MW Capacity Available / Rural",
            source: { provider: "HIFLD", lastUpdate: "2025", status: "live", gapIdentified: false }
        },
        {
            id: "riot_rockdale",
            name: "Rockdale Mining Cluster",
            lat: 30.57, 
            lng: -97.00,
            type: "mining_cluster",
            intensity: 95,
            hazard: HazardLevel.Nominal,
            description: "700MW Operational / Immersion",
            source: { provider: "EIA-860", lastUpdate: "2024", status: "live", gapIdentified: false }
        },
        {
            id: "corsicana_riot",
            name: "Corsicana Expansion",
            lat: 32.09,
            lng: -96.46,
            type: "mining_cluster",
            intensity: 90,
            hazard: HazardLevel.Elevated,
            description: "1GW Planned / Grid Study Pending",
            source: { provider: "Public Filings", lastUpdate: "2025", status: "live", gapIdentified: false }
        },
        {
            id: "ashburn_dc",
            name: "Ashburn Data Center Alley",
            lat: 39.04,
            lng: -77.48,
            type: "data_center",
            intensity: 100,
            hazard: HazardLevel.Critical,
            description: "Hyperscaler Saturation / No Power",
            source: { provider: "Dgtl Infra", lastUpdate: "2025", status: "estimated", gapIdentified: true }
        },
        {
            id: "dfw_dc",
            name: "Dallas Digital Realty",
            lat: 32.94,
            lng: -96.82,
            type: "data_center",
            intensity: 85,
            hazard: HazardLevel.Elevated,
            description: "High Competition Zone",
            source: { provider: "Mapbox", lastUpdate: "2025", status: "live", gapIdentified: false }
        }
    ],
    weatherSystems: [
      { 
        id: "ws_1", 
        name: "Systemic Liquidity Void", 
        type: "low_pressure", 
        coordinates: [40.71, -74.00], // NYC
        radius: 900000, 
        intensity: 85,
        hazard: HazardLevel.Critical, 
        description: "TradFi Credit Contraction",
        velocity: 0.1
      }
    ],
    isoZones: [
        {
            id: "iso_ercot",
            name: "ERCOT (Texas)",
            code: "ERCOT",
            // Simplified polygon roughly covering Texas - Expanded slightly for visibility
            coordinates: [[36.5,-103], [36.5,-100], [34.5, -94.5], [33.5,-94], [29.5,-93.5], [26,-97], [25.8,-97.5], [29,-103.5], [31.8,-106.5], [32,-106.5]],
            price: 38.20,
            trend: 'stable',
            congestionLevel: 'low',
            source: { provider: "ERCOT API", lastUpdate: "Live", status: "live", gapIdentified: false }
        }
    ],
    pipelines: [
        // Permian Header (West Texas -> Katy Hub)
        {
            id: "pipe_permian",
            name: "Permian Express",
            // Expanded path for better map visibility
            path: [
                [31.5, -103.5], 
                [31.4, -102.8],
                [31.2, -102.0], 
                [31.0, -100.5], 
                [30.5, -98.0], 
                [29.8, -95.8]
            ],
            pricingStatus: 'negative',
            hubPrice: -1.50,
            throughput: 2.0,
            source: { provider: "EIA", lastUpdate: "Live", status: "live", gapIdentified: false }
        },
        // Waha Header
        {
            id: "pipe_waha",
            name: "Waha Header",
            path: [
                [31.9, -103.8], 
                [31.7, -103.5],
                [31.5, -103.2], 
                [31.4, -102.5]
            ],
            pricingStatus: 'negative',
            hubPrice: -2.10,
            throughput: 1.5,
            source: { provider: "EIA", lastUpdate: "Live", status: "live", gapIdentified: false }
        }
    ],
    powerStations: [
        { id: "pwr_1", name: "Palo Verde", type: "nuclear", capacity: 3937, lat: 33.39, lng: -112.86, source: { provider: "EIA", lastUpdate: "2025", status: "live", gapIdentified: false }},
        { id: "pwr_2", name: "Comanche Peak", type: "nuclear", capacity: 2300, lat: 32.29, lng: -97.78, source: { provider: "EIA", lastUpdate: "2025", status: "live", gapIdentified: false }},
        { id: "pwr_3", name: "South Texas Project", type: "nuclear", capacity: 2700, lat: 28.79, lng: -96.05, source: { provider: "EIA", lastUpdate: "2025", status: "live", gapIdentified: false }}
    ],
    simulation: runStochasticSimulation()
  };
};
