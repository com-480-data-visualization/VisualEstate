import { drawScatterplot } from "../assets/berlin/berlin_scatter_plot.js";
import { drawBarplot } from "../assets/berlin/berlin_feature_based_bar_plot.js";
import { drawMap } from "../assets/berlin/berlin_map.js";

// Load datasets and call visualization functions
Promise.all([
    d3.json("../webdata/berlin_neighborhoods.geojson"),
    d3.csv("../webdata/berlin_final_dataset.csv")
]).then(([geoData, data]) => {
    drawScatterplot(data);
    drawBarplot(data);
    drawMap(geoData, data);
});
