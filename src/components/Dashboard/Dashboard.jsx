import Topbar from "../Topbar/Topbar.jsx";
import ResearchMap from "../ResearchMap/ResearchMap.jsx";
import AdminPage from "../AdminPage/AdminPage.jsx";
import './Dashboard.css';

function Dashboard() {

    return (
        <>
            <Topbar />
            <main className="min-h-screen px-6 py-8 bg-gradient-to-b from-blue-100 to-blue-50">
                <div className="max-w-[1100px] mx-auto">
                    <ResearchMap/>
                    <AdminPage/>
                </div>
            </main>
        </>
    )
}

export default Dashboard;
