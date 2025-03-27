
import requests
import pandas as pd
import numpy as np
import json
import plotly.express as px

# Load the GeoJSON
url = "https://raw.githubusercontent.com/codeforgermany/click_that_hood/master/public/data/madrid-districts.geojson"
geojson = requests.get(url).json()

# Extract neighborhood names
neighborhoods = [feature['properties']['name'] for feature in geojson['features']]

# Create a DataFrame with random values
df = pd.DataFrame({
    'neighborhood': neighborhoods,
    'value': np.random.randint(50, 500, size=len(neighborhoods))  # Random values
})

print(df.head())



fig = px.choropleth_mapbox(
    df,
    geojson=geojson,
    locations='neighborhood',          # this column in your df
    featureidkey='properties.name',    # matches what’s in the geojson
    color='value',                     # metric you want to visualize
    color_continuous_scale="Viridis",
    mapbox_style="open-street-map",
    zoom=10,
    center={"lat": 40.4168, "lon": -3.7038},  # center on Madrid
    opacity=0.6,
    labels={'value': 'Your Metric'}
)

fig.update_layout(margin={"r":0,"t":0,"l":0,"b":0})
fig.show()



# fig = px.choropleth(df, geojson=geojson, color="Bergeron",
#                     locations="neighborhood", featureidkey="properties.name",
#                     projection="mercator", center={"lat": 40.4168, "lon": -3.7038},  # center on Madrid
#                    )
# fig.update_geos(fitbounds="locations", visible=False)
# fig.update_layout(margin={"r":0,"t":0,"l":0,"b":0})
# fig.show()