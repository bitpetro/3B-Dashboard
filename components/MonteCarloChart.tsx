
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SimulationPoint } from '../services/mockData';

interface Props {
  data: SimulationPoint[];
}

export const MonteCarloChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 30, right: 60, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // 1. Scales
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year) as [number, number])
      .range([0, width]);

    // Log scale for Price to accommodate $1M target
    const y = d3.scaleLog()
      .domain([50000, 5000000]) // $50k to $5M
      .range([height, 0]);

    // 2. Gradients
    const defs = svg.append("defs");
    
    // Fan Chart Gradient (Blue)
    const fanGrad = defs.append("linearGradient")
      .attr("id", "fanGrad")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
    fanGrad.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.1);
    fanGrad.append("stop").attr("offset", "50%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.3);
    fanGrad.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.1);

    // 3. Visual Elements
    
    // P10-P90 Cloud (The "Cone of Uncertainty")
    const areaCloud = d3.area<SimulationPoint>()
      .x(d => x(d.year))
      .y0(d => y(d.p10))
      .y1(d => y(d.p90))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "url(#fanGrad)")
      .attr("stroke", "none")
      .attr("d", areaCloud);

    // P10 Line (Lower Bound)
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#1e3a8a") // Dark Blue
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2")
        .attr("d", d3.line<SimulationPoint>().x(d => x(d.year)).y(d => y(d.p10)).curve(d3.curveMonotoneX));

    // P90 Line (Upper Bound)
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#1e3a8a") // Dark Blue
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2")
        .attr("d", d3.line<SimulationPoint>().x(d => x(d.year)).y(d => y(d.p90)).curve(d3.curveMonotoneX));

    // P50 Median (The "Path")
    const lineMedian = d3.line<SimulationPoint>()
      .x(d => x(d.year))
      .y(d => y(d.p50))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f97316") // Orange Accent
      .attr("stroke-width", 2)
      .attr("d", lineMedian);

    // 4. Axes
    const xAxis = d3.axisBottom(x).tickFormat(d => d.toString()).ticks(data.length);
    const yAxis = d3.axisLeft(y)
        .tickValues([50000, 100000, 250000, 500000, 1000000, 2500000])
        .tickFormat(d => `$${d3.format(".2s")(d as number)}`);

    // Gridlines
    g.append("g")
       .attr("class", "grid")
       .call(d3.axisLeft(y).tickValues([50000, 100000, 250000, 500000, 1000000, 2500000]).tickSize(-width).tickFormat(() => ""))
       .attr("stroke", "#27272a")
       .attr("stroke-dasharray", "2,2")
       .style("stroke-opacity", 0.5);
       
    g.append("g")
       .attr("class", "grid")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x).tickSize(-height).tickFormat(() => ""))
       .attr("stroke", "#27272a")
       .attr("stroke-dasharray", "2,2")
       .style("stroke-opacity", 0.5);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("color", "#71717a")
      .attr("font-family", "monospace");

    g.append("g")
      .call(yAxis)
      .attr("color", "#71717a")
      .attr("font-family", "monospace");

    // 5. Annotations ($1M Target)
    const targetPrice = 1000000;
    const targetY = y(targetPrice);
    
    g.append("line")
        .attr("x1", 0).attr("y1", targetY)
        .attr("x2", width).attr("y2", targetY)
        .attr("stroke", "#10b981") // Emerald
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,4");
        
    g.append("text")
        .attr("x", width - 10)
        .attr("y", targetY - 8)
        .attr("text-anchor", "end")
        .attr("fill", "#10b981")
        .attr("font-size", "11px")
        .attr("font-weight", "bold")
        .attr("font-family", "monospace")
        .text("TARGET: $1M (2035)");

  }, [data]);

  return (
    <div className="w-full bg-inst-surface rounded-md border border-inst-border p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4 border-b border-inst-border pb-3">
        <div>
          <h3 className="text-inst-accent font-mono font-bold text-sm uppercase tracking-widest">
            Monte Carlo Forecast (10k Iterations)
          </h3>
          <p className="text-[10px] font-mono text-inst-muted mt-1 opacity-70">
            MODEL: Geometric Brownian Motion + Halving Shocks
          </p>
        </div>
        <div className="flex gap-4 text-[10px] font-mono">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-inst-text">P50 Median</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500/40 rounded-sm"></div>
                <span className="text-inst-text">P10-P90 Uncertainty</span>
            </div>
        </div>
      </div>
      <div className="flex-grow min-h-[300px]">
         <svg ref={svgRef} viewBox="0 0 800 350" className="w-full h-full"></svg>
      </div>
    </div>
  );
};
