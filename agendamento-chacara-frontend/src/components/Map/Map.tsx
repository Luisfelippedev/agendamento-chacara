"use client";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import Link from "next/link";

export const Map = () => {
  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={[-7.124951, -38.524511]}
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
      <Marker position={[-7.124951, -38.524511]}>
        <Popup>
          <Link
            target="_blank"
            href={
              "https://www.google.com/maps/place/7%C2%B007'29.8%22S+38%C2%B031'28.2%22W/@-7.1249497,-38.5251547,19z/data=!3m1!4b1!4m4!3m3!8m2!3d-7.124951!4d-38.524511?entry=ttu"
            }
          >
            Chácara do Dandão
          </Link>
        </Popup>
      </Marker>
    </MapContainer>
  );
};
