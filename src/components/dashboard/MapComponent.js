import React, { useEffect, useState } from 'react';

const MapComponent = ({ meters }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (window.google && !map) {
      const googleMap = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 8,
      });
      setMap(googleMap);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      meters.forEach(meter => {
        const marker = new window.google.maps.Marker({
          position: { lat: meter.LATITUDE, lng: meter.LONGITUDE },
          map: map,
          title: meter.REF_NO,
        });

        marker.addListener('click', () => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `Meter Ref: ${meter.REF_NO}, Type: ${meter.METER_TYPE}, Application Number: ${meter.APPLICATION_NO}`,
          });
          infoWindow.open(map, marker);
        });
      });
    }
  }, [map, meters]);

  return <div id="map" style={{ width: '100%', height: '500px' }}></div>;
};

export default MapComponent;
