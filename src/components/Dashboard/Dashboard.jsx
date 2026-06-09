import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Topbar from "../Topbar/Topbar.jsx";
import ResearchMap from "../ResearchMap/ResearchMap.jsx";
import './Dashboard.css';

function Dashboard() {

    const token = localStorage.getItem('token');
    const contract = localStorage.getItem('contract');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!token || !contract) {
            navigate('/');
            return;
        }
    }, [token, contract, navigate]);

    return (
        <>
            <Topbar />
            <main className="dashboard-page">
                <div className="dashboard-container">
                    <ResearchMap />
                </div>
            </main>
        </>
    )
}

export default Dashboard;
