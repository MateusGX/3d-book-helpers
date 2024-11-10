import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
import { Model } from "../components/model";
import { makeFace, makeTriangle } from "../utils/3d-utils";
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
    baseHeight: 3,
    wallWidth: 3,
  },
};

const LOCALSTORAGE_KEYS = {
  book: "book",
  bookPage: "bookPage",
  general: "general",
};

export const BookShoe = forwardRef<HelperRefDefault, HelperProps>(
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

      current
        .addBinding({ value: generalData.baseHeight }, "value", {
          label: "Base Height",
        })
        .on("change", (value) => {
          setGeneralData((prev: any) => ({ ...prev, baseHeight: value.value }));
        });

      current
        .addBinding({ value: generalData.wallWidth }, "value", {
          label: "Wall Width",
        })
        .on("change", (value) => {
          setGeneralData((prev: any) => ({ ...prev, wallWidth: value.value }));
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

      const shoeHeight = generalData.baseHeight + bookPageData.margin.y;
      const wallsMargin = generalData.wallWidth;

      setVertices(
        new Float32Array([
          // base
          ...makeFace(
            [-wallsMargin, 0, -generalData.wallWidth - bookPageData.margin.x],
            [
              bookData.width + wallsMargin,
              0,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [-wallsMargin, 0, bookData.depth],
            [bookData.width + wallsMargin, 0, bookData.depth]
          ),

          ...makeFace(
            [0, generalData.baseHeight, pageMarginZ],
            [marginX, generalData.baseHeight, pageMarginZ],
            [
              0,
              generalData.baseHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [
              marginX,
              generalData.baseHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ]
          ),

          ...makeFace(
            [pageMarginX, generalData.baseHeight, pageMarginZ],
            [bookData.width, generalData.baseHeight, pageMarginZ],
            [
              pageMarginX,
              generalData.baseHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [
              bookData.width,
              generalData.baseHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ]
          ),

          ...makeFace(
            [-wallsMargin, generalData.baseHeight, bookData.depth],
            [
              bookData.width + wallsMargin,
              generalData.baseHeight,
              bookData.depth,
            ],
            [-wallsMargin, generalData.baseHeight, pageMarginZ],
            [bookData.width + wallsMargin, generalData.baseHeight, pageMarginZ]
          ),

          // back
          ...makeFace(
            [
              -wallsMargin,
              shoeHeight + generalData.wallHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [
              bookData.width + wallsMargin,
              shoeHeight + generalData.wallHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [-wallsMargin, 0, -generalData.wallWidth - bookPageData.margin.x],
            [
              bookData.width + wallsMargin,
              0,
              -generalData.wallWidth - bookPageData.margin.x,
            ]
          ),

          // back left
          ...makeFace(
            [0, generalData.baseHeight, -bookPageData.margin.x],
            [marginX, generalData.baseHeight, -bookPageData.margin.x],
            [0, shoeHeight + generalData.wallHeight, -bookPageData.margin.x],
            [
              marginX,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ]
          ),

          // back right
          ...makeFace(
            [pageMarginX, generalData.baseHeight, -bookPageData.margin.x],
            [bookData.width, generalData.baseHeight, -bookPageData.margin.x],
            [
              pageMarginX,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [
              bookData.width,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ]
          ),

          ...makeFace(
            [-wallsMargin, 0, bookData.depth],
            [bookData.width + wallsMargin, 0, bookData.depth],
            [-wallsMargin, generalData.baseHeight, bookData.depth],
            [
              bookData.width + wallsMargin,
              generalData.baseHeight,
              bookData.depth,
            ]
          ),
          ...makeFace(
            [-wallsMargin, 0, -generalData.wallWidth - bookPageData.margin.x],
            [-wallsMargin, 0, bookData.depth],
            [
              -wallsMargin,
              generalData.baseHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [-wallsMargin, generalData.baseHeight, bookData.depth]
          ),
          ...makeFace(
            [
              bookData.width + wallsMargin,
              generalData.baseHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [
              bookData.width + wallsMargin,
              generalData.baseHeight,
              bookData.depth,
            ],
            [
              bookData.width + wallsMargin,
              0,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [bookData.width + wallsMargin, 0, bookData.depth]
          ),
          // shoe

          // top back
          ...makeFace(
            [
              -wallsMargin,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [
              bookData.width + wallsMargin,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [
              -wallsMargin,
              shoeHeight + generalData.wallHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [
              bookData.width + wallsMargin,
              shoeHeight + generalData.wallHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ]
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
            [pageMarginX, shoeHeight, -bookPageData.margin.x],
            [pageMarginX, shoeHeight + generalData.wallHeight, marginZ],
            [
              pageMarginX,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ]
          ),

          // face left
          ...makeFace(
            [marginX, shoeHeight + generalData.wallHeight, marginZ],
            [
              marginX,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [marginX, shoeHeight, marginZ],
            [marginX, shoeHeight, -bookPageData.margin.x]
          ),

          // face top
          ...makeFace(
            [pageMarginX, shoeHeight + generalData.wallHeight, marginZ],
            [
              pageMarginX,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [marginX, shoeHeight + generalData.wallHeight, marginZ],
            [
              marginX,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ]
          ),

          // front base
          ...makeFace(
            [marginX, generalData.baseHeight, pageMarginZ],
            [pageMarginX, generalData.baseHeight, pageMarginZ],
            [marginX, shoeHeight, pageMarginZ],
            [pageMarginX, shoeHeight, pageMarginZ]
          ),

          // left base
          ...makeFace(
            [marginX, generalData.baseHeight, -bookPageData.margin.x],
            [marginX, generalData.baseHeight, pageMarginZ],
            [marginX, shoeHeight, -bookPageData.margin.x],
            [marginX, shoeHeight, pageMarginZ]
          ),

          // right base
          ...makeFace(
            [pageMarginX, shoeHeight, -bookPageData.margin.x],
            [pageMarginX, shoeHeight, pageMarginZ],
            [pageMarginX, generalData.baseHeight, -bookPageData.margin.x],
            [pageMarginX, generalData.baseHeight, pageMarginZ]
          ),

          // walls

          // left wall
          ...makeFace(
            [-wallsMargin, generalData.baseHeight, -bookPageData.margin.x],
            [
              -wallsMargin,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [
              -wallsMargin,
              generalData.baseHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [
              -wallsMargin,
              shoeHeight + generalData.wallHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ]
          ),
          ...makeTriangle(
            [0, generalData.baseHeight, -bookPageData.margin.x],
            [0, shoeHeight + generalData.wallHeight, -bookPageData.margin.x],
            [0, generalData.baseHeight, pageMarginZ]
          ),
          ...makeTriangle(
            [
              -wallsMargin,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [-wallsMargin, generalData.baseHeight, -bookPageData.margin.x],

            [-wallsMargin, generalData.baseHeight, pageMarginZ]
          ),
          ...makeFace(
            [-wallsMargin, generalData.baseHeight, pageMarginZ],
            [0, generalData.baseHeight, pageMarginZ],
            [
              -wallsMargin,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [0, shoeHeight + generalData.wallHeight, -bookPageData.margin.x]
          ),

          // right wall
          ...makeFace(
            [
              bookData.width + wallsMargin,
              generalData.baseHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [
              bookData.width + wallsMargin,
              shoeHeight + generalData.wallHeight,
              -generalData.wallWidth - bookPageData.margin.x,
            ],
            [
              bookData.width + wallsMargin,
              generalData.baseHeight,
              -bookPageData.margin.x,
            ],
            [
              bookData.width + wallsMargin,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ]
          ),
          ...makeTriangle(
            [
              bookData.width,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [bookData.width, generalData.baseHeight, -bookPageData.margin.x],

            [bookData.width, generalData.baseHeight, pageMarginZ]
          ),
          ...makeTriangle(
            [bookData.width + wallsMargin, generalData.baseHeight, pageMarginZ],
            [
              bookData.width + wallsMargin,
              generalData.baseHeight,
              -bookPageData.margin.x,
            ],
            [
              bookData.width + wallsMargin,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ]
          ),
          ...makeFace(
            [
              bookData.width + wallsMargin,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [
              bookData.width,
              shoeHeight + generalData.wallHeight,
              -bookPageData.margin.x,
            ],
            [bookData.width + wallsMargin, generalData.baseHeight, pageMarginZ],
            [bookData.width, generalData.baseHeight, pageMarginZ]
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
