import React, { Component, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import GoogleGetPlace from "./GooglePlace";
import { Form } from "antd";
import { store } from "./redux/store";
import GoogleForm from "./googleForm";

class App extends Component {
  componentDidMount() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBBJ0Bx7xrQfHR77H27Se7yGM8ReNdb-FY&libraries=places&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);
  }

  render() {
    return (
      <div className="App">
        <GoogleForm />
      </div>
    );
  }
}

export default App;
