import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";

function App() {
  const [isFreelancer, setIsFreelancer] = useState(true); // Set to true to show freelancer dashboard

  return isFreelancer ? <FreelancerDashboard /> : <Dashboard />;
}

export default App;
