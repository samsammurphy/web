import os
import json
import pandas
import numpy

base_path = os.path.dirname(os.path.realpath(__file__))

# read the state data
json_file = 'stateData.geojson'
with open(os.path.join(base_path, json_file)) as file:
  original_data = json.load(file)

# read the new data
new_file = 'fire_stats.csv'
with open(os.path.join(base_path, new_file)) as file:
  db = pandas.read_csv(file)
  csv_states = list(db['State'])
  csv_acres_burned = numpy.array(db['Number_of_acres_burned'], dtype=float)

# update state data with number of acres burned
new_features = []
for feature in original_data['features']:
  
  # original properties
  properties = feature['properties']
  state_name = properties['name']

  # find acres for this state
  state_name_csv = state_name.replace(' ', '_')
  state_index = csv_states.index(state_name_csv)
  acres_burned = csv_acres_burned[state_index]
  
  # create new feature
  new_feature = feature
  new_properties = {'name': state_name, 'acres_burned':acres_burned}
  new_feature['properties'] = new_properties
  new_features.append(new_feature)

featureCollection = {'type':'FeatureCollection', 'features':new_features}

# write to file
with open(os.path.join(base_path, 'new_stateData.geojson'), 'w') as outfile:
    json.dump(featureCollection, outfile)
