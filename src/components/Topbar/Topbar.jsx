import {useLocation, useNavigate} from "react-router-dom";
import osakaLogo from '../../assets/osaka_w_trans.png';

function Topbar() {

    const navigate = useNavigate();
    const location = useLocation();

    function decideToShowBackButton() {
        if (location.pathname === "/dashboard") {
            return null
        } else {
            return (
                <>
                    <button className="h-10 px-3 text-sm font-medium bg-white/20 text-white rounded-lg cursor-pointer transition-all duration-75 hover:shadow-lg hover:-translate-y-0.5" onClick={(() => navigate('/dashboard'))}>Back</button>
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
        <header className="sticky top-0 z-50 w-full shadow-lg text-black" style={{ backgroundColor: '#2b287f' }} role="banner">
            <div className="w-full max-w-[1100px] mx-auto px-2 h-[80px] flex items-center justify-between">
                <div className="flex gap-4 items-center -translate-x-2">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
                        <img className="w-18 h-18 object-contain" src={osakaLogo} alt="Osaka University" />
                    </div>
                    <div className="hidden sm:block font-bold text-xl tracking-wide text-white">IWA - Osaka Access</div>
                </div>

                <nav className="flex gap-2.5 items-center translate-x-2" aria-label="Topbar actions">
                    {decideToShowBackButton()}
                    <button className="h-11 px-4 text-sm font-medium text-white rounded-lg cursor-pointer transition-all duration-75 hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: '#2d287f' }} onClick={logout}>Log out</button>
                </nav>
            </div>
        </header>
    );
}

export default Topbar;