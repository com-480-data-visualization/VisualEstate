import { drawBarplot } from "../assets/london/london_feature_based_bar_plot.js";

// Load dataset and call visualization functions
d3.csv("../../data/london_houses_dec2024.csv").then(data => {
    drawBarplot(data);
});