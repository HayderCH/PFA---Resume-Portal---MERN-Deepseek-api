
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import SignupChoice from "./pages/auth/SignupChoice";
import CompanySignup from "./pages/auth/CompanySignup";
import CandidateSignup from "./pages/auth/CandidateSignup";
import EmailVerification from "./pages/auth/EmailVerification";
import NotFound from "./pages/NotFound";

// Company routes
import CompanyDashboard from "./pages/company/CompanyDashboard";
import Marketplace from "./pages/company/Marketplace";
import CategoryDetail from "./pages/company/CategoryDetail";
import PackDetails from "./pages/company/PackDetails";
import CompanySubscriptions from "./pages/company/CompanySubscriptions";
import CredibilityTests from "./pages/company/CredibilityTests";
import CreateTest from "./pages/company/CreateTest";
import TestDetail from "./pages/company/TestDetail";

// Candidate routes
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CredibilityTest from "./pages/candidate/CredibilityTest";
import CandidateSubscription from "./pages/candidate/CandidateSubscription";

// Admin routes
import AdminDashboard from "./pages/admin/AdminDashboard";
import TestReview from "./pages/admin/TestReview";
import AdminTestDetail from "./pages/admin/TestDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupChoice />} />
            <Route path="/signup/company" element={<CompanySignup />} />
            <Route path="/signup/candidate" element={<CandidateSignup />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            
            {/* Company routes */}
            <Route 
              path="/company/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/marketplace" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <Marketplace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/marketplace/category/:categoryId" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CategoryDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/marketplace/pack/:packId" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <PackDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/subscriptions" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanySubscriptions />
                </ProtectedRoute>
              } 
            />
            {/* New Company Test Routes */}
            <Route 
              path="/company/tests" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CredibilityTests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/tests/create" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CreateTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/tests/:testId" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <TestDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* Candidate routes */}
            <Route 
              path="/candidate/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidate/profile" 
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidate/credibility-test" 
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CredibilityTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidate/subscription" 
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateSubscription />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* New Admin Test Review Routes */}
            <Route 
              path="/admin/tests" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TestReview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/tests/:testId" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTestDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
