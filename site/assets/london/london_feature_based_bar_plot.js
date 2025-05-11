export function drawBarplot(data) {
    // Create svg plan in the chart div
    const chartContainer = d3.select("#feature-based-bar-plot-chart");
    const margin = {top: 40, right: 300, bottom: 60, left: 70},
          width = 800 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const svg = chartContainer.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    data.forEach(d => {
        d.area = +d['Square Meters'];
        d.price = +d['Price (£)'];
        delete d['Square Meters'];
        delete d['Price (£)'];
        d.Bedrooms = +d.Bedrooms;
        d.Bathrooms = +d.Bathrooms;
    })

    //Detect user inputs and update plot accordingly
    d3.selectAll("#bedrooms-select, #bathrooms-select, #min-price-slider, #max-price-slider, #min-size-slider, #max-size-slider, #apartment, #house, #garden, #garage")
        .on("input", applyFilters);

    // Display default plot
    applyFilters();

    function updateChart(filtered) {
        // Compute number of filtered samples in each neighborhood and take top 5
        const neighborhoodCounts = d3.rollups(filtered, v => v.length, d => d.Neighborhood) // array of [neigh, count] entries
            .sort((a, b) => d3.descending(a[1], b[1]))
            .slice(0, 5); 
        const totalCount = filtered.length;

        const x_scale = d3.scaleLinear()
            .domain([0, d3.max(neighborhoodCounts, d => d[1])])
            .range([0, width]);
    
        const y_scale = d3.scaleBand()
            .domain(neighborhoodCounts.map(d => d[0]))
            .range([0, height])
            .padding(0.1);

        const color = d3.scaleOrdinal(d3.schemeDark2);
        
        // Clear the plan
        svg.selectAll("rect, text").remove();
        
        // Draw new bars
        svg.selectAll("rect")
            .data(neighborhoodCounts)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", d => y_scale(d[0]))
            .attr("x", 0)
            .attr("height", y_scale.bandwidth())
            .attr("width", d => x_scale(d[1]))
            .attr("fill", d => color(d[0]));
        
        // Add percentage and neighborhood legend
        svg.selectAll("text")
            .data(neighborhoodCounts)
            .enter()
            .append("text")
            .attr("y", d => y_scale(d[0]) + y_scale.bandwidth() / 2 + 5)
            .attr("x", d => x_scale(d[1]) + 5)
            .attr("fill", "white")
            .text(d => `${d[0]} (${d3.format(".0%")(d[1]/totalCount)})`);
        
    }

    function applyFilters() {
        // Select values entered by the user
        const bedroomVal = d3.select("#bedrooms-select").property("value");
        const bathroomVal = d3.select("#bathrooms-select").property("value");
        const minPriceVal = +d3.select("#min-price-slider").property("value");
        const maxPriceVal = +d3.select("#max-price-slider").property("value");
        const minSizeVal = +d3.select("#min-size-slider").property("value");
        const maxSizeVal = +d3.select("#max-size-slider").property("value");
        const apartmentVal = d3.select("#apartment").property("checked"); // true by default
        const houseVal = d3.select("#house").property("checked"); // true by default
        const gardenVal = d3.select("#garden").property("checked"); // false by default
        const garageVal = d3.select("#garage").property("checked"); // false by default

        // Update values displayed on the page
        d3.select("#min-price-value").text(d3.format(",.0f")(minPriceVal)); 
        d3.select("#min-size-value").text(minSizeVal);
        d3.select("#max-price-value").text(d3.format(",.0f")(maxPriceVal)); 
        d3.select("#max-size-value").text(maxSizeVal);
        
        // Select valid samples
        const filtered = data.filter(d => {
            const bedroomMatch = bedroomVal === "all" ||
                (bedroomVal === "4+" ? d.Bedrooms >= 4 : d.Bedrooms == +bedroomVal);
            const bathroomMatch = bathroomVal === "all" ||
                (bathroomVal === "3+" ? d.Bathrooms >= 3 : d.Bathrooms == +bathroomVal);
            const apartmentMatch = (apartmentVal ? d["Property Type"] === "Apartment" : false);
            const houseMatch = (houseVal ? d["Property Type"] === "Semi-Detached" || d["Property Type"] === "Detached House" : false);
            const gardenMatch = (gardenVal ? d.Garden === "Yes" : true);
            const garageMatch = (garageVal ? d.Garage === "Yes" : true);
            return bedroomMatch && bathroomMatch &&
                    d.price >= minPriceVal && 
                    d.price <= maxPriceVal && 
                    d.area >= minSizeVal &&
                    d.area <= maxSizeVal &&
                    (apartmentMatch || houseMatch) &&
                    gardenMatch &&
                    garageMatch;
        });

        // Update bar plot
        updateChart(filtered);
    }

    
}