declare interface PlaceData extends google.maps.places.PlaceResult {
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  }
  