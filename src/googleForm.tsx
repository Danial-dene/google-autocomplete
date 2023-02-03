import { Form } from "antd";
import React, { useState } from "react";
import GoogleGetPlace from "./GooglePlace";
import { Map, Marker, GoogleApiWrapper, GoogleAPI } from "google-maps-react";

const GoogleForm = () => {
  const [place, setPlace] = useState<any>();
  console.log("place", place?.details?.geometry?.location.lng());

  return (
    <>
      <Form
        layout="vertical"
        style={{ width: "50%", margin: "auto", marginTop: 10 }}
      >
        <Form.Item label="Search place">
          <GoogleGetPlace
            onChange={(val) => {
              setPlace(val);
            }}
            placeholder="Type to search a place"
            // style={{ width: "50%" }}
          />
        </Form.Item>
      </Form>
      {place && place.details.geometry && (
        <>
          <Map
            google={google as GoogleAPI}
            onReady={(mapProps, map) => {
              console.log("map", map);
            }}
            zoom={15}
            initialCenter={{
              lat: place?.details?.geometry?.location.lat(),
              lng: place?.details?.geometry?.location.lng(),
            }}
          />
          <Marker
            position={{
              lat: place?.details?.geometry?.location.lat(),
              lng: place?.details?.geometry?.location.lng(),
            }}
          />
        </>
      )}
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBBJ0Bx7xrQfHR77H27Se7yGM8ReNdb-FY",
})(GoogleForm);
