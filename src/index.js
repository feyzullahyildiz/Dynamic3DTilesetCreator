// const createGltf = require('obj2gltf/lib/createGltf');
require('obj2gltf/')
// const gltf = createGltf({
//     name: "mygltfname",
//     nodes: [],
//     materials: [],
// }, {})

// console.log('GLTF', gltf)

const buffer = Buffer.alloc(32);
buffer.write('AAAA', 0)

buffer.writeUInt32LE(0xabcdef, 4)
// buffer.writeUInt32LE(0x1234, 8)

// buffer.writeUInt32LE(0x1234, 4)
// buffer.writeUInt32LE(0x1234, 8)

console.log(buffer)
console.log(buffer.toString())