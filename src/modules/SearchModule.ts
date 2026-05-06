export class SearchModule {
  private static autocompleteElement: any = null;

  static async init(map: google.maps.Map, inputId: string) {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input) return;

    // The modern way is to use PlaceAutocompleteElement from the places library
    // Import the places library to get access to the new classes
    const { PlaceAutocompleteElement } = await google.maps.importLibrary("places") as any;
    
    // We create the element and wrap the existing input or use it.
    // However, the cleanest way to fix the error in a legacy-free project 
    // is to use the new Autocomplete element which is built on the New Places API.
    
    this.autocompleteElement = new PlaceAutocompleteElement({
      inputElement: input
    });

    // Listen for the selection using the new event pattern
    this.autocompleteElement.addEventListener('gmp-placeselect', async (event: any) => {
      const place = event.place;

      if (!place) return;
      
      // Fetch geometry if not available
      if (!place.location) {
        await place.fetchFields({ fields: ['location', 'viewport'] });
      }

      if (place.viewport) {
        map.fitBounds(place.viewport);
      } else if (place.location) {
        map.setCenter(place.location);
        map.setZoom(13);
      }
    });

    // Add it to the map's bounds biasing
    map.addListener('bounds_changed', () => {
      this.autocompleteElement.locationBias = map.getBounds();
    });
  }
}
