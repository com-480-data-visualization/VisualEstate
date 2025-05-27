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
        d.area = +d.area;
        d.price = +d.price;
        d.rooms = +d.rooms;
    });

    const priceSlider = document.getElementById('price-slider');
    const sizeSlider = document.getElementById('size-slider');

    noUiSlider.create(priceSlider, {
        start: [30000, 15900000],
        margin: 10000,
        connect: true,
        tooltips: wNumb({
            decimals: 0,
            thousand: ','
        }),
        step: 10000,
        range: {
            'min': [30000],
            'max': [15900000]
        }
    });

    noUiSlider.create(sizeSlider, {
        start: [10, 970],
        margin: 10,
        connect: true,
        tooltips: wNumb({
            decimals: 0
        }),
        step: 10,
        range: {
            'min': [10],
            'max': [970]
        }
    });


    // Detect user inputs and update plot accordingly
    d3.selectAll("#rooms-select").on("input", applyFilters);
    priceSlider.noUiSlider.on('update', applyFilters);
    sizeSlider.noUiSlider.on('update', applyFilters);

    // Display default plot
    applyFilters();

    function updateChart(filtered) {
        // Compute number of filtered samples in each neighborhood and take top 5
        const neighborhoodCounts = d3.rollups(filtered, v => v.length, d => d.neighborhood) // array of [neigh, count] entries
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

        const color = d3.scaleOrdinal()
            .domain(neighborhoodCounts.map(d => d[0]))
            .range(["#D5C4B2","#A64826","#DAE6E5","#969B87", "#5F575C"]);
            
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
        const roomVal = d3.select("#rooms-select").property("value");
        const pricesVal = priceSlider.noUiSlider.get();
        const minPriceVal = +pricesVal[0];
        const maxPriceVal = +pricesVal[1];
        const sizesVal = sizeSlider.noUiSlider.get();
        const minSizeVal = +sizesVal[0];
        const maxSizeVal = +sizesVal[1];
        
        // Select valid samples
        const filtered = data.filter(d => {
            const roomMatch = roomVal === "all" ||
                (roomVal === "5+" ? d.rooms >= 5 : d.rooms == +roomVal);
            return roomMatch && 
                    d.price >= minPriceVal && 
                    d.price <= maxPriceVal && 
                    d.area >= minSizeVal &&
                    d.area <= maxSizeVal;
        });

        // Update bar plot
        updateChart(filtered);
    }

    
}