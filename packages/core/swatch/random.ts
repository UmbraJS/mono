import { UmbraSwatch } from "./swatch";

export const random = (): UmbraSwatch => {
  return new UmbraSwatch({
    r: Math.random() * 255,
    g: Math.random() * 255,
    b: Math.random() * 255,
  });
};
