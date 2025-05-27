export function drawScatterplot(data) {

    const margin = {top: 40, right: 180, bottom: 60, left: 70},
        width = 1200 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#scatter")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Get 12 first district with most samples and filter out the others from data
    const districtCounts = d3.rollups(data, v => v.length, d => d.district) // array of [district, count] entries
        .sort((a, b) => d3.descending(a[1], b[1])) // comparator function to arrange in descending order
        .slice(0, 12).map(entry => entry[0]); 
    const filtered_data = data.filter(d => districtCounts.includes(d.district));

    filtered_data.forEach(d => {
        d.area = +d.m2;
        d.price = +d.price;
    })

    const x_scale = d3.scaleLog()
        .domain(d3.extent(filtered_data, d => d.area)).nice()
        .range([0, width]);

    const y_scale = d3.scaleLog()
        .domain(d3.extent(filtered_data, d => d.price)).nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemePaired);

    svg.append("g")
    //  .attr('class', 'axis')
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x_scale));

    svg.append("g")
    //  .attr('class', 'axis
        .call(d3.axisLeft(y_scale));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("fill", "white")
        .text("Surface Area (m²)");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .style("fill", "white")
        .text("Price (€)");

    svg.selectAll("circle")
        .data(filtered_data)
        .enter()
        .append("circle")
        .attr("cx", d => x_scale(d.area))
        .attr("cy", d => y_scale(d.price))
        .attr("r", 3)
        .attr("fill", d => color(d.district))
        .attr("opacity", 0.6);

    // Build legend
    const districts = Array.from(new Set(filtered_data.map(d => d.district))).sort();

    const legend = svg.append("g")
        .attr("transform", `translate(${width + 20}, 0)`);

    districts.forEach((n, i) => {
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

    let activeDistrict = null;

    function toggleNeighborhood(n) {
        if (activeDistrict === n) {
            activeDistrict = null;
            svg.selectAll("circle")
                .transition()
                .duration(300)
                .style("opacity", 0.6);
        } else {
            activeDistrict = n;
            svg.selectAll("circle")
                .transition()
                .duration(300)
                .style("opacity", d => d.district === n ? 1 : 0.1);
        }
    }

}