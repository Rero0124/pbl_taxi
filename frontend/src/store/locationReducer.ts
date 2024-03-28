import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GeoLocationPosition {
  readonly accuracy: number;
  readonly altitude: number | null;
  readonly altitudeAccuracy: number | null;
  readonly heading: number | null;
  readonly latitude: number;
  readonly longitude: number;
  readonly speed: number | null;
}

export interface GeoLocation {
  readonly location: GeoLocationPosition;
  readonly isEnable: boolean;
}

const initLocation: GeoLocation = {
  location: {
    accuracy: 100,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: 37.566619172927574,
    longitude: 126.97831737391309,
    speed: null
  },
  isEnable: true
}

const locationSlice = createSlice({
  name: 'geoLocation',
  initialState: initLocation,
  reducers: {
    locationSet(state, action: PayloadAction<GeoLocationPosition | undefined>) {
      const location = action.payload ? action.payload : initLocation.location;
      return { location: location, isEnable: action.payload !== undefined };
    },
    locationUnSet(state) {
      return { location: initLocation.location, isEnable: true };
    },
    locationDeny(state) {
      return { location: initLocation.location, isEnable: false };
    }
  }
})

export const { locationSet, locationUnSet, locationDeny } = locationSlice.actions;
export default locationSlice.reducer;