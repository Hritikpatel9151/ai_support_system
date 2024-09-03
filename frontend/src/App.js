import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TicketDashboard from "./components/TicketDashboard";
import EmailTemplateManager from "./components/EmailTemplateManager";
import Adminpage from "./pages/Adminpage";
import Customerpage from "./pages/Customerpage";
import Agentpage from "./pages/Agentpage";
import AuditLog from "./components/AuditLog";
import Home from "./components/Home";
import CommunicationHistory from "./components/CommunicationHistory";
import AdminCustomerForm from "./components/AdminCustomerForm";
import AdminServiceForm from "./components/AdminServiceForm";
import AdminSLAForm from "./components/AdminSLAForm";
import Unauthorized from "./components/Unauthorized";

function App() {
  
  const userRole = localStorage.getItem("userRole");
  return (
    <div>
      <Routes>
        <Route path="/" exact element={<Home />} />

        {/* Admin Routes */}
        {userRole === "admin" && (
          <>
            <Route path="/admin" element={<Adminpage />} />
            <Route path="/audit-logs" element={<AuditLog />} />
            <Route path="/email-templates" element={<EmailTemplateManager />} />
            <Route path="/customer-form" element={<AdminCustomerForm />} />
            <Route path="/service-form" element={<AdminServiceForm />} />
            <Route path="/sla-form" element={<AdminSLAForm />} />
          </>
        )}

        {/* Agent Routes */}
        {userRole === "agent" && (
          <>
            <Route path="/agent" element={<Agentpage />} />
            <Route path="/ticket-dashboard" element={<TicketDashboard />} />
          </>
        )}

        {/* Customer Routes */}
        {userRole === "customer" && (
          <>
            <Route path="/customer" element={<Customerpage />} />
            <Route
              path="/communication-history"
              element={<CommunicationHistory />}
            />
          </>
        )}

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Redirect to unauthorized page if no matching routes */}
        <Route path="*" element={<Navigate to="/unauthorized" />} />
      </Routes>
    </div>
  );
}

export default App;
