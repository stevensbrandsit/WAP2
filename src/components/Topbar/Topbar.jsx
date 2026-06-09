import {useLocation, useNavigate} from "react-router-dom";
import osakaLogo from '../../assets/osaka_w_trans.png';

function Topbar() {

    const navigate = useNavigate();
    const location = useLocation();
    const email = localStorage.getItem('email');
    const contract = localStorage.getItem('contract');

    function decideToShowBackButton() {
        if (location.pathname === "/dashboard") {
            return (
                <button
                    className="h-11 rounded-xl border border-white/12 bg-white/10 px-4 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/16 hover:shadow-lg"
                    onClick={(() => navigate('/admin'))}
                >
                    Administration
                </button>
            );
        } else if (location.pathname === "/admin") {
            return (
                <button
                    className="h-11 rounded-xl border border-white/12 bg-white/10 px-4 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/16 hover:shadow-lg"
                    onClick={(() => navigate('/dashboard'))}
                >
                    Dashboard
                </button>
            );
        } else {
            return (
                <button
                    className="h-11 rounded-xl border border-white/12 bg-white/10 px-4 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/16 hover:shadow-lg"
                    onClick={(() => navigate('/dashboard'))}
                >
                    Back
                </button>
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
            localStorage.removeItem('contract');
            localStorage.removeItem('email');
            navigate('/');
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)] backdrop-blur-xl" role="banner">
            <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-5 h-[84px] flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/95 shadow-md">
                        <img className="h-11 w-11 object-contain" src={osakaLogo} alt="Osaka University" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-blue-200/90">
                            Osaka University
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="truncate text-base font-semibold sm:text-lg">IWA Research Dashboard</div>
                            {contract && (
                                <span className="inline-flex items-center rounded-full border border-white/12 bg-white/10 px-2.5 py-1 text-[0.72rem] font-semibold text-slate-100">
                                    {contract}
                                </span>
                            )}
                        </div>
                        {email && (
                            <p className="hidden truncate text-sm text-slate-300 sm:block">
                                Signed in as {email}
                            </p>
                        )}
                    </div>
                </div>

                <nav className="flex shrink-0 items-center gap-2" aria-label="Topbar actions">
                    {decideToShowBackButton()}
                    <button
                        className="h-11 rounded-xl border border-white/12 bg-white/10 px-4 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/16 hover:shadow-lg"
                        onClick={logout}
                    >
                        Log out
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default Topbar;
