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
  readonly schduler: NodeJS.Timer | null;
  readonly location: GeoLocationPosition;
  readonly isEnable: boolean;
}

const initLocation: GeoLocation = {
  schduler: null,
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
      return { schduler: state.schduler, location: location, isEnable: action.payload !== undefined };
    },
    schdulerSet(state, action: PayloadAction<NodeJS.Timer>) {
      return { schduler: action.payload, location: state.location, isEnable: state.isEnable };
    },
    locationUnSet(state) {
      return { schduler: state.schduler, location: initLocation.location, isEnable: true };
    },
    schdulerUnSet(state) {
      if(state.schduler !== null) clearInterval(state.schduler);
      return { schduler: initLocation.schduler, location: state.location, isEnable: state.isEnable };
    },
    locationDeny(state) {
      if(state.schduler !== null) clearInterval(state.schduler);
      return { schduler: state.schduler, location: initLocation.location, isEnable: false };
    }
  }
})

export const { locationSet, schdulerSet, locationUnSet, schdulerUnSet, locationDeny } = locationSlice.actions;
export default locationSlice.reducer;