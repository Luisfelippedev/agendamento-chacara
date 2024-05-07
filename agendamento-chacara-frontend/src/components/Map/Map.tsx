"use client"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

export const Map = () => {
  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={[-7.10181358668117, -38.54587736932238]}
      zoom={13}
      scrollWheelZoom={true}
      touchZoom={true}
      zoomControl={true}
      zoomAnimation={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[-7.10181358668117, -38.54587736932238]}>
        <Popup>Chácara do Dandão</Popup>
      </Marker>
    </MapContainer>
  );
};
