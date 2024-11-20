import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './components/LandingPage/index.tsx';
import Dashboard from './components/Dashboard';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <Provider store={store}>
      <div className="h-screen overflow-y-auto">
        {!showDashboard ? (
          <LandingPage onGetStarted={() => setShowDashboard(true)} />
        ) : (
          <Dashboard />
        )}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Provider>
  );
}

export default App;