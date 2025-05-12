export function drawMap(geoData, districtData) {

    const width = 800, height = 400;

    const svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    
    const projection = d3.geoMercator()
    .fitSize([width, height], geoData);  

    const path = d3.geoPath().projection(projection);
    const tooltip = d3.select("#map").append("div").attr("class", "berlin-tooltip");

    // Map object to get price-per-sqm for each district
    const priceMap = d3.rollup(
        districtData,
        v => d3.mean(v, d => +d.price_per_area),
        d => d.neighborhood
    );

    // Compute color scale
    const prices = Array.from(priceMap.values());
    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
        .domain([d3.min(prices), d3.max(prices)]);

    svg.selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("class", "district")
        .attr("stroke", "black")
        .attr("fill", d => {
            const price = priceMap.get(d.properties.Gemeinde_name);
            return price ? colorScale(price) : "#ccc";
            
        })
        .attr("d", path)
        .on("mouseover", function(event, d) {
            const name = d.properties.Gemeinde_name;
            const price = priceMap.get(name);
            tooltip.transition().duration(100).style("opacity", 0.9);
            tooltip.html(`<strong>${name}</strong><br>Avg price: ${price ? d3.format(".0f")(price) + " €/m²" : "N/A"}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.transition().duration(200).style("opacity", 0));

        
}

