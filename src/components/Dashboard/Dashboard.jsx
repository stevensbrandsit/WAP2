function Dashboard() {

    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    return (
        <>
            <h1>Dashboard</h1>
            <h2>Email: {email} </h2>
            <h2>Token: {token} </h2>
            <a href="/usercontrol">User Control</a>
        </>
    )
}
export default Dashboard;