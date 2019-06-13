import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ol>
          <li>object detection</li>
        </ol>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;
