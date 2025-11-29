import { PlaceType, Vehicle } from '../entities/challenge.entity';

export type Filters = {
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  vehicles?: Array<Vehicle>;
  placeTypes?: Array<PlaceType>;
};
