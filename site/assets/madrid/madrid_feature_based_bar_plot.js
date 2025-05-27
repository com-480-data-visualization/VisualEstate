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
        d.m2 = +d.m2;
        d.price = +d.price;
        d.rooms = +d.rooms;
    });

    const priceSlider = document.getElementById('price-slider');
    const sizeSlider = document.getElementById('size-slider');

    noUiSlider.create(priceSlider, {
        start: [40000, 13950000],
        margin: 10000,
        connect: true,
        tooltips: wNumb({
            decimals: 0,
            thousand: ','
        }),
        step: 10000,
        range: {
            'min': [40000],
            'max': [13950000]
        }
    });

    noUiSlider.create(sizeSlider, {
        start: [20, 990],
        margin: 10,
        connect: true,
        tooltips: wNumb({
            decimals: 0
        }),
        step: 10,
        range: {
            'min': [20],
            'max': [990]
        }
    });

    // Detect user inputs and update plot accordingly
    d3.selectAll("#rooms-select, #apartment, #house, #elevator, #garage")
        .on("input", applyFilters);
    priceSlider.noUiSlider.on('update', applyFilters);
    sizeSlider.noUiSlider.on('update', applyFilters);

    // Display default plot
    applyFilters();

    function updateChart(filtered) {
        // Compute number of filtered samples in each neighborhood and take top 5
        const districtCounts = d3.rollups(filtered, v => v.length, d => d.district) // array of [neigh, count] entries
            .sort((a, b) => d3.descending(a[1], b[1]))
            .slice(0, 5); 
        const totalCount = filtered.length;

        const x_scale = d3.scaleLinear()
            .domain([0, d3.max(districtCounts, d => d[1])])
            .range([0, width]);
    
        const y_scale = d3.scaleBand()
            .domain(districtCounts.map(d => d[0]))
            .range([0, height])
            .padding(0.1);

        const color = d3.scaleOrdinal(d3.schemePastel1)
            .domain(districtCounts.map(d => d[0]))
            .range(["#FF7F00", "#CAB2D6", "#6A3D9A", "#FFFF99", "#B15928"]);
        
        // Clear the plan
        svg.selectAll("rect, text").remove();
        
        // Draw new bars
        svg.selectAll("rect")
            .data(districtCounts)
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
            .data(districtCounts)
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
        const apartmentVal = d3.select("#apartment").property("checked"); // true by default
        const houseVal = d3.select("#house").property("checked"); // true by default
        const elevatorVal = d3.select("#elevator").property("checked"); // false by default
        const garageVal = d3.select("#garage").property("checked"); // false by default
        
        // Select valid samples
        const filtered = data.filter(d => {
            const roomMatch = roomVal === "all" ||
                (roomVal === "5+" ? d.rooms >= 5 : d.rooms == +roomVal);
            const apartmentMatch = (apartmentVal ? d.house_type === "apartment" : false);
            const houseMatch = (houseVal ? d.house_type === "house" : false);
            const elevatorMatch = (elevatorVal ? d.elevator === "True" : true);
            const garageMatch = (garageVal ? d.garage === "True" : true);
            return roomMatch &&
                    d.price >= minPriceVal && 
                    d.price <= maxPriceVal && 
                    d.m2 >= minSizeVal &&
                    d.m2 <= maxSizeVal &&
                    (apartmentMatch || houseMatch) &&
                    elevatorMatch &&
                    garageMatch;
        });

        // Update bar plot
        updateChart(filtered);
    }

    
}