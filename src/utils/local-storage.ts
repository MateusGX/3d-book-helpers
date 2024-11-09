import { HelperTypes } from "../enums/helper-types";

export const getValue = (key: string, defaultValue: any) => {
  const value = localStorage.getItem(key);
  if (value === null) return defaultValue;
  try {
    return { ...defaultValue, ...JSON.parse(value) };
  } catch (e) {
    return value;
  }
};

export const getState = (key: string, defaultValue: HelperTypes) => {
  const value = localStorage.getItem(key);
  if (value === null) return defaultValue;
  try {
    const parsed = JSON.parse(value);
    if (parsed in HelperTypes) return parsed;
    return defaultValue;
  } catch (e) {
    return value;
  }
};

export const setValue = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const setState = (key: string, value: HelperTypes) => {
  localStorage.setItem(key, JSON.stringify(value));
};
