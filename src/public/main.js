
const element = document.getElementById('cesiumContainer');


const viewer = new Cesium.Viewer(cesiumContainer, {

})

const tileset = new Cesium.Cesium3DTileset({
    url: '/api/tileset.json'
})
tileset.debugShowBoundingVolume = true
tileset.debugColorizeTiles = true

viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.3, 0.0));

