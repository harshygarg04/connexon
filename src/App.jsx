import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import User from './components/User';
import PlanManagement from './components/PlanManagement';
import UserPayments from './components/UserPayments'
import RemindersOrAlerts from './components/RemindersOrAlerts';
import Reports from './components/Reports';
import Setting from './components/Setting';
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPass from "./components/ResetPass"
import Activation from './components/Activation';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/resetNewPassword/:token" element={<ResetPass />} />
        <Route path="/activate/:token" element={<Activation />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/user" replace />} />
          <Route path="user" element={<User />} />
          <Route path="plan-management" element={<PlanManagement />} />
          <Route path="User-Payments" element={<UserPayments />} />
          <Route path="reminders-alerts" element={<RemindersOrAlerts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="setting" element={<Setting />} />
        </Route>
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
