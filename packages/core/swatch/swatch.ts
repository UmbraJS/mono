import { Input, AnyColor, RgbaColor, HslaColor, HsvaColor } from "./types";
import { round } from "./helpers";
import { ALPHA_PRECISION } from "./constants";
import { parse } from "./parse";
import { rgbaToHex } from "./colorModels/hex";
import { roundRgba } from "./colorModels/rgb";
import { rgbaToRgbaString } from "./colorModels/rgbString";
import { rgbaToHsla, roundHsla } from "./colorModels/hsl";
import { rgbaToHslaString } from "./colorModels/hslString";
import { rgbaToHsva, roundHsva } from "./colorModels/hsv";
import { changeAlpha } from "./manipulate/changeAlpha";
import { saturate } from "./manipulate/saturate";
import { getBrightness } from "./get/getBrightness";
import { lighten } from "./manipulate/lighten";
import { invert } from "./manipulate/invert";

export class UmbraSwatch {
  private readonly parsed: RgbaColor | null;
  readonly rgba: RgbaColor;

  constructor(input: AnyColor) {
    // Internal color format is RGBA object.
    // We do not round the internal RGBA numbers for better conversion accuracy.
    this.parsed = parse(input as Input)[0];
    this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }

  /**
   * Returns a boolean indicating whether or not an input has been parsed successfully.
   * Note: If parsing is unsuccessful, UmbraSwatch defaults to black (does not throws an error).
   */
  public isValid(): boolean {
    return this.parsed !== null;
  }

  /**
   * Returns the brightness of a color (from 0 to 1).
   * The calculation logic is modified from WCAG.
   * https://www.w3.org/TR/AERT/#color-contrast
   */
  public brightness(): number {
    return round(getBrightness(this.rgba), 2);
  }

  /**
   * Same as calling `brightness() < 0.5`.
   */
  public isDark(): boolean {
    return getBrightness(this.rgba) < 0.5;
  }

  /**
   * Same as calling `brightness() >= 0.5`.
   * */
  public isLight(): boolean {
    return getBrightness(this.rgba) >= 0.5;
  }

  /**
   * Returns the hexadecimal representation of a color.
   * When the alpha channel value of the color is less than 1,
   * it outputs #rrggbbaa format instead of #rrggbb.
   */
  public toHex(): string {
    return rgbaToHex(this.rgba);
  }

  /**
   * Converts a color to RGB color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  public toRgb(): RgbaColor {
    return roundRgba(this.rgba);
  }

  /**
   * Converts a color to RGB color space and returns a string representation.
   * Outputs an alpha value only if it is less than 1.
   */
  public toRgbString(): string {
    return rgbaToRgbaString(this.rgba);
  }

  /**
   * Converts a color to HSL color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  public toHsl(): HslaColor {
    return roundHsla(rgbaToHsla(this.rgba));
  }

  /**
   * Converts a color to HSL color space and returns a string representation.
   * Always includes an alpha value from 0 to 1.
   */
  public toHslString(): string {
    return rgbaToHslaString(this.rgba);
  }

  /**
   * Converts a color to HSV color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  public toHsv(): HsvaColor {
    return roundHsva(rgbaToHsva(this.rgba));
  }

  /**
   * Creates a new instance containing an inverted (opposite) version of the color.
   */
  public invert(): UmbraSwatch {
    return swatch(invert(this.rgba));
  }

  /**
   * Increases the HSL saturation of a color by the given amount.
   */
  public saturate(amount = 0.1): UmbraSwatch {
    return swatch(saturate(this.rgba, amount));
  }

  /**
   * Decreases the HSL saturation of a color by the given amount.
   */
  public desaturate(amount = 0.1): UmbraSwatch {
    return swatch(saturate(this.rgba, -amount));
  }

  /**
   * Makes a gray color with the same lightness as a source color.
   */
  public grayscale(): UmbraSwatch {
    return swatch(saturate(this.rgba, -1));
  }

  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  public lighten(amount = 0.1): UmbraSwatch {
    return swatch(lighten(this.rgba, amount));
  }

  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  public darken(amount = 0.1): UmbraSwatch {
    return swatch(lighten(this.rgba, -amount));
  }

  /**
   * Changes the HSL hue of a color by the given amount.
   */
  public rotate(amount = 15): UmbraSwatch {
    return this.hue(this.hue() + amount);
  }

  /**
   * Allows to get or change an alpha channel value.
   */
  public alpha(): number;
  public alpha(value: number): UmbraSwatch;
  public alpha(value?: number): UmbraSwatch | number {
    if (typeof value === "number") return swatch(changeAlpha(this.rgba, value));
    return round(this.rgba.a, ALPHA_PRECISION);
  }

  /**
   * Allows to get or change a hue value.
   */
  public hue(): number;
  public hue(value: number): UmbraSwatch;
  public hue(value?: number): UmbraSwatch | number {
    const hsla = rgbaToHsla(this.rgba);
    if (typeof value === "number") return swatch({ h: value, s: hsla.s, l: hsla.l, a: hsla.a });
    return round(hsla.h);
  }

  /**
   * Determines whether two values are the same color.
   */
  public isEqual(color: AnyColor | UmbraSwatch): boolean {
    return this.toHex() === swatch(color).toHex();
  }
}

/**
 * Parses the given input color and creates a new `UmbraSwatch` instance.
 * See accepted input formats: https://github.com/omgovich/swatch#color-parsing
 */
export const swatch = (input: AnyColor | UmbraSwatch): UmbraSwatch => {
  if (input instanceof UmbraSwatch) return input;
  return new UmbraSwatch(input);
};
