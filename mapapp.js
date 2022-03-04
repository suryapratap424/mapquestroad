L.mapquest.key = '0fBkcejTMNfxpI1LB61wOzDjt7t7AASA';
key = L.mapquest.key
// let map = L.mapquest.map('map', {
//     center: [37.7749, -122.4194],
//     layers: L.mapquest.tileLayer('map'),
//     zoom: 12
// });
var map = new mqgl.Map('map', key);
let start = placeSearch({
    key,
    container: document.getElementById('start')
});
let end = placeSearch({
    key,
    container: document.getElementById('destination')
});
map.load(function () {
    console.log('ha')
    map.draw.line([[77.090401,28.888844], [77.088547,28.889584]]);
    map.fitBounds();
});
var directions = L.mapquest.directions();
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault()
    let st = start.getVal().replace(/ /g,'+')
    let en = end.getVal().replace(/ /g,'+')
    let url = `http://www.mapquestapi.com/directions/v2/route?key=${key}&from=${st}&to=${en}`
    fetch(url).then(r=>r.json()).then(r=>{
        getDataOfMap(stations).then(station=>{
            let arr= r.route.legs[0].maneuvers.map(x=>[x.startPoint.lng,x.startPoint.lat])
            console.log(arr)
            arr.reduce((prev, now, index, arrr) => {
                let near = checknear(now)
                console.log(near)
                map.draw.line([prev, now],near.color);
                return now
            })
            console.log('ho gya')
            console.log(url)
        })
    })
    function checknear([lng, lat]) {
        let neareststation = {};
        let nearest = Infinity;
        for (let i = 0; i < stations.length; i++) {
          if (stations[i]) {
            const [Mlat, Mlng] = [stations[i].lat, stations[i].lng];
            let distance =
              (lat - Mlat) * (lat - Mlat) + (lng - Mlng) * (lng - Mlng);
            if (distance < nearest) {
              nearest = distance;
              neareststation = stations[i];
            }
          }
        }
        return neareststation;
    }
    function getDataOfMap(stations) {
        let arrofpromis = stations.map((station) => {
          let one = fetch(
            `http://jtaqi.herokuapp.com/data?lat=${station.lat}&lon=${station.lng}`
          )
            .then((r) => r.json())
            .then((x) => {
              let b = color(x.list[0].components.pm10);
              station.color = b;
              return station;
            })
            .catch((e) => undefined);
          if (one) return one;
        });
        return Promise.all(arrofpromis);
      }
      function color(c) {
        if (c < 50) {
          return "green";
        }
        if (c < 60) {
          return "#70b900";
        }
        if (c < 70) {
          return "yellow";
        }
        if (c < 80) {
          return "orange";
        }
        if (c > 80) {
          return "red";
        }
      }
    // map.remove()
    // map = L.mapquest.map('map', {
    //     center: [37.7749, -122.4194],
    //     layers: L.mapquest.tileLayer('map'),
    //     zoom: 12
    // });
    // directions.route({
    //     start: start.getVal(),
    //     end: end.getVal()
    // }, directionsCallback)
    // console.log(rute)
    // let directionsLayer
    // function directionsCallback(error, response) {


    //     // if (directionsLayer != undefined)
    //     //     directionsLayer.clearLayers()
    //     console.log('ha bhai')
    //     // directionsLayer = L.mapquest.directionsLayer({
    //     // directionsResponse: response
    //     // }).addTo(map);
    //     console.log(error)
    //     console.log(response)
    //     let rote = response.route.shape
    //     let y = rote.shapePoints.map(e => [e.lat, e.lng])
    //     createColoRoad(y)
    //     console.log(y)
    // }
    // function createColoRoad(arr, stations) {
    //     let temp = []
    //     arr.reduce((prev, now, index, arrr) => {
    //         map.draw.line([prev, now])
    //         // if (stations) {
    //         //     let nearStation = checknear(prev, stations)
    //         //     line.setStyle({ color: nearStation.color, weight: 3 })
    //         //     line.bindPopup(nearStation.name)
    //         // } else {
    //         //     line.setStyle({ color: 'red', weight: 3 })
    //         // }
    //         // temp.push(line)
    //         // return now
    //     })
    //     // layer = L.layerGroup(temp).addTo(map);
    // }
})