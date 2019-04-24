import { Location } from '@shared/types/location.interface';

export const canLocationBeDeleted = (location: Location): boolean => {
  return location && !location.isDeleted;
};

export const canLocationBeRestored = (location: Location): boolean => {
  return location && location.isDeleted;
};
