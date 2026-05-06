export class GeolocationModule {
  private static userMarker: google.maps.Marker | null = null;

  static async findUser(map: google.maps.Map): Promise<void> {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.setCenter(userPos);
          map.setZoom(14);
          this.drawUserMarker(map, userPos);
          resolve();
        },
        (error) => {
          this.handleLocationError(error);
          reject(error);
        }
      );
    });
  }

  private static drawUserMarker(map: google.maps.Map, position: google.maps.LatLngLiteral) {
    if (this.userMarker) this.userMarker.setMap(null);

    this.userMarker = new google.maps.Marker({
      position: position,
      map: map,
      title: "Your Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 2,
        scale: 7
      }
    });
  }

  private static handleLocationError(error: GeolocationPositionError) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        break;
      default:
        console.error("An unknown error occurred.");
        break;
    }
  }
}
