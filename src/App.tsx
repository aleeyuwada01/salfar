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
import { Team } from './pages/Team';

import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AcademyHome } from './pages/Academy/AcademyHome';
import { AcademyLogin } from './pages/Academy/AcademyLogin';
import { AcademyPortal } from './pages/Academy/PortalDashboard';
import { AcademyApplication } from './pages/Academy/ApplicationForm';
import { AdminDashboard } from './pages/Academy/AdminDashboard';
import { Enrollment } from './pages/Academy/Enrollment';
import { Gallery } from './pages/Gallery';
import { Articles } from './pages/Media/Articles';
import { Publications } from './pages/Media/Publications';
import { ContentManager } from './pages/Admin/ContentManager';
import { GalleryManager } from './pages/Admin/GalleryManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/annual-reports" element={<AnnualReports />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/dp-creator" element={<DPCreator />} />
            <Route path="/team" element={<Team />} />

            {/* Media & Gallery Routes */}
            <Route path="/media/articles" element={<Articles />} />
            <Route path="/media/newsletters" element={<Publications category="newsletter" />} />
            <Route path="/media/press-releases" element={<Publications category="press_release" />} />
            <Route path="/gallery" element={<Gallery />} />

            {/* Protected Admin Routes */}
            <Route
              path="/data-center"
              element={
                <ProtectedRoute>
                  <DataCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute>
                  <ContentManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <ProtectedRoute>
                  <GalleryManager />
                </ProtectedRoute>
              }
            />

            {/* Academy Routes */}
            <Route path="/academy" element={<AcademyHome />} />
            <Route path="/academy/apply" element={<AcademyApplication />} />
            <Route path="/academy/login" element={<AcademyLogin />} />
            <Route path="/academy/enroll" element={<Enrollment />} />
            <Route
              path="/academy/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/academy/portal"
              element={
                <ProtectedRoute>
                  <AcademyPortal />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;