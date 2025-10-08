declare module 'apca-w3' {
  /**
   * Calculate APCA contrast between two colors
   * @param textY - Y luminance of text color (0.0 to 1.0)
   * @param bgY - Y luminance of background color (0.0 to 1.0)
   * @returns contrast value
   */
  export function APCAcontrast(textY: number, bgY: number): number

  /**
   * Convert sRGB color values to Y luminance
   * @param rgb - Array of RGB values [r, g, b] (0-255)
   * @returns Y luminance value (0.0 to 1.0)
   */
  export function sRGBtoY(rgb: [number, number, number]): number
}
