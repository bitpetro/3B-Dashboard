import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { EnhancedFrameworkData } from '../services/mockData';
import { HazardLevel } from '../types';

interface Props {
  data: EnhancedFrameworkData;
}

export const GeospatialMap: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const rotationRef = useRef<[number, number]>([0, -20]);
  
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 1. Setup Projection
    const projection = d3.geoOrthographic()
      .scale(200)
      .center([0, 0])
      .translate([width / 2, height / 2])
      .rotate(rotationRef.current);

    const path = d3.geoPath().projection(projection);

    // 2. Gradients & Definitions
    const defs = svg.append("defs");
    
    // Solar Wind Gradient
    const solarGrad = defs.append("linearGradient")
      .attr("id", "solarWind")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    solarGrad.append("stop").attr("offset", "0%").attr("stop-color", "#fcd34d").attr("stop-opacity", 0.1);
    solarGrad.append("stop").attr("offset", "50%").attr("stop-color", "#f59e0b").attr("stop-opacity", 0.05);
    solarGrad.append("stop").attr("offset", "100%").attr("stop-color", "#000").attr("stop-opacity", 0);

    // Magma Gradient
    const magmaGrad = defs.append("radialGradient").attr("id", "magma");
    magmaGrad.append("stop").attr("offset", "0%").attr("stop-color", "#ef4444").attr("stop-opacity", 0.8);
    magmaGrad.append("stop").attr("offset", "100%").attr("stop-color", "#7f1d1d").attr("stop-opacity", 0);

    // Aurora Gradient
    const auroraGrad = defs.append("linearGradient").attr("id", "aurora").attr("x1", "0").attr("y1", "0").attr("x2", "1").attr("y2", "1");
    auroraGrad.append("stop").attr("offset", "0%").attr("stop-color", "#22d3ee").attr("stop-opacity", 0.6);
    auroraGrad.append("stop").attr("offset", "50%").attr("stop-color", "#818cf8").attr("stop-opacity", 0.4);
    auroraGrad.append("stop").attr("offset", "100%").attr("stop-color", "#c084fc").attr("stop-opacity", 0.0);

    // 3. Solar Wind Visuals (Background)
    svg.append("rect")
        .attr("x", 0).attr("y", 0)
        .attr("width", width/2)
        .attr("height", height)
        .attr("fill", "url(#solarWind)")
        .attr("transform", "skewX(-10)");

    // 4. Globe Group
    const globeGroup = svg.append("g");

    // Atmosphere Halo
    globeGroup.append("circle")
      .attr("cx", width/2).attr("cy", height/2).attr("r", 205)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 2);

    // Magnetosphere Ring (Symbolic)
    const magnetosphere = globeGroup.append("ellipse")
      .attr("cx", width/2).attr("cy", height/2)
      .attr("rx", 260).attr("ry", 80)
      .attr("fill", "none")
      .attr("stroke", "url(#aurora)")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "10,10")
      .attr("transform", "rotate(-15, 400, 250)");

    // Sphere
    globeGroup.append("path")
      .datum({ type: "Sphere" })
      .attr("d", path)
      .attr("fill", "#020617")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1);

    globeGroup.append("path")
      .datum(d3.geoGraticule())
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 0.5);

    // 5. Rendering Features
    const featuresGroup = globeGroup.append("g");

    const render = () => {
      globeGroup.selectAll("path").attr("d", path);
      
      featuresGroup.selectAll("*").remove();
      
      data.weatherSystems.forEach(sys => {
        const center = projection(sys.coordinates);
        const dist = d3.geoDistance(sys.coordinates, projection.invert!([width/2, height/2]));
        
        // Occlusion culling
        if (!center || dist > 1.57) return;

        const g = featuresGroup.append("g")
          .attr("transform", `translate(${center[0]}, ${center[1]})`);

        // Magma Plume (Volcano)
        if (sys.type === 'magma_plume') {
            g.append("circle")
                .attr("r", sys.radius)
                .attr("fill", "url(#magma)");
            g.append("circle")
                .attr("r", 3)
                .attr("fill", "#fee2e2");
        }

        // Aurora (Governance)
        if (sys.type === 'aurora') {
             g.append("path")
                .attr("d", d3.symbol().type(d3.symbolStar).size(sys.radius * 20))
                .attr("fill", "#c084fc")
                .attr("opacity", 0.6)
                .attr("filter", "blur(4px)");
        }

        // Solar Wind Interaction (Liquidity Void)
        if (sys.type === 'solar_wind') {
            g.append("circle")
                .attr("r", sys.radius)
                .attr("stroke", "#f59e0b")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "2,2")
                .attr("fill", "none")
                .attr("class", "animate-ping");
        }
        
        // Cyclone (Derivatives)
        if (sys.type === 'cyclone') {
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", 5)
                .attr("fill", "#cbd5e1")
                .attr("font-family", "Arial")
                .text("🌪️");
        }
      });
    };

    render();

    // Drag Logic
    const drag = d3.drag<SVGSVGElement, unknown>()
      .on("drag", (event) => {
        const rotate = projection.rotate();
        const k = 75 / projection.scale();
        const nextRotation: [number, number] = [
          rotate[0] + event.dx * k,
          rotate[1] - event.dy * k
        ];
        nextRotation[1] = Math.max(-50, Math.min(50, nextRotation[1]));
        rotationRef.current = nextRotation;
        projection.rotate(nextRotation);
        render();
      });

    svg.call(drag);

    // Animation Loop
    const timer = d3.timer((elapsed) => {
        // Rotate Magnetosphere ring
        magnetosphere.attr("stroke-dashoffset", elapsed * 0.05);
    });

    return () => timer.stop();
  }, [data]);

  return (
    <div className="w-full bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden shadow-2xl">
       <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-blue-400 font-mono font-bold text-sm uppercase flex items-center gap-2 drop-shadow-md">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Global Heliosphere & Geophysics
        </h3>
        <div className="flex flex-col gap-1 mt-2">
             <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-black/50 px-2 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-purple-500/50"></span> Magnetosphere (Governance)
             </div>
             <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-black/50 px-2 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-red-500/50"></span> Magma (Security)
             </div>
             <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-black/50 px-2 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-amber-500/50"></span> Solar Wind (Liquidity)
             </div>
        </div>
      </div>
      <svg ref={svgRef} viewBox="0 0 800 500" className="w-full h-auto cursor-move active:cursor-grabbing bg-[#020617]"></svg>
    </div>
  );
};