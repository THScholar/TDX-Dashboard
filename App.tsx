import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { SalesManager } from './components/dashboard/SalesManager';
import { ChartsView } from './components/dashboard/ChartsView';
import { AiChat } from './components/dashboard/AiChat';
import { AiInsights } from './components/dashboard/AiInsights';
import { Calculator } from './components/dashboard/Calculator';
import { WhatIfAnalysis } from './components/dashboard/WhatIfAnalysis';
import { Settings } from './components/dashboard/Settings';
import { LoginPage } from './components/auth/LoginPage';
import { SlowMovingPrediction } from './components/dashboard/SlowMovingPrediction';
import { ExpenseTracker } from './components/dashboard/ExpenseTracker';
import { InventoryTurnover } from './components/dashboard/InventoryTurnover';
import { PromoEstimator } from './components/dashboard/PromoEstimator';
import { clearSession } from './services/storageService';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  // Simple auth state management
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('therrabiz_auth') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('therrabiz_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('therrabiz_auth');
    clearSession(); 
  };

  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
          } />
          
          <Route path="/dashboard/*" element={
            isAuthenticated ? (
              <DashboardLayout onLogout={handleLogout}>
                <Routes>
                  <Route index element={<DashboardHome />} />
                  <Route path="sales" element={<SalesManager />} />
                  <Route path="charts" element={<ChartsView />} />
                  <Route path="simulator" element={<WhatIfAnalysis />} />
                  <Route path="chat" element={<AiChat />} />
                  <Route path="insight" element={<AiInsights />} />
                  <Route path="calculator" element={<Calculator />} />
                  <Route path="settings" element={<Settings />} />
                  {/* New Routes */}
                  <Route path="slow-moving" element={<SlowMovingPrediction />} />
                  <Route path="expenses" element={<ExpenseTracker />} />
                  <Route path="inventory" element={<InventoryTurnover />} />
                  <Route path="promo" element={<PromoEstimator />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;