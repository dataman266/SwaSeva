export interface LocationFilter {
  region: string;
  regionLabel: string;
  regionLabelMr: string;
  radius: number;
  lat?: number;
  lng?: number;
}

export const DEFAULT_LOCATION_FILTER: LocationFilter = {
  region: 'all',
  regionLabel: 'All India',
  regionLabelMr: 'सर्व भारत',
  radius: 50,
};
