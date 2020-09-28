const path = require('path')
const express = require('express')
const app = express();
const fs = require('fs')
const { Cartographic } = require('cesium');
const createB3dm = require('./lib/createB3dm')
app.use(express.static(path.resolve(__dirname, 'public')))

app.get('/api/tileset.json', (req, res) => {

    const southWest = Cartographic.fromDegrees(28.804961, 41.067761);
    const northEast = Cartographic.fromDegrees(28.815170, 41.071550);
    const b3dmSouthWest = Cartographic.fromDegrees(28.8051, 41.068);
    const b3dmNorthEast = Cartographic.fromDegrees(28.8090, 41.070);
    // console.log('southWest', southWest)
    // console.log('northEast', northEast)
    const tilesetJson = {
        "asset": {
            "version": "0.0",
            "tilesetVersion": "1.0",
            "time": 1203
        },
        "geometricError": 175.78125,
        "root": {
            "level": 11,
            "geometricError": 175.78125,
            "refine": "ADD",
            "boundingVolume": {
                "region": [
                    southWest.longitude,
                    southWest.latitude,
                    northEast.longitude,
                    northEast.latitude,
                    0,
                    196.10000000000002
                ]
            },
            children: [
                {
                    "boundingVolume": {
                        "region": [
                            b3dmSouthWest.longitude,
                            b3dmSouthWest.latitude,
                            b3dmNorthEast.longitude,
                            b3dmNorthEast.latitude,
                            0,
                            160
                        ]
                    },
                    content: { uri: 'data.b3dm' },
                    geometricError: 175.78125,
                    level: 12
                }
            ]
        }
    }
    res.json(tilesetJson);
})

app.get('/api/data.b3dm', (req, res) => {
    res.set('content-type', 'application/octet-stream');
    const arrowGltfBuffer = fs.readFileSync(path.resolve(__dirname, 'public', 'asset', 'arrow.glb'));
    const resultBuffer = createB3dm({
        glb: arrowGltfBuffer,
    })
    // console.log(header);
    // const resultBuffer = Buffer.concat([header, arrowGltfBuffer])
    res.send(resultBuffer)
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('app started')
})