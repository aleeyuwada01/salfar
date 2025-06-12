import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { Programs } from './pages/Programs';
import { DataCenter } from './pages/DataCenter';
import { AnnualReports } from './pages/AnnualReports';
import { GetInvolved } from './pages/GetInvolved';
import { ContactUs } from './pages/ContactUs';
import { DPCreator } from './pages/DPCreator';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/data-center" element={<DataCenter />} />
          <Route path="/annual-reports" element={<AnnualReports />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/dp-creator" element={<DPCreator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;