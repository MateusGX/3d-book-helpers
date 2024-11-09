import { MutableRefObject } from "react";
import { TabPageApi } from "tweakpane";

export type HelperProps = {
  tab: MutableRefObject<TabPageApi | undefined>;
};

export type HelperRefDefault = {
  exportSTL: (callback: (data: any) => void) => void;
  resetSettings: () => void;
  importSettings: (data: any) => void;
  exportSettings: (callback: (data: any) => void) => void;
};
