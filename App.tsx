import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminApp from "./AdminApp";
import StaffApp from "./StaffApp";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Staff routes - under /staff */}
        <Route path="/staff/*" element={<StaffApp />} />

        {/* Admin routes - default */}
        <Route path="/*" element={<AdminApp />} />
      </Routes>
    </Router>
  );
};

export default App;
