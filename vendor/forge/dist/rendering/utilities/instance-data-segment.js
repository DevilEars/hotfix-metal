/**
 * Combines multiple instance data segments into a single layout, laying each
 * segment out sequentially within the per-instance buffer.
 *
 * @param segments - The segments to combine, in buffer order.
 * @returns The combined instance data layout.
 * @throws An error if no segments are provided.
 */
export function combineInstanceDataSegments(...segments) {
    if (segments.length === 0) {
        throw new Error('combineInstanceDataSegments requires at least one segment.');
    }
    const segmentOffsets = [];
    let floatsPerInstance = 0;
    for (const segment of segments) {
        segmentOffsets.push(floatsPerInstance);
        floatsPerInstance += segment.floatsPerInstance;
    }
    const bindInstanceData = (components, instanceDataBufferArray, offset) => {
        segments.forEach((segment, index) => {
            segment.bindInstanceData(components, instanceDataBufferArray, offset + segmentOffsets[index]);
        });
    };
    const setupInstanceAttributes = (gl, renderable) => {
        segments.forEach((segment, index) => {
            segment.setupInstanceAttributes(gl, renderable, segmentOffsets[index]);
        });
    };
    return { floatsPerInstance, bindInstanceData, setupInstanceAttributes };
}
