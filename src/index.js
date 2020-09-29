const path = require('path')
const express = require('express')
const app = express();
const fs = require('fs')
const { Cartographic, Cartesian3 } = require('cesium');
const createB3dm = require('./lib/createB3dm');
// const createGltf = require('./lib/createGltf');
const Mesh = require('./lib/Mesh');
app.use(express.static(path.resolve(__dirname, 'public')))

app.get('/api/tileset.json', (req, res) => {

    const southWest = Cartographic.fromDegrees(28.804961, 41.067761);
    const northEast = Cartographic.fromDegrees(28.815170, 41.072550);

    const b3dmSouthWest = Cartographic.fromDegrees(28.8051, 41.068);
    const b3dmNorthEast = Cartographic.fromDegrees(28.8090, 41.070);

    const child2B3dmSouthWest = Cartographic.fromDegrees(28.806, 41.072);
    const child2B3dmNorthEast = Cartographic.fromDegrees(28.81, 41.075);
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
                },
                {
                    "boundingVolume": {
                        "region": [
                            child2B3dmSouthWest.longitude,
                            child2B3dmSouthWest.latitude,
                            child2B3dmNorthEast.longitude,
                            child2B3dmNorthEast.latitude,
                            50,
                            100
                        ]
                    },
                    content: { uri: 'handmade.b3dm' },
                    geometricError: 175.78125,
                    level: 12
                },
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


app.get('/api/handmade.b3dm', async (req, res) => {
    res.set('content-type', 'application/octet-stream');
    const arrowGltfBuffer = fs.readFileSync(path.resolve(__dirname, 'public', 'asset', 'triangle.gltf'));
    // console.log(header);

    const binaryGltHeader = Buffer.alloc(20);
    binaryGltHeader.write('gltf', 0);
    binaryGltHeader.writeInt32LE(2, 4);
    binaryGltHeader.writeInt32LE(arrowGltfBuffer.length + 12, 8);
    binaryGltHeader.writeInt32LE(arrowGltfBuffer.length, 12);
    binaryGltHeader.write('JSON', 16);
    console.log('binaryGltHeader', binaryGltHeader)
    const glbBuffer = Buffer.concat([binaryGltHeader, arrowGltfBuffer])

    const featureTable = Buffer.alloc(0);
    const batchTable = Buffer.alloc(0);
    const headerSize = 28;
    const header = Buffer.alloc(headerSize);
    const totalByteLength = featureTable.length + batchTable.length + headerSize + glbBuffer.length;
    header.write('b3dm', 0);
    header.writeInt32LE(1, 4);
    header.writeInt32LE(totalByteLength, 8);


    const responseBuffer = Buffer.concat([
        header, featureTable, batchTable, glbBuffer
    ])
    res.send(responseBuffer)
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('app started')
})