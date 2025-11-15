import { UmbraSwatch } from "./swatch";
import type { Parsers } from "./types";
import { parsers } from "./parse";

export type Plugin = (ColordClass: typeof UmbraSwatch, parsers: Parsers) => void;

const activePlugins: Plugin[] = [];

export const extend = (plugins: Plugin[]): void => {
  plugins.forEach((plugin) => {
    if (activePlugins.indexOf(plugin) < 0) {
      plugin(UmbraSwatch, parsers);
      activePlugins.push(plugin);
    }
  });
};
