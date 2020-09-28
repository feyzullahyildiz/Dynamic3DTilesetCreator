const path = require('path')
const express = require('express')
const app = express();
const { Cartesian3, HeadingPitchRoll, Transforms, Matrix4, Cartographic } = require('cesium')

app.use(express.static(path.resolve(__dirname, 'public')))

app.get('/api/tileset.json', (req, res) => {
    
    const southWest = Cartographic.fromDegrees(28.804961,41.067761);
    const northEast = Cartographic.fromDegrees(28.815170,41.071550);
    console.log('southWest', southWest)
    console.log('northEast', northEast)
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
                    // 0.5028020666793648,
                    // 0.7158926326772073,
                    // 0.5039214457439004,
                    // 0.7168435953563773,
                    southWest.longitude,
                    southWest.latitude,
                    northEast.longitude,
                    northEast.latitude,
                    0,
                    196.10000000000002
                ]
            }
        }
    }
    res.json(tilesetJson);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('app started')
})