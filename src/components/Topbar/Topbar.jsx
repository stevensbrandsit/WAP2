import './Topbar.css';
import {useLocation, useNavigate} from "react-router-dom";

function Topbar() {

    const navigate = useNavigate();
    const location = useLocation();

    function decideToShowBackButton() {
        if (location.pathname === "/dashboard") {
            return null
        } else {
            return (
                <>
                    <button className="button" onClick={(() => navigate('/dashboard'))}>Back to dashboard</button>
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
        <>
            <div className="topbar">
                <div className="buttons-wrap">
                    {decideToShowBackButton()}
                    <button className="button" onClick={logout}>Log out</button>
                </div>
            </div>
        </>
    );
}

export default Topbar;