export function setupInstanceAttribute(attributeLocation, gl, numComponents, stride, offset) {
    if (attributeLocation === -1) {
        return;
    }
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation, numComponents, gl.FLOAT, false, stride, offset);
    gl.vertexAttribDivisor(attributeLocation, 1);
}
