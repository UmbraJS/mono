import { AnyColor } from "../types";
import { Plugin } from "../extend";
import { mix } from "../manipulate/mix";
import { UmbraSwatch } from "../swatch";

declare module "../swatch" {
  interface UmbraSwatch {
    /**
     * Produces a mixture of two colors through CIE LAB color space and returns a new UmbraSwatch instance.
     */
    mix(color2: AnyColor | UmbraSwatch, ratio?: number): UmbraSwatch;

    /**
     * Generates a tints palette based on original color.
     */
    tints(count?: number): UmbraSwatch[];

    /**
     * Generates a shades palette based on original color.
     */
    shades(count?: number): UmbraSwatch[];

    /**
     * Generates a tones palette based on original color.
     */
    tones(count?: number): UmbraSwatch[];
  }
}

/**
 * A plugin adding a color mixing utilities.
 */
const mixPlugin: Plugin = (ColordClass): void => {
  ColordClass.prototype.mix = function (color2, ratio = 0.5) {
    const instance2 = color2 instanceof ColordClass ? color2 : new ColordClass(color2);

    const mixture = mix(this.toRgb(), instance2.toRgb(), ratio);
    return new ColordClass(mixture);
  };

  /**
   * Generate a palette from mixing a source color with another.
   */
  function mixPalette(source: UmbraSwatch, hex: string, count = 5): UmbraSwatch[] {
    const palette = [];
    const step = 1 / (count - 1);
    for (let i = 0; i <= count - 1; i++) {
      palette.push(source.mix(hex, step * i));
    }
    return palette;
  }

  ColordClass.prototype.tints = function (count) {
    return mixPalette(this, "#fff", count);
  };

  ColordClass.prototype.shades = function (count) {
    return mixPalette(this, "#000", count);
  };

  ColordClass.prototype.tones = function (count) {
    return mixPalette(this, "#808080", count);
  };
};

export default mixPlugin;
