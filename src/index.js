const path = require('path')
const express = require('express')
const app = express();
const fs = require('fs')
const { Cartographic, Cartesian3 } = require('cesium');
const createB3dm = require('./lib/createB3dm');
// const createGltf = require('./lib/createGltf');
const Mesh = require('./lib/Mesh');
app.use(express.static(path.resolve(__dirname, 'public')))

const FIXED_GLTF_PATH = path.resolve(__dirname, 'public', 'asset', 'transformed-triangle.gltf');
app.get('/api/tileset.json', (req, res) => {

    const southWest = Cartographic.fromDegrees(28.804961, 41.067761);
    const northEast = Cartographic.fromDegrees(28.815170, 41.072550);

    const b3dmSouthWest = Cartographic.fromDegrees(28.8051, 41.068);
    const b3dmNorthEast = Cartographic.fromDegrees(28.8090, 41.070);

    const child2B3dmSouthWest = Cartographic.fromDegrees(28.81, 41.07);
    const child2B3dmNorthEast = Cartographic.fromDegrees(28.815, 41.072);
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
            // children: [
            //     {
            //         "boundingVolume": {
            //             "region": [
            //                 b3dmSouthWest.longitude,
            //                 b3dmSouthWest.latitude,
            //                 b3dmNorthEast.longitude,
            //                 b3dmNorthEast.latitude,
            //                 0,
            //                 160
            //             ]
            //         },
            //         content: { uri: 'data.b3dm' },
            //         geometricError: 175.78125,
            //         level: 12
            //     },
            //     // {
            //     //     "boundingVolume": {
            //     //         "region": [
            //     //             child2B3dmSouthWest.longitude,
            //     //             child2B3dmSouthWest.latitude,
            //     //             child2B3dmNorthEast.longitude,
            //     //             child2B3dmNorthEast.latitude,
            //     //             5,
            //     //             115
            //     //         ]
            //     //     },
            //     //     content: { uri: 'data.b3dm' },
            //     //     geometricError: 175.78125,
            //     //     level: 12
            //     // },
            // ]
        }
    }
    res.json(tilesetJson);
})

app.get('/api/data.b3dm', async (req, res) => {
    res.set('content-type', 'application/octet-stream');
    const fixedGltf = fs.readFileSync(FIXED_GLTF_PATH);
    const resultBuffer = createB3dm({
        glb: fixedGltf,
    })
    // console.log(header);
    // const resultBuffer = Buffer.concat([header, arrowGltfBuffer])
    res.send(resultBuffer)
})

app.get('/api/fixed.gltf', (req, res) => {
    const fixedGltf = fs.readFileSync(FIXED_GLTF_PATH);
    res.send(fixedGltf);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('app started at ', port)
})