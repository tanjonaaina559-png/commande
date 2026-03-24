import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import AddOrder from './pages/AddOrder';
import Clients from './pages/Clients';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<AddOrder />} />
          <Route path="clients" element={<Clients />} />
          <Route path="history" element={<Orders />} /> {/* Reusing Orders for history as it has a table */}
          <Route path="stats" element={<Dashboard />} /> {/* Reusing Dashboard for stats */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
