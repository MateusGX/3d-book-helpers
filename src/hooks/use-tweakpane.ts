import { useLayoutEffect, useRef } from "react";
import { Pane } from "tweakpane";

export const useTweakpane = (title?: string) => {
  const _pane = useRef<Pane | null>(null);

  useLayoutEffect(() => {
    _pane.current = new Pane({
      title,
    });

    return () => {
      _pane.current?.dispose();
    };
  }, []);

  return _pane;
};
