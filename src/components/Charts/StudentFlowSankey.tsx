import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { DepartmentData, SankeyData } from '../../types';

interface StudentFlowSankeyProps {
  data: DepartmentData[];
}

const StudentFlowSankey: React.FC<StudentFlowSankeyProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare data for Sankey diagram
    // We'll create a flow from status -> domain -> company
    const statusMap: Record<string, number> = {};
    const domainMap: Record<string, Record<string, number>> = {};
    const companyMap: Record<string, Record<string, number>> = {};

    // Count students by status, domain, and company
    data.forEach(student => {
      const status = student.status;
      const domain = student.domain || 'Unknown';

      // Increment status count
      statusMap[status] = (statusMap[status] || 0) + 1;

      // Initialize domain map for this status if not exists
      if (!domainMap[status]) {
        domainMap[status] = {};
      }

      // Increment domain count for this status
      domainMap[status][domain] = (domainMap[status][domain] || 0) + 1;

      // For placed students, track companies
      if (status === 'Placed' && student.company) {
        // Initialize company map for this domain if not exists
        if (!companyMap[domain]) {
          companyMap[domain] = {};
        }

        // Increment company count for this domain
        companyMap[domain][student.company] = (companyMap[domain][student.company] || 0) + 1;
      }
    });

    // Create nodes and links for Sankey diagram
    const nodes: Array<{ name: string }> = [];
    const links: Array<{ source: number; target: number; value: number }> = [];

    // Add status nodes
    const statusNodes = Object.keys(statusMap);
    statusNodes.forEach(status => {
      nodes.push({ name: status });
    });

    // Add domain nodes and links from status to domain
    let nodeIndex = statusNodes.length;
    const domainIndices: Record<string, number> = {};

    statusNodes.forEach((status, statusIndex) => {
      const domains = domainMap[status] || {};
      
      Object.entries(domains).forEach(([domain, count]) => {
        if (!domainIndices[domain]) {
          domainIndices[domain] = nodeIndex++;
          nodes.push({ name: domain });
        }

        links.push({
          source: statusIndex,
          target: domainIndices[domain],
          value: count
        });
      });
    });

    // Add company nodes and links from domain to company
    const companyIndices: Record<string, number> = {};

    Object.entries(companyMap).forEach(([domain, companies]) => {
      if (domainIndices[domain]) {
        Object.entries(companies).forEach(([company, count]) => {
          if (!companyIndices[company]) {
            companyIndices[company] = nodeIndex++;
            nodes.push({ name: company });
          }

          links.push({
            source: domainIndices[domain],
            target: companyIndices[company],
            value: count
          });
        });
      }
    });

    // Set up the dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up Sankey generator
    const sankeyGenerator = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[0, 0], [innerWidth, innerHeight]]);

    // Generate layout
    const sankeyData = sankeyGenerator({
      nodes: nodes.map(d => Object.assign({}, d)),
      links: links.map(d => Object.assign({}, d))
    });

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(['Placed', 'Not Placed', 'In Process'])
      .range(['#2563EB', '#EF4444', '#F59E0B']);

    // Draw links
    svg.append("g")
      .selectAll("path")
      .data(sankeyData.links)
      .enter()
      .append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d: any) => {
        // Get source node
        const sourceNode = sankeyData.nodes[d.source.index];
        return d3.color(colorScale(sourceNode.name) as string)?.darker(0.5) as string;
      })
      .attr("stroke-width", (d: any) => Math.max(1, d.width))
      .attr("fill", "none")
      .attr("opacity", 0.5)
      .append("title")
      .text((d: any) => `${d.source.name} → ${d.target.name}: ${d.value}`);

    // Draw nodes
    const nodes_g = svg.append("g")
      .selectAll("rect")
      .data(sankeyData.nodes)
      .enter()
      .append("g");

    nodes_g.append("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("fill", (d: any) => {
        if (['Placed', 'Not Placed', 'In Process'].includes(d.name)) {
          return colorScale(d.name) as string;
        }
        return '#64748b';
      })
      .attr("stroke", "#fff")
      .append("title")
      .text((d: any) => `${d.name}: ${d.value}`);

    // Add node labels
    nodes_g.append("text")
      .attr("x", (d: any) => d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", (d: any) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d: any) => d.x0 < innerWidth / 2 ? "start" : "end")
      .text((d: any) => {
        const name = d.name;
        return name.length > 18 ? name.substring(0, 16) + "..." : name;
      })
      .attr("font-size", "10px")
      .attr("fill", "#64748b");

  }, [data]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default StudentFlowSankey;