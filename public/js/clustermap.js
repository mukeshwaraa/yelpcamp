var map,marker;
        function initMap1() {
            map = new mappls.Map('map', {
                center: [28.61, 77.23],
                zoomControl: true,
                zoom:8,
                location: true,
            });
            map.on('styleimagemissing', (e) => {
                // console.log('hai')

                const id = e.id; // id of the missing image
                // console.log(id) 
                // console.log(e)                
                // Check if this missing icon is
                // one this function can generate.
                const prefix = 'square-rgb-';
                // if (!id.includes(prefix)) return;
                 
                // Get the color from the id.
                // const rgb = id.replace(prefix, '').split(',').map(Number);
                 
                const width = 64; // The image will be 64 pixels square.
                const bytesPerPixel = 4; // Each pixel is represented by 4 bytes: red, green, blue, and alpha.
                const data = new Uint8Array(width * width * bytesPerPixel);
                 
                // for (let x = 0; x < width; x++) {
                // for (let y = 0; y < width; y++) {
                // const offset = (y * width + x) * bytesPerPixel;
                // data[offset + 0] = rgb[0]; // red
                // data[offset + 1] = rgb[1]; // green
                // data[offset + 2] = rgb[2]; // blue
                // data[offset + 3] = 255; // alpha
                // }
                // }
                 
                map.addImage('map_sdk?layer=vector&v=3.0&callback=initMap1', { width: width, height: width, data: data });
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
                // map.addImage('https://apis.mappls.com/advancedmaps/api/835cde86-e175-4e5c-87a1-806292b4e31a/map_sdk?layer=vector&v=3.0&callback=initMap1')
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


