
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


viewer.imageryLayers._layers[0].show = false

const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(28.8, 41.067761, 0.0)
);
const model = Cesium.Model.fromGltf({
    url: 'asset/arrow.gltf',
    modelMatrix : modelMatrix,
    scale : 10.0
})

viewer.scene.primitives.add(model);