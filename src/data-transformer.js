const { Cartesian3 } = require('cesium');
const path = require('path');
const fs = require('fs');


const gltfPath = path.join(__dirname, 'public', 'asset', 'triangle.gltf');
const gltf = JSON.parse(fs.readFileSync(gltfPath, { encoding: 'utf-8' }));
const uri = gltf.buffers[0].uri;
const base64Text = uri.split('base64,')[1];
const base64TextFirstPartAsBuffer = Buffer.from(base64Text, 'base64');
const fistPartAsBuffer = base64TextFirstPartAsBuffer.slice(0, 8)

const p1 = [28.809181, 41.069518, 10];
const p2 = [28.809856, 41.069146, 10];
const p3 = [28.810141, 41.069603, 30];
const c1 = Cartesian3.fromDegrees(...p1);
const c2 = Cartesian3.fromDegrees(...p2);
const c3 = Cartesian3.fromDegrees(...p3);
const newCoordinateBuffer = Buffer.alloc(36);
let index = 0;
function appendData(component) {
  newCoordinateBuffer.writeFloatLE(component, index * 4);
  index++;
}
appendData(c1.x);
appendData(c1.y);
appendData(c1.z);

appendData(c2.x);
appendData(c2.y);
appendData(c2.z);

appendData(c3.x);
appendData(c3.y);
appendData(c3.z);

const newUriBuffer = Buffer.concat([fistPartAsBuffer, newCoordinateBuffer]);
const uriPrefix = 'data:application/octet-stream;base64,';
const newUri = uriPrefix + newUriBuffer.toString('base64');

const minX = Math.min(c1.x, c2.x, c3.x);
const maxX = Math.max(c1.x, c2.x, c3.x);

const minY = Math.min(c1.y, c2.y, c3.y);
const maxY = Math.max(c1.y, c2.y, c3.y);

const minZ = Math.min(c1.z, c2.z, c3.z);
const maxZ = Math.max(c1.z, c2.z, c3.z);


const min = [minX, minY, minZ];
const max = [maxX, maxY, maxZ];
console.log('min', min)
console.log('max', max)
gltf.buffers[0].uri = newUri;
gltf.accessors[1].max = max;
gltf.accessors[1].min = min;
const newFilePath = path.join(__dirname, 'public', 'asset', 'transformed-triangle.gltf');
fs.writeFileSync(newFilePath, JSON.stringify(gltf, null, 2));