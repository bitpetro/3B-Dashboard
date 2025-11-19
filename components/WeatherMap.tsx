import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FrameworkData, HazardLevel, BodyType, Variable } from '../types';

interface Props {
  data: FrameworkData;
}

export const WeatherMap: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const width = 800;
    const height = 400;

    // Background Grid
    const defs = svg.append("defs");
    const pattern = defs.append("pattern")
      .attr("id", "grid")
      .attr("width", 40)
      .attr("height", 40)
      .attr("patternUnits", "userSpaceOnUse");
    pattern.append("path")
      .attr("d", "M 40 0 L 0 0 0 40")
      .attr("fill", "none")
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1);
    svg.append("rect").attr("width", width).attr("height", height).attr("fill", "url(#grid)");

    // Helper to get color from status
    const getColor = (level: HazardLevel) => {
      switch(level) {
        case HazardLevel.Nominal: return "#34d399"; // emerald-400
        case HazardLevel.Elevated: return "#fbbf24"; // amber-400
        case HazardLevel.Critical: return "#f87171";   // red-400
        case HazardLevel.Cataclysmic: return "#a855f7"; // purple-500
        default: return "#94a3b8";
      }
    };

    // Data mapping for visual nodes
    const bodies = [
      { type: BodyType.Price, y: height * 0.2, label: "PRICE ATMOSPHERE (Macro Jet Stream)" },
      { type: BodyType.Protocol, y: height * 0.5, label: "PROTOCOL FORTRESS (Immutable)" },
      { type: BodyType.Environment, y: height * 0.8, label: "ENVIRONMENT (Physical Reality)" }
    ];

    // Draw Zones
    bodies.forEach(b => {
      svg.append("text")
        .attr("x", 10)
        .attr("y", b.y - 30)
        .attr("fill", "#94a3b8")
        .attr("font-size", "10px")
        .attr("font-family", "monospace")
        .text(b.label);
        
      svg.append("line")
        .attr("x1", 0).attr("y1", b.y)
        .attr("x2", width).attr("y2", b.y)
        .attr("stroke", "#334155")
        .attr("stroke-dasharray", "5,5");
    });

    // Draw Variables as Nodes
    const variables = Object.values(data.bodies).flat() as Variable[];
    
    variables.forEach((v, i) => {
      let cy = 0;
      if (v.body === BodyType.Price) cy = height * 0.2;
      if (v.body === BodyType.Protocol) cy = height * 0.5;
      if (v.body === BodyType.Environment) cy = height * 0.8;

      // Distribute horizontally
      const xOffset = (i * 150) % (width - 100) + 100; 

      // The Node (Circle)
      const g = svg.append("g").attr("transform", `translate(${xOffset}, ${cy})`);

      // Pulse effect for non-Nominal
      if (v.hazardLevel !== HazardLevel.Nominal) {
        g.append("circle")
          .attr("r", 20)
          .attr("fill", getColor(v.hazardLevel))
          .attr("opacity", 0.2)
          .append("animate")
          .attr("attributeName", "r")
          .attr("from", "20")
          .attr("to", "35")
          .attr("dur", "1.5s")
          .attr("repeatCount", "indefinite");
      }

      g.append("circle")
        .attr("r", 15)
        .attr("fill", "#0f172a")
        .attr("stroke", getColor(v.hazardLevel))
        .attr("stroke-width", 2);

      // Label
      g.append("text")
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#e2e8f0")
        .attr("font-size", "10px")
        .attr("font-family", "monospace")
        .text(v.name.split(' ')[0]); // Short name
        
      // Connections (Reflexivity)
      if (i > 0) {
        const prevX = ((i - 1) * 150) % (width - 100) + 100;
        let prevY = 0;
        const prevBody = variables[i-1].body;
        if (prevBody === BodyType.Price) prevY = height * 0.2;
        if (prevBody === BodyType.Protocol) prevY = height * 0.5;
        if (prevBody === BodyType.Environment) prevY = height * 0.8;

        svg.append("path")
          .attr("d", d3.line()([[prevX, prevY + 15], [xOffset, cy - 15]])!)
          .attr("stroke", "#475569")
          .attr("stroke-width", 1)
          .attr("opacity", 0.3)
          .lower();
      }
    });

  }, [data]);

  return (
    <div className="w-full overflow-hidden bg-slate-900 rounded-lg border border-slate-700 relative">
       <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs font-mono text-orange-500">
         SYSTEM TOPOLOGY (Interconnectivity)
       </div>
      <svg ref={svgRef} viewBox="0 0 800 400" className="w-full h-auto"></svg>
    </div>
  );
};