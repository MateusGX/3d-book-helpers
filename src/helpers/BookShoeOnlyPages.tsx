import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
import { Model } from "../components/model";
import { makeFace } from "../utils/3d-utils";
import { HelperProps, HelperRefDefault } from "../models/helper";
import { getValue, setValue } from "../utils/local-storage";

const DEFAULT_VALUES = {
  book: {
    width: 55,
    depth: 157,
  },
  bookPage: {
    width: 49,
    depth: 151,
    margin: { x: 3, y: 5 },
  },
  general: {
    wallHeight: 40,
  },
};

const LOCALSTORAGE_KEYS = {
  book: "book",
  bookPage: "bookPage",
  general: "general",
};

export const BookShoeOnlyPages = forwardRef<HelperRefDefault, HelperProps>(
  ({ tab, fileLoaded }, ref) => {
    const [vertices, setVertices] = useState<Float32Array>(
      new Float32Array([])
    );

    const [bookData, setBookData] = useState(
      getValue(LOCALSTORAGE_KEYS.book, DEFAULT_VALUES.book)
    );
    const [bookPageData, setBookPageData] = useState(
      getValue(LOCALSTORAGE_KEYS.bookPage, DEFAULT_VALUES.bookPage)
    );
    const [generalData, setGeneralData] = useState(
      getValue(LOCALSTORAGE_KEYS.general, DEFAULT_VALUES.general)
    );

    useEffect(() => {
      if (!fileLoaded) return;
      let json = null;
      try {
        json = JSON.parse(fileLoaded);
      } catch (e) {
        console.error("Invalid JSON file");
      }
      if (!json) return;
      const { book, bookPage, general } = json;
      setValue(LOCALSTORAGE_KEYS.book, book);
      setValue(LOCALSTORAGE_KEYS.bookPage, bookPage);
      setValue(LOCALSTORAGE_KEYS.general, general);
      location.reload();
    }, [fileLoaded]);

    useEffect(() => {
      if (!tab.current) return;

      const { current } = tab;

      current
        .addBinding({ value: generalData.wallHeight }, "value", {
          label: "Wall Height",
        })
        .on("change", (value) => {
          setGeneralData((prev: any) => ({ ...prev, wallHeight: value.value }));
        });

      const bookFolder = current.addFolder({
        title: "Book Settings",
      });

      bookFolder
        .addBinding({ value: bookData.width }, "value", {
          label: "Width",
        })
        .on("change", (value) => {
          setBookData((prev: any) => ({ ...prev, width: value.value }));
        });

      bookFolder
        .addBinding({ value: bookData.depth }, "value", {
          label: "Depth",
        })
        .on("change", (value) => {
          setBookData((prev: any) => ({ ...prev, depth: value.value }));
        });

      const bookPageFolder = current.addFolder({
        title: "Book Page Settings",
      });

      bookPageFolder
        .addBinding({ value: bookPageData.width }, "value", {
          label: "Width",
        })
        .on("change", (value) => {
          setBookPageData((prev: any) => ({ ...prev, width: value.value }));
        });

      bookPageFolder
        .addBinding({ value: bookPageData.depth }, "value", {
          label: "Depth",
        })
        .on("change", (value) => {
          setBookPageData((prev: any) => ({ ...prev, depth: value.value }));
        });

      bookPageFolder
        .addBinding({ value: bookPageData.margin }, "value", {
          label: "Margin",
        })
        .on("change", (value) => {
          setBookPageData((prev: any) => ({ ...prev, margin: value.value }));
        });

      return () => {};
    }, [tab]);

    useLayoutEffect(() => {
      const marginX = Math.abs(bookData.width - bookPageData.width) / 2;
      const pageMarginX = bookPageData.width + marginX;

      const marginZ = Math.abs(bookData.depth - bookPageData.depth) / 2;
      const pageMarginZ = bookPageData.depth + marginZ;

      const shoeHeight = bookPageData.margin.y;

      const bookPageMarginX = bookPageData.margin.x - marginZ;

      setVertices(
        new Float32Array([
          // back
          ...makeFace(
            [marginX, shoeHeight + generalData.wallHeight, -bookPageMarginX],
            [
              pageMarginX,
              shoeHeight + generalData.wallHeight,
              -bookPageMarginX,
            ],
            [marginX, 0, -bookPageMarginX],
            [pageMarginX, 0, -bookPageMarginX]
          ),
          // shoe
          ...makeFace(
            [marginX, 0, -bookPageMarginX],
            [pageMarginX, 0, -bookPageMarginX],
            [marginX, 0, pageMarginZ],
            [pageMarginX, 0, pageMarginZ]
          ),

          // top base
          ...makeFace(
            [marginX, shoeHeight, pageMarginZ],
            [pageMarginX, shoeHeight, pageMarginZ],
            [marginX, shoeHeight, marginZ],
            [pageMarginX, shoeHeight, marginZ]
          ),

          // face front
          ...makeFace(
            [marginX, shoeHeight, marginZ],
            [pageMarginX, shoeHeight, marginZ],
            [marginX, shoeHeight + generalData.wallHeight, marginZ],
            [pageMarginX, shoeHeight + generalData.wallHeight, marginZ]
          ),

          // face right
          ...makeFace(
            [pageMarginX, shoeHeight, marginZ],
            [pageMarginX, shoeHeight, -bookPageMarginX],
            [pageMarginX, shoeHeight + generalData.wallHeight, marginZ],
            [pageMarginX, shoeHeight + generalData.wallHeight, -bookPageMarginX]
          ),

          // face left
          ...makeFace(
            [marginX, shoeHeight + generalData.wallHeight, marginZ],
            [marginX, shoeHeight + generalData.wallHeight, -bookPageMarginX],
            [marginX, shoeHeight, marginZ],
            [marginX, shoeHeight, -bookPageMarginX]
          ),

          // face top
          ...makeFace(
            [pageMarginX, shoeHeight + generalData.wallHeight, marginZ],
            [
              pageMarginX,
              shoeHeight + generalData.wallHeight,
              -bookPageMarginX,
            ],
            [marginX, shoeHeight + generalData.wallHeight, marginZ],
            [marginX, shoeHeight + generalData.wallHeight, -bookPageMarginX]
          ),

          // front base
          ...makeFace(
            [marginX, 0, pageMarginZ],
            [pageMarginX, 0, pageMarginZ],
            [marginX, shoeHeight, pageMarginZ],
            [pageMarginX, shoeHeight, pageMarginZ]
          ),

          // left base
          ...makeFace(
            [marginX, 0, -bookPageMarginX],
            [marginX, 0, pageMarginZ],
            [marginX, shoeHeight, -bookPageMarginX],
            [marginX, shoeHeight, pageMarginZ]
          ),

          // right base
          ...makeFace(
            [pageMarginX, shoeHeight, -bookPageMarginX],
            [pageMarginX, shoeHeight, pageMarginZ],
            [pageMarginX, 0, -bookPageMarginX],
            [pageMarginX, 0, pageMarginZ]
          ),
        ])
      );
    }, [bookData, bookPageData, generalData]);

    useImperativeHandle(ref, () => ({
      exportSTL(callback: (data: any) => void) {
        callback(vertices);
      },
      resetSettings() {
        setValue(LOCALSTORAGE_KEYS.book, DEFAULT_VALUES.book);
        setValue(LOCALSTORAGE_KEYS.bookPage, DEFAULT_VALUES.bookPage);
        setValue(LOCALSTORAGE_KEYS.general, DEFAULT_VALUES.general);
        location.reload();
      },
      exportSettings(callback: (data: any) => void) {
        const json = JSON.stringify({
          book: bookData,
          bookPage: bookPageData,
          general: generalData,
        });
        callback(json);
      },
    }));

    return <Model vertices={vertices} />;
  }
);
