import { drawScatterplot } from "../assets/madrid/madrid_scatter_plot.js";
import { drawBarplot } from "../assets/madrid/madrid_feature_based_bar_plot.js";

// Load dataset and call visualization functions
d3.csv("../webdata/madrid_final_dataset.csv").then(data => {
    drawScatterplot(data);
    drawBarplot(data);
});