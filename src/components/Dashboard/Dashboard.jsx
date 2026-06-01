import Topbar from "../Topbar/Topbar.jsx";

function Dashboard() {

    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const decoded2 = JSON.stringify(decoded);
    return (
        <>
            <Topbar />
            <h1>Dashboard</h1>
            <h2>Email: {email} </h2>
            <h2>Token: {decoded2} </h2>
            <a href="/usercontrol">User Control</a>
        </>
    )
}
export default Dashboard;