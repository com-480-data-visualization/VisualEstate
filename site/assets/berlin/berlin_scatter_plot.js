export function drawScatterplot(data) {

    const margin = {top: 40, right: 300, bottom: 60, left: 70},
        width = 1100 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#scatter")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    data.forEach(d => {
        d.area = +d.area;
        d.price = +d.price;
    });

    const x_scale = d3.scaleLog()
        .domain(d3.extent(data, d => d.area)).nice()
        .range([0, width]);

    const y_scale = d3.scaleLog()
        .domain(d3.extent(data, d => d.price)).nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemePaired);

    svg.append("g")
    //  .attr('class', 'axis')
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x_scale));

    svg.append("g")
    //  .attr('class', 'axis')
        .call(d3.axisLeft(y_scale));

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x_scale(d.area))
        .attr("cy", d => y_scale(d.price))
        .attr("r", 3)
        .attr("fill", d => color(d.neighborhood))
        .attr("opacity", 0.7);

    // Build legend
    const neighborhoods = Array.from(new Set(data.map(d => d.neighborhood))).sort();

    const legend = svg.append("g")
        .attr("transform", `translate(${width + 20}, 0)`);

    neighborhoods.forEach((n, i) => {
        const group = legend.append("g")
            .attr("transform", `translate(0, ${i * 25})`)
            .style("cursor", "pointer")
            .on("click", () => toggleNeighborhood(n));

        group.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color(n));

        group.append("text")
            .attr("x", 24)
            .attr("y", 14)
            .text(n)
            .style("font-size", "12px")
            .style("fill", "white");
    });

    let activeNeighborhood = null;

    function toggleNeighborhood(n) {
        if (activeNeighborhood === n) {
            activeNeighborhood = null;
            svg.selectAll("circle")
                .transition()
                .duration(300)
                .style("opacity", 0.7);
        } else {
            activeNeighborhood = n;
            svg.selectAll("circle")
                .transition()
                .duration(300)
                .style("opacity", d => d.neighborhood === n ? 1 : 0.1);
        }
    }

}