import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';

function App() {
  return (
    <React.Fragment>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
