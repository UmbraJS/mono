import { UmbraSwatch } from "./swatch";
import { parsers } from "./parse";
import { Parsers } from "./types";

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
