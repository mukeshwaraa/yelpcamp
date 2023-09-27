var map,marker;
        function initMap1() {
            map = new mappls.Map('map', {
                center: [28.61, 77.23],
                zoomControl: true,
                zoom:8,
                location: true,
            });
            map.on('load', function() {
                var all_data = [];
                for (c of cs) {
                    obj = {
                        "type": "Feature",
                        "properties": {
                            "htmlPopup": `<a class="chan" href="/camps/${c._id}">${c.name}</a>`, "icon-size1": 0.55
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [c.location.lat, c.location.long]
                        }
                    }
                    all_data.push(obj);
                }
                marker = new mappls.Marker({
                    map: map,
                    position: {
                        "id": "ravi",
                        "type": "FeatureCollection",
                        "features": all_data
                    },
                    fitbounds: true,
                    icon: 'https://apis.mapmyindia.com/map_v3/2.png',
                    offset: [0, -40],
                    draggable: false,
                    clustersOptions: {
                        background: [
                            [1, 'green'],
                            [5, 'red'],
                            [10, 'yellow'],
                            [20, 'orange'],
                            [35, 'blue']
                        ], // steps in background color (in pixels)
                        maxZoom: 7, // that zoom for split cluster circle 
                        radius: [
                            [1, 15],
                            [5, 20],
                            [10, 30],
                            [20, 40],
                            [35, 50],
                        ] // steps in cluster radius (in pixels)
                    }
                    /*Using steps expressions - introduced in background color, and radius - Produces discrete,
                    stepped results by evaluating a piecewise-constant function defined by pairs of input and 
                    output values ("stops"). Stop inputs must be numeric literals in strictly ascending order. */
                });
            })
        }
        // generate random lat lng    
        function randomNumber(min, max) {
            return Math.random() * (max - min) + min
        }