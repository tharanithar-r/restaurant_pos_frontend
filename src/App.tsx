import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import TokenVerify from "./hooks/auth/tokenVerify";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Login from "./pages/Login";
import LoadingIndicator from "./components/ui/LoadingIndicator";
import Home from "./pages/Home";
import AppLayout from "./layout/AppLayout";
import Menu from "./pages/Menu";
import Unauthorized from "./components/ui/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import { Toaster } from "react-hot-toast";
import { useStateNotifications } from "./hooks/useStateNotifications";
import Kitchen from "./pages/Kitchen";

function App() {
  const { isLoading } = TokenVerify();
  const { id: authId, role } = useSelector((state: RootState) => state.auth);
  const [authLoading, setAuthLoading] = useState(true);

  useStateNotifications();

  useEffect(() => {
    setAuthLoading(isLoading);
  }, [isLoading]);

  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="relative">
      <Toaster position="bottom-center" />
      <Router>
        <LoadingIndicator />
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={
                  authId
                    ? role === "kitchen"
                      ? "/kitchen"
                      : "/home"
                    : "/login"
                }
                replace
              />
            }
          />
          <Route
            path="/login"
            element={
              !authId ? (
                <Login />
              ) : (
                <Navigate
                  to={role === "kitchen" ? "/kitchen" : "/home"}
                  replace
                />
              )
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute requiredRole="waiter">
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/menu"
              element={
                <ProtectedRoute requiredRole="waiter">
                  <Menu />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute requiredRole="waiter">
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order"
              element={
                <ProtectedRoute requiredRole="waiter">
                  <Order />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute requiredRole="kitchen">
                <Kitchen />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={authId ? "/home" : "/login"} replace />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
