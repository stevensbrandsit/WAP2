import './Topbar.css';
import {useLocation, useNavigate} from "react-router-dom";
import osakaLogo from '../../assets/osaka.png';

function Topbar() {

    const navigate = useNavigate();
    const location = useLocation();

    function decideToShowBackButton() {
        if (location.pathname === "/dashboard") {
            return null
        } else {
            return (
                <>
                    <button className="button secondary" onClick={(() => navigate('/dashboard'))}>Back</button>
                </>
            );
        }
    }

    async function logout() {
        try {
            await fetch('/IWA/contract/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
        } catch (e) {
            console.error(e)
        } finally {
            localStorage.removeItem('token');
            navigate('/');
        }
    }

    return (
        <header className="topbar" role="banner">
            <div className="topbar-inner">
                <div className="brand">
                    <img className="brand-logo" src={osakaLogo} alt="Osaka University" />
                    <div className="brand-title">IWA - Osaka Access</div>
                </div>

                <nav className="buttons-wrap" aria-label="Topbar actions">
                    {decideToShowBackButton()}
                    <button className="button" onClick={logout}>Log out</button>
                </nav>
            </div>
        </header>
    );
}

export default Topbar;