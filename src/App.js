import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ol>
          <li>DONE pull state from database</li>
          <li>DONE see current recorder state</li>
          <li>DONE view all videos on a certain day (and their predictions)</li>
          <li>
            LATER allow admin to mark the ones to keep and delete the rest
          </li>
          <li>DONE allow download in bulk</li>
          <li>DONE larger video (maybe 1080p square)</li>
        </ol>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;
