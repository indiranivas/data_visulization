import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DepartmentData } from '../../types';

interface DomainSunburstChartProps {
  data: DepartmentData[];
}

interface HierarchyNode {
  name: string;
  value?: number;
  children?: HierarchyNode[];
}

const DomainSunburstChart: React.FC<DomainSunburstChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare the data
    const domainRoleMap: { [key: string]: { [key: string]: number } } = {};

    // Group data by domain and role
    data.forEach(student => {
      if (student.domain && student.role) {
        if (!domainRoleMap[student.domain]) {
          domainRoleMap[student.domain] = {};
        }
        if (!domainRoleMap[student.domain][student.role]) {
          domainRoleMap[student.domain][student.role] = 0;
        }
        domainRoleMap[student.domain][student.role]++;
      }
    });

    // Convert to hierarchy structure
    const hierarchyData: HierarchyNode = {
      name: "Domains",
      children: Object.entries(domainRoleMap).map(([domain, roles]) => ({
        name: domain,
        children: Object.entries(roles).map(([role, count]) => ({
          name: role,
          value: count
        }))
      }))
    };

    // Set up the dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = Math.min(width, height) / 2;

    // Create the SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create the partition layout
    const partition = d3.partition()
      .size([2 * Math.PI, radius]);

    // Create the hierarchy
    const root = d3.hierarchy(hierarchyData)
      .sum(d => d.value || 0);

    // Generate the arc
    const arc = d3.arc<d3.HierarchyRectangularNode<HierarchyNode>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw the chart
    svg.selectAll("path")
      .data(partition(root).descendants())
      .enter()
      .append("path")
      .attr("d", arc)
      .style("fill", (d: any) => color(d.data.name))
      .style("opacity", 0.8)
      .style("stroke", "white")
      .style("stroke-width", 1)
      .on("mouseover", function() {
        d3.select(this).style("opacity", 1);
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 0.8);
      })
      .append("title")
      .text((d: any) => `${d.ancestors().map((d: any) => d.data.name).reverse().join("/")}\nCount: ${d.value}`);

    // Add labels
    svg.selectAll("text")
      .data(partition(root).descendants().filter(d => d.y1 - d.y0 > 10 && (d.x1 - d.x0) > 0.1))
      .enter()
      .append("text")
      .attr("transform", function(d: any) {
        const x = (d.x0 + d.x1) / 2;
        const y = (d.y0 + d.y1) / 2;
        const angle = x - Math.PI / 2;
        const rotate = angle * (180 / Math.PI);
        return `translate(${Math.cos(angle) * y},${Math.sin(angle) * y}) rotate(${rotate})`;
      })
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .text((d: any) => d.data.name);

  }, [data]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default DomainSunburstChart;