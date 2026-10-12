// The GL type enums below are fixed by the WebGL 2 specification. They're
// spelled out here rather than read from a live context so the lookup table
// can be built once at module load, and each is typed against the matching
// `WebGL2RenderingContext` constant so a wrong value fails type-checking.
const glFloat = 0x1406;
const glFloatVec2 = 0x8b50;
const glFloatVec3 = 0x8b51;
const glFloatVec4 = 0x8b52;
const glFloatMat2 = 0x8b5a;
const glFloatMat3 = 0x8b5b;
const glFloatMat4 = 0x8b5c;
const glFloatMat2x3 = 0x8b65;
const glFloatMat2x4 = 0x8b66;
const glFloatMat3x2 = 0x8b67;
const glFloatMat3x4 = 0x8b68;
const glFloatMat4x2 = 0x8b69;
const glFloatMat4x3 = 0x8b6a;
const glInt = 0x1404;
const glIntVec2 = 0x8b53;
const glIntVec3 = 0x8b54;
const glIntVec4 = 0x8b55;
const glBool = 0x8b56;
const glBoolVec2 = 0x8b57;
const glBoolVec3 = 0x8b58;
const glBoolVec4 = 0x8b59;
const glUnsignedInt = 0x1405;
const glUnsignedIntVec2 = 0x8dc6;
const glUnsignedIntVec3 = 0x8dc7;
const glUnsignedIntVec4 = 0x8dc8;
const glSampler2d = 0x8b5e;
const glSampler3d = 0x8b5f;
const glSamplerCube = 0x8b60;
const glSampler2dShadow = 0x8b62;
const glSampler2dArray = 0x8dc1;
const glSampler2dArrayShadow = 0x8dc4;
const glSamplerCubeShadow = 0x8dc5;
const glIntSampler2d = 0x8dca;
const glIntSampler3d = 0x8dcb;
const glIntSamplerCube = 0x8dcc;
const glIntSampler2dArray = 0x8dcf;
const glUnsignedIntSampler2d = 0x8dd2;
const glUnsignedIntSampler3d = 0x8dd3;
const glUnsignedIntSamplerCube = 0x8dd4;
const glUnsignedIntSampler2dArray = 0x8dd7;
const floatType = (glslName, componentCount, upload) => ({ kind: 'float', glslName, componentCount, upload });
const intType = (kind, glslName, componentCount, upload) => ({ kind, glslName, componentCount, upload });
const uintType = (glslName, componentCount, upload) => ({ kind: 'uint', glslName, componentCount, upload });
const samplerType = (glslName) => ({
    kind: 'sampler',
    glslName,
});
const uniformTypes = new Map([
    [glFloat, floatType('float', 1, (gl, l, d) => gl.uniform1fv(l, d))],
    [glFloatVec2, floatType('vec2', 2, (gl, l, d) => gl.uniform2fv(l, d))],
    [glFloatVec3, floatType('vec3', 3, (gl, l, d) => gl.uniform3fv(l, d))],
    [glFloatVec4, floatType('vec4', 4, (gl, l, d) => gl.uniform4fv(l, d))],
    [
        glFloatMat2,
        floatType('mat2', 4, (gl, l, d) => gl.uniformMatrix2fv(l, false, d)),
    ],
    [
        glFloatMat3,
        floatType('mat3', 9, (gl, l, d) => gl.uniformMatrix3fv(l, false, d)),
    ],
    [
        glFloatMat4,
        floatType('mat4', 16, (gl, l, d) => gl.uniformMatrix4fv(l, false, d)),
    ],
    [
        glFloatMat2x3,
        floatType('mat2x3', 6, (gl, l, d) => gl.uniformMatrix2x3fv(l, false, d)),
    ],
    [
        glFloatMat2x4,
        floatType('mat2x4', 8, (gl, l, d) => gl.uniformMatrix2x4fv(l, false, d)),
    ],
    [
        glFloatMat3x2,
        floatType('mat3x2', 6, (gl, l, d) => gl.uniformMatrix3x2fv(l, false, d)),
    ],
    [
        glFloatMat3x4,
        floatType('mat3x4', 12, (gl, l, d) => gl.uniformMatrix3x4fv(l, false, d)),
    ],
    [
        glFloatMat4x2,
        floatType('mat4x2', 8, (gl, l, d) => gl.uniformMatrix4x2fv(l, false, d)),
    ],
    [
        glFloatMat4x3,
        floatType('mat4x3', 12, (gl, l, d) => gl.uniformMatrix4x3fv(l, false, d)),
    ],
    [glInt, intType('int', 'int', 1, (gl, l, d) => gl.uniform1iv(l, d))],
    [glIntVec2, intType('int', 'ivec2', 2, (gl, l, d) => gl.uniform2iv(l, d))],
    [glIntVec3, intType('int', 'ivec3', 3, (gl, l, d) => gl.uniform3iv(l, d))],
    [glIntVec4, intType('int', 'ivec4', 4, (gl, l, d) => gl.uniform4iv(l, d))],
    [glBool, intType('bool', 'bool', 1, (gl, l, d) => gl.uniform1iv(l, d))],
    [glBoolVec2, intType('bool', 'bvec2', 2, (gl, l, d) => gl.uniform2iv(l, d))],
    [glBoolVec3, intType('bool', 'bvec3', 3, (gl, l, d) => gl.uniform3iv(l, d))],
    [glBoolVec4, intType('bool', 'bvec4', 4, (gl, l, d) => gl.uniform4iv(l, d))],
    [glUnsignedInt, uintType('uint', 1, (gl, l, d) => gl.uniform1uiv(l, d))],
    [glUnsignedIntVec2, uintType('uvec2', 2, (gl, l, d) => gl.uniform2uiv(l, d))],
    [glUnsignedIntVec3, uintType('uvec3', 3, (gl, l, d) => gl.uniform3uiv(l, d))],
    [glUnsignedIntVec4, uintType('uvec4', 4, (gl, l, d) => gl.uniform4uiv(l, d))],
    [glSampler2d, samplerType('sampler2D')],
    [glSampler3d, samplerType('sampler3D')],
    [glSamplerCube, samplerType('samplerCube')],
    [glSampler2dShadow, samplerType('sampler2DShadow')],
    [glSampler2dArray, samplerType('sampler2DArray')],
    [glSampler2dArrayShadow, samplerType('sampler2DArrayShadow')],
    [glSamplerCubeShadow, samplerType('samplerCubeShadow')],
    [glIntSampler2d, samplerType('isampler2D')],
    [glIntSampler3d, samplerType('isampler3D')],
    [glIntSamplerCube, samplerType('isamplerCube')],
    [glIntSampler2dArray, samplerType('isampler2DArray')],
    [glUnsignedIntSampler2d, samplerType('usampler2D')],
    [glUnsignedIntSampler3d, samplerType('usampler3D')],
    [glUnsignedIntSamplerCube, samplerType('usamplerCube')],
    [glUnsignedIntSampler2dArray, samplerType('usampler2DArray')],
]);
/**
 * Looks up the declared type of an active uniform from the GL type enum
 * `getActiveUniform` reports for it.
 * @param glType - The `WebGLActiveInfo.type` of the uniform.
 * @returns The uniform type, or `null` if WebGL 2 doesn't define it as a
 * uniform type.
 */
export const getUniformType = (glType) => uniformTypes.get(glType) ?? null;
const uniformTypesByGlslName = new Map(Array.from(uniformTypes, ([glType, uniformType]) => [
    uniformType.glslName,
    { glType, uniformType },
]));
/**
 * Looks up a uniform type from the GLSL type name it's declared with.
 * @param glslName - The declared type name, e.g. `'vec4'` or `'sampler2D'`,
 * spelled the way `UniformSourceDeclaration.glslTypeName` reports it (`mat4`
 * rather than its alias `mat4x4`).
 * @returns The uniform type and its GL type enum, or `null` if `glslName`
 * isn't a WebGL 2 uniform type (for example, a struct's name).
 */
export const getUniformTypeByGlslName = (glslName) => uniformTypesByGlslName.get(glslName) ?? null;
