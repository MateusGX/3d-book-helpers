import { MutableRefObject } from "react";
import { TabPageApi } from "tweakpane";

export type HelperProps = {
  tab: MutableRefObject<TabPageApi | undefined>;
  fileLoaded: any | null;
};

export type HelperRefDefault = {
  exportSTL: (callback: (data: any) => void) => void;
  resetSettings: () => void;
  exportSettings: (callback: (data: any) => void) => void;
};
