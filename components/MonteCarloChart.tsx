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

    const margin = { top: 20, right: 50, bottom: 30, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year) as [number, number])
      .range([0, width]);

    const y = d3.scaleLog()
      .domain([50000, 5000000]) // $50k to $5M
      .range([height, 0]);

    // Areas
    // 10th to 90th percentile (Cone of Uncertainty)
    const area = d3.area<SimulationPoint>()
      .x(d => x(d.year))
      .y0(d => y(d.p10))
      .y1(d => y(d.p90))
      .curve(d3.curveMonotoneX);

    // Gradients
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "cone-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.1);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.3);

    // Draw Cone
    g.append("path")
      .datum(data)
      .attr("fill", "url(#cone-gradient)")
      .attr("stroke", "none")
      .attr("d", area);

    // Median Line
    const line = d3.line<SimulationPoint>()
      .x(d => x(d.year))
      .y(d => y(d.p50))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f97316") // Orange-500
      .attr("stroke-width", 2)
      .attr("d", line);

    // Axes
    const xAxis = d3.axisBottom(x).tickFormat(d => d.toString());
    const yAxis = d3.axisLeft(y).tickFormat(d => `$${d3.format(".2s")(d as number)}`);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("color", "#475569");

    g.append("g")
      .call(yAxis)
      .attr("color", "#475569");
      
    // Gridlines
    g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""))
        .attr("stroke", "#1e293b")
        .attr("stroke-dasharray", "3,3")
        .style("stroke-opacity", 0.3);

    // Consensus Point ($1M target)
    const target = data[data.length - 1];
    if (target) {
      g.append("circle")
        .attr("cx", x(target.year))
        .attr("cy", y(target.p50))
        .attr("r", 6)
        .attr("fill", "#fff")
        .attr("stroke", "#f97316")
        .attr("stroke-width", 2);
        
      g.append("text")
        .attr("x", x(target.year) - 10)
        .attr("y", y(target.p50) - 15)
        .attr("fill", "#fff")
        .attr("font-size", "10px")
        .attr("text-anchor", "end")
        .text("Base Case Projection");
    }

  }, [data]);

  return (
    <div className="w-full bg-slate-900 rounded-lg border border-slate-800 p-4 mt-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-orange-500 font-mono font-bold text-sm">SDE PRICE SIMULATION</h3>
          <p className="text-slate-500 text-xs font-mono">
             dX_t = μ(X_t)dt + σ(X_t)dW_t (Geometric Brownian Motion w/ Halving Jumps)
          </p>
        </div>
      </div>
      <svg ref={svgRef} viewBox="0 0 800 300" className="w-full h-auto"></svg>
    </div>
  );
};