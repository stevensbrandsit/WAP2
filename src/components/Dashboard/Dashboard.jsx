import Topbar from "../Topbar/Topbar.jsx";
import './Dashboard.css';

function Dashboard() {

    const email = localStorage.getItem('email');
    // We intentionally do not render the raw token in the UI for security reasons.
    // Only show the email and a helpful weather map below.

    return (
        <>
            <Topbar />
            <main className="dashboard-root">
                <section className="dashboard-hero">
                    <h1>Welcome</h1>
                    <p className="dashboard-meta">Signed in as: {email || 'Unknown'}</p>
                </section>

                <section style={{marginTop: 20}}>
                    <h3>Weather map</h3>
                    <p className="dashboard-meta">Live weather overlay (wind) — interactive. If it doesn't load, open in a new tab.</p>

                    <div className="weather-map" aria-label="Interactive weather map">
                        <iframe
                            title="Weather map"
                            src="https://embed.windy.com/embed2.html?lat=52.3702&lon=4.8952&detailLat=52.3702&detailLon=4.8952&width=650&height=450&zoom=6&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=km%2Fh"
                            frameBorder="0"
                            style={{width: '100%', height: '100%'}}
                        />
                    </div>

                    <p style={{marginTop: 8}}><a href="https://www.windy.com/?52.370,4.895,6" target="_blank" rel="noreferrer">Open weather map in a new tab</a></p>
                    <p><a href="/usercontrol">User Control</a></p>
                </section>
            </main>
        </>
    )
}
export default Dashboard;