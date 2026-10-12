/**
 * Slices an image into a row-major grid of equally sized animation frames.
 * @param image - The source image (or its dimensions) to slice.
 * @param rows - The number of rows in the sprite sheet.
 * @param columns - The number of columns in the sprite sheet.
 * @returns A `SpriteSheet` containing the generated frames.
 */
export function createSpriteSheet(image, rows, columns) {
    const spriteWidth = image.width / columns;
    const spriteHeight = image.height / rows;
    const spriteSheet = {
        frames: [],
    };
    for (let row = 0; row < rows; row++) {
        spriteSheet.frames[row] = [];
        const offsetY = row * spriteHeight;
        for (let column = 0; column < columns; column++) {
            const offsetX = column * spriteWidth;
            const frame = {
                offset: { x: offsetX / image.width, y: offsetY / image.height },
                dimensions: {
                    x: spriteWidth / image.width,
                    y: spriteHeight / image.height,
                },
            };
            spriteSheet.frames[row].push(frame);
        }
    }
    return spriteSheet;
}
