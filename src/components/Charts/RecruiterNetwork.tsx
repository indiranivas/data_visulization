import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DepartmentData, NetworkData } from '../../types';

interface RecruiterNetworkProps {
  data: DepartmentData[];
}

const RecruiterNetwork: React.FC<RecruiterNetworkProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Create network data
    const networkData: NetworkData = { nodes: [], links: [] };
    const companyMap: Record<string, boolean> = {};
    const studentMap: Record<string, boolean> = {};

    // Add placed students and their companies
    data.forEach(student => {
      if (student.status === 'Placed' && student.company) {
        // Add student node if not already added
        if (!studentMap[student.id]) {
          networkData.nodes.push({
            id: student.id,
            name: student.name,
            type: 'student',
            value: 5
          });
          studentMap[student.id] = true;
        }

        // Add company node if not already added
        if (!companyMap[student.company]) {
          networkData.nodes.push({
            id: student.company,
            name: student.company,
            type: 'company',
            value: 15
          });
          companyMap[student.company] = true;
        }

        // Add link between student and company
        networkData.links.push({
          source: student.id,
          target: student.company,
          value: 1
        });
      }
    });

    // Set up the dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define color scale
    const color = d3.scaleOrdinal()
      .domain(['company', 'student'])
      .range(['#7C3AED', '#2563EB']);

    // Create force simulation
    const simulation = d3.forceSimulation(networkData.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(networkData.links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.value * 1.5));

    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(networkData.links)
      .enter()
      .append("line")
      .attr("stroke", "#ccc")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    // Create nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(networkData.nodes)
      .enter()
      .append("circle")
      .attr("r", (d: any) => d.value)
      .attr("fill", (d: any) => color(d.type) as string)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add tooltips
    node.append("title")
      .text((d: any) => d.name);

    // Add labels for companies
    const labels = svg.append("g")
      .selectAll("text")
      .data(networkData.nodes.filter((d) => d.type === 'company'))
      .enter()
      .append("text")
      .text((d: any) => d.name)
      .attr("font-size", 10)
      .attr("dx", 12)
      .attr("dy", 4)
      .style("pointer-events", "none");

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x = Math.max(d.value, Math.min(innerWidth - d.value, d.x)))
        .attr("cy", (d: any) => d.y = Math.max(d.value, Math.min(innerHeight - d.value, d.y)));

      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default RecruiterNetwork;