// landsat tiler
const landsat_tiler_url = 'https://ihttqm0c4g.execute-api.us-west-2.amazonaws.com/production'

// mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Ftc2FtbXVycGh5IiwiYSI6ImNqN2hkdmd0NDFoNGoyd28ycXNha2gwNngifQ.3m5UZyo8_nhxg-s2-tHe8Q';

// hotvectors
const bucket = 'https://s3.eu-west-2.amazonaws.com/hotvectors/';
let centroids = 'centroids.geojson';
let polygons = 'polygons.geojson';   

// satellite scene
let scene = {};          
scene.ID = '';
scene.bands = [7,5,3];// wavebands
scene.pmin = 2;       // min histogram percentile
scene.pmax = 98;      // max histogram percentile

// interactive scope
let scope = {};


$(document).ready(function() {

    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [30.333,-30.125],
        zoom: 8,
        preserveDrawingBuffer: true
    });


    map.on('load', function () {

        addPolygons('polygon_layer');
        addCentroids('centroid_layer');
        // updateTile();   

        $('#share button').click(function() {
            storeMapJSON();
            restoreMapJSON();
            // getScreenShot();
        });
        
    });

    function storeMapJSON() {

        let mapView = {
            'center': map.getCenter().wrap(),
            'zoom': map.getZoom(), 
            'map_style': map.getStyle(),
            'polygons': polygons, 
            'centroids': centroids, 
            'scene_ID': scene.ID,
            'scene_bands': scene.bands,
            'scene_pmin':scene.pmin,
            'scene_pmax':scene.pmax
        };

        // local json of map view
        localStorage.setItem('mapView', JSON.stringify(mapView));

    }

    function restoreMapJSON() {

        let mapView = JSON.parse(localStorage.getItem('mapView'));
        console.log(mapView);

    }

    function getScreenShot(){

        let img  = map.getCanvas().toDataURL("image/png");
        // localStorage.setItem('mapScreenShot', JSON.stringify(img));

    }

    function addPolygons(layer_id){

        map.addLayer({
            "id": layer_id,
            "type": "fill",
            "source": { type: 'geojson', data: bucket+polygons},
            'paint': {'fill-color': 'red','fill-opacity': 0.8}
        });

    }

    function addCentroids(layer_id) {

        map.addLayer({
            "id": layer_id,
            "type": "circle",
            "source": { type: 'geojson', data: bucket+centroids},
            'paint': {'circle-color': {
                        stops: [[8, '#ffff99'], [16, 'red']]
                },
                    'circle-radius': {
                        stops: [[8, 6], [16, 2]]
                },
                    'circle-opacity': {
                        stops: [[10,1], [14,0]]
                }
            }
        });    

    }

    function updateTile(scene_id) {

        // TODO read this from polygons layer attribute in map
        scene.ID = 'LC08_L1TP_139045_20170304_20170316_01_T1';

        let tiler_metadata_url = `${landsat_tiler_url}/landsat/metadata/${scene.ID}?'pmim=${scene.pmin}&pmax=${scene.pmax}`;

        $.getJSON(tiler_metadata_url, (data) => {
            
            scene.metadata = data;
            displayTile();
            map.moveLayer('tile_layer', 'polygon_layer');

        })
            .fail(() => {
                console.log('updateTile error');
            });
    }

    function displayTile() {
    
        let tileURL = `${landsat_tiler_url}/landsat/tiles/${scene.ID}/{z}/{x}/{y}.png?` +
            `rgb=${scene.bands[0]},${scene.bands[1]},${scene.bands[2]}` +
            '&tile=256' +
            `&histo=${scene.metadata.rgbMinMax[scene.bands[0]]}+${scene.metadata.rgbMinMax[scene.bands[1]]}+${scene.metadata.rgbMinMax[scene.bands[2]]}`;
    

        map.addSource('tile_layer', {
            type: 'raster',
            tiles: [tileURL],
            bounds: scene.metadata.bounds,
            minzoom: 7,
            maxzoom: 14,
            tileSize: 256
        });
    
        map.addLayer({
            'id': 'tile_layer',
            'type': 'raster',
            'source': 'tile_layer'
        });
    }

    function cleanupTile(){
        if (map.getSource('tile_layer')) map.removeSource('tile_layer');
        if (map.getLayer('tile_layer')) map.removeLayer('tile_layer');
    }


});