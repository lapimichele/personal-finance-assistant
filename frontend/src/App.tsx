import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import AccountForm from './components/AccountForm';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<Layout><Outlet /></Layout>}>
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/accounts"
                                element={
                                    <ProtectedRoute>
                                        <Accounts />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/accounts/new"
                                element={
                                    <ProtectedRoute>
                                        <AccountForm />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/accounts/:id/edit"
                                element={
                                    <ProtectedRoute>
                                        <AccountForm />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
