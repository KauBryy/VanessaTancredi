import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import Estimation from './pages/Estimation';
import Fees from './pages/Fees';
import Legal from './pages/Legal';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PropertyForm from './pages/admin/PropertyForm';
import ProtectedRoute from './pages/admin/ProtectedRoute';

import FixedMobileContact from './components/FixedMobileContact';
import ScrollToTop from './components/ScrollToTop';

function Layout() {
    return (
        <div className="flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <FixedMobileContact />
            <div className="h-24 md:hidden"></div> {/* Spacer for fixed mobile bar */}
        </div>
    );
}

function App() {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <ScrollToTop />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="property/:id" element={<PropertyDetail />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="estimation" element={<Estimation />} />
                    <Route path="honoraires" element={<Fees />} />
                    <Route path="mentions-legales" element={<Legal />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute />}>
                    <Route index element={<Dashboard />} />
                    <Route path="new" element={<PropertyForm />} />
                    <Route path="edit/:id" element={<PropertyForm />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
