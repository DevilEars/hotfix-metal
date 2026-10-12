import { Matrix3x3, Vec2 } from '../../math/index.js';
import { Texture } from '../texture.js';
import { isVector2 } from './uniform-value.js';
/** How a `number` is uploaded, by the kinds of uniform that accept one. */
const numberUploads = new Map([
    ['float', (gl, location, value) => gl.uniform1f(location, value)],
    ['int', (gl, location, value) => gl.uniform1i(location, value)],
    ['uint', (gl, location, value) => gl.uniform1ui(location, value)],
]);
const typedArrayNames = {
    float: 'a Float32Array',
    int: 'an Int32Array',
    bool: 'an Int32Array',
    uint: 'a Uint32Array',
};
const booleanKinds = new Set(['bool', 'int']);
/**
 * Validates a value against a uniform's declaration and builds the upload
 * that sends it to the GPU when the material is bound.
 *
 * The GL call is chosen from the uniform's declared type, never from the
 * shape of the value, so a 16-float array goes to a `vec4[4]` as four
 * `vec4`s and to a `mat4` as a matrix. A typed array must hold a whole
 * number of elements of the declared type: exactly one for a uniform that
 * isn't an array, or between one and the declared array size for an array
 * (a shorter array updates the leading elements only).
 * @param declaration - The uniform to upload to.
 * @param value - The value to upload.
 * @returns The upload to run on bind.
 * @throws An error if the value can't be assigned to the uniform's declared
 * type.
 */
export const createUniformUpload = (declaration, value) => {
    const { name, glType, uniformType } = declaration;
    if (uniformType === null) {
        throw new Error(`Uniform "${name}" has GL type 0x${glType.toString(16)}, which is not a WebGL 2 uniform type Material can upload.`);
    }
    if (uniformType.kind === 'sampler') {
        return createSamplerUpload(declaration, uniformType, value);
    }
    if (typeof value === 'number') {
        const upload = numberUploads.get(uniformType.kind);
        if (upload === undefined || !isScalar(declaration, uniformType)) {
            throw createMismatchError(declaration, uniformType, value);
        }
        return (gl, location, textureUnit) => {
            upload(gl, location, value);
            return textureUnit;
        };
    }
    if (typeof value === 'boolean') {
        if (!booleanKinds.has(uniformType.kind) ||
            !isScalar(declaration, uniformType)) {
            throw createMismatchError(declaration, uniformType, value);
        }
        return (gl, location, textureUnit) => {
            gl.uniform1i(location, value ? 1 : 0);
            return textureUnit;
        };
    }
    return createArrayUpload(declaration, uniformType, value);
};
const createSamplerUpload = (declaration, uniformType, value) => {
    if (!(value instanceof Texture)) {
        throw createMismatchError(declaration, uniformType, value);
    }
    return createTextureUpload(value);
};
/**
 * Builds an upload that binds `texture` to the next free texture unit and
 * points a `sampler2D` uniform at it.
 * @param texture - The texture to bind.
 * @returns The upload.
 */
export const createTextureUpload = (texture) => (gl, location, textureUnit) => {
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
    gl.uniform1i(location, textureUnit);
    return textureUnit + 1;
};
/**
 * Builds the upload for a uniform a material hasn't set: zero for numbers,
 * vectors and matrices, and `blackTexture` for a `sampler2D`. Every uniform
 * of a shared program gets a value on every bind, so one material never
 * draws with a value another material set.
 * @param declaration - The uniform to upload to.
 * @param blackTexture - The texture an unset sampler samples.
 * @returns The upload, or `null` for a uniform whose type can't be
 * uploaded.
 */
export const createDefaultUniformUpload = (declaration, blackTexture) => {
    const { uniformType, size } = declaration;
    if (uniformType === null) {
        return null;
    }
    if (uniformType.kind === 'sampler') {
        return (gl, location, textureUnit) => createTextureUpload(blackTexture())(gl, location, textureUnit);
    }
    const length = uniformType.componentCount * size;
    if (uniformType.kind === 'float') {
        const zeros = new Float32Array(length);
        return createTypedArrayUpload(uniformType.upload, () => zeros);
    }
    if (uniformType.kind === 'uint') {
        const zeros = new Uint32Array(length);
        return createTypedArrayUpload(uniformType.upload, () => zeros);
    }
    const zeros = new Int32Array(length);
    return createTypedArrayUpload(uniformType.upload, () => zeros);
};
const createArrayUpload = (declaration, uniformType, value) => {
    if (uniformType.kind === 'float') {
        if (value instanceof Float32Array) {
            assertArrayLength(declaration, uniformType, value, value.length);
            return createTypedArrayUpload(uniformType.upload, () => value);
        }
        if (value instanceof Matrix3x3) {
            assertArrayLength(declaration, uniformType, value, value.matrix.length);
            return createTypedArrayUpload(uniformType.upload, () => value.matrix);
        }
        if (isVector2(value)) {
            assertArrayLength(declaration, uniformType, value, 2);
            return createTypedArrayUpload(uniformType.upload, () => Vec2.toFloat32Array(value));
        }
    }
    if (uniformType.kind === 'uint' && value instanceof Uint32Array) {
        assertArrayLength(declaration, uniformType, value, value.length);
        return createTypedArrayUpload(uniformType.upload, () => value);
    }
    if ((uniformType.kind === 'int' || uniformType.kind === 'bool') &&
        value instanceof Int32Array) {
        assertArrayLength(declaration, uniformType, value, value.length);
        return createTypedArrayUpload(uniformType.upload, () => value);
    }
    throw createMismatchError(declaration, uniformType, value);
};
/**
 * Builds an upload that reads its data at bind time, so a `Matrix3x3` or
 * `Vector2` mutated after `setUniform` uploads its current contents.
 */
const createTypedArrayUpload = (upload, read) => (gl, location, textureUnit) => {
    upload(gl, location, read());
    return textureUnit;
};
/** Whether a uniform holds a single component, so a bare scalar fits it. */
const isScalar = (declaration, uniformType) => uniformType.componentCount === 1 && declaration.size === 1;
const assertArrayLength = (declaration, uniformType, value, length) => {
    const { componentCount } = uniformType;
    const isWholeElements = length > 0 && length % componentCount === 0;
    if (!isWholeElements || length > componentCount * declaration.size) {
        throw createMismatchError(declaration, uniformType, value);
    }
};
const createMismatchError = (declaration, uniformType, value) => new Error(`Uniform "${declaration.name}" is declared as ${describeDeclaration(declaration, uniformType)} and expects ${describeExpectedValue(declaration, uniformType)}, but received ${describeValue(value)}.`);
const describeDeclaration = (declaration, uniformType) => declaration.size > 1
    ? `${uniformType.glslName}[${declaration.size}]`
    : uniformType.glslName;
const describeExpectedValue = (declaration, uniformType) => {
    if (uniformType.kind === 'sampler') {
        return 'a Texture';
    }
    const { kind, componentCount } = uniformType;
    const { size } = declaration;
    const alternatives = [];
    if (componentCount === 1 && size === 1) {
        if (numberUploads.has(kind)) {
            alternatives.push('a number');
        }
        if (booleanKinds.has(kind)) {
            alternatives.push('a boolean');
        }
    }
    if (kind === 'float' && componentCount === 2) {
        alternatives.push('a Vector2');
    }
    if (kind === 'float' && componentCount === 9) {
        alternatives.push('a Matrix3x3');
    }
    alternatives.push(`${typedArrayNames[kind]} ${describeExpectedLength(componentCount, size)}`);
    return alternatives.join(' or ');
};
const describeExpectedLength = (componentCount, size) => {
    if (size === 1) {
        return `of length ${componentCount}`;
    }
    if (componentCount === 1) {
        return `of length 1 to ${size}`;
    }
    return `whose length is a multiple of ${componentCount}, up to ${componentCount * size}`;
};
const describeValue = (value) => {
    if (typeof value === 'number') {
        return 'a number';
    }
    if (typeof value === 'boolean') {
        return 'a boolean';
    }
    if (value instanceof Float32Array) {
        return `a Float32Array of length ${value.length}`;
    }
    if (value instanceof Int32Array) {
        return `an Int32Array of length ${value.length}`;
    }
    if (value instanceof Uint32Array) {
        return `a Uint32Array of length ${value.length}`;
    }
    if (value instanceof Matrix3x3) {
        return 'a Matrix3x3';
    }
    if (isVector2(value)) {
        return 'a Vector2';
    }
    return value instanceof Texture ? 'a Texture' : 'an unsupported value';
};
