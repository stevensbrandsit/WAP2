import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Topbar from "../Topbar/Topbar.jsx";
import osakaLogo from '../../assets/osaka_w_trans.png';

function Dashboard() {

    const email = localStorage.getItem('email');
    const navigate = useNavigate();
    
    // User management state
    const [error, setError] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({})
    const [userList, setuserList] = useState([]);
    const [name, setName] = useState("");
    const [createEmail, setCreateEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userIdentifier, setUserIdentifier] = useState("");
    const [machtiging, setMachtiging] = useState("user");

    useEffect(() => {
        getUsers();
    }, []);

    function handleUsernameChange(evt) {
        setName(evt.target.value);
    }

    function handleEmailChange(evt) {
        setCreateEmail(evt.target.value);
    }

    function handlePasswordChange(evt) {
        setPassword(evt.target.value);
    }

    function handleUserIdentifierChange(evt) {
        setUserIdentifier(evt.target.value);
    }

    async function updateUser(user) {
        try {
            const response = await fetch(`/IWA/contracten/${localStorage.getItem('contract')}/user/${user.user_identifier}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ naam: user.naam, email: user.email, machtiging: user.machtiging, password: user.password })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.err)
            } else {
                setEditId(null)
                await getUsers();
            }
        } catch (err) {
            setError(err);
        }
    }

    async function createUser() {
        try {
            const response = await fetch(`/IWA/contracten/${localStorage.getItem('contract')}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ naam: name, email: createEmail, password: password, user_identifier: userIdentifier, machtiging: machtiging })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.err);
            } else {
                setName("");
                setCreateEmail("");
                setPassword("");
                setUserIdentifier("");
                setMachtiging("user");
                await getUsers();
            }
        } catch (e) {
            setError(e);
        }
    }

    async function deleteUser(identifier) {
        try {
            const response = await fetch(`/IWA/contracten/${localStorage.getItem('contract')}/user/${identifier}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
            });
            if (response.ok) {
                await getUsers();
            }
        } catch (err) {
            setError(err);
        }
    }

    async function getUsers() {
        try {
            const response = await fetch(`/IWA/contracten/${localStorage.getItem('contract')}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error)
            } else {
                setuserList(data.users);
            }
        } catch (err) {
            navigate('/');
        }
    }

    return (
        <>
            <Topbar />
            <main className="min-h-screen px-6 py-8 bg-gradient-to-b from-blue-100 to-blue-50">
                <div className="max-w-[1100px] mx-auto">
                {/* Welcome Section */}
                <section className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary text-black p-8 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 text-black">Welcome</h1>
                            <p className="text-xl text-black">Signed in as: {email || 'Unknown'}</p>
                        </div>
                        <img className="w-32 h-32 object-contain opacity-90" src={osakaLogo} alt="Osaka University" />
                    </div>
                </section>

                {/* Weather Map Section */}
                <section className="mt-10">
                    <div className="mb-4">
                        <h2 className="text-3xl font-bold text-brand-primary mb-2">Weather Forecast</h2>
                        <p className="text-black text-base">Live weather overlay (wind) — interactive. If it doesn't load, <a href="https://www.windy.com/?52.370,4.895,6" target="_blank" rel="noreferrer" className="text-orange-500 hover:text-orange-600 font-semibold underline">open in a new tab</a>.</p>
                    </div>

                    <div className="w-full h-96 md:h-[420px] rounded-xl overflow-hidden bg-gray-200 shadow-lg mb-4 border-4 border-brand-primary">
                        <iframe
                            title="Weather map"
                            src="https://embed.windy.com/embed2.html?lat=52.3702&lon=4.8952&detailLat=52.3702&detailLon=4.8952&width=650&height=450&zoom=6&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=km%2Fh"
                            frameBorder="0"
                            className="w-full h-full"
                        />
                    </div>
                </section>

                {/* Admin Panel - User Management */}
                <section className="mt-12 pt-10 border-t-4 border-brand-primary">
                    <h2 className="text-3xl font-bold text-brand-primary mb-2">Admin Panel</h2>
                    <p className="text-black mb-6">Manage users and their access levels</p>
                    
                    {error && <p className="text-white font-semibold mb-4 bg-red-600 p-4 rounded-lg">{error}</p>}

                    {/* Create User Form */}
                    <details className="mb-8 cursor-pointer">
                        <summary className="font-semibold text-xl text-black mb-4 p-4 bg-brand-primary rounded-lg hover:bg-brand-accent transition-colors">+ Create new user</summary>
                        <form onSubmit={(e) => { e.preventDefault(); createUser(); }} className="mt-4 space-y-4 bg-blue-50 p-6 rounded-lg border-4 border-brand-primary">
                            <input 
                              className="w-full px-4 py-3 text-base rounded-lg border-2 border-brand-primary focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium" 
                              type="text" id="name" name="name" value={name} onChange={handleUsernameChange} placeholder="Full Name" required
                            />
                            <input 
                              className="w-full px-4 py-3 text-base rounded-lg border-2 border-brand-primary focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium" 
                              type="email" id="email" name="email" value={createEmail} onChange={handleEmailChange} placeholder="Email" required
                            />
                            <input 
                              className="w-full px-4 py-3 text-base rounded-lg border-2 border-brand-primary focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium" 
                              type="password" id="password" name="password" value={password} onChange={handlePasswordChange} placeholder="Password" required
                            />
                            <input 
                              className="w-full px-4 py-3 text-base rounded-lg border-2 border-brand-primary focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium" 
                              type="text" id="user_identifier" name="user_identifier" value={userIdentifier} onChange={handleUserIdentifierChange} placeholder="User Identifier (e.g., OSAKA-003)" required
                            />
                            <button className="w-full px-4 py-3 bg-brand-primary hover:bg-brand-accent text-white font-bold text-lg rounded-lg transition-all shadow-md" type="submit">Create User</button>
                        </form>
                    </details>

                    {/* Users Table */}
                    <div className="overflow-x-auto rounded-lg shadow-lg border-4 border-brand-primary">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-brand-primary text-black">
                                    <th className="px-6 py-4 text-left text-base font-bold">Email</th>
                                    <th className="px-6 py-4 text-left text-base font-bold">ID</th>
                                    <th className="px-6 py-4 text-left text-base font-bold">Role</th>
                                    <th className="px-6 py-4 text-left text-base font-bold">Name</th>
                                    <th className="px-6 py-4 text-left text-base font-bold">Identifier</th>
                                    <th className="px-6 py-4 text-left text-base font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {userList.map(user => (
                                <tr key={user.id} className="border-b-2 border-brand-primary bg-white hover:bg-blue-50 transition-colors">
                                    {editId === user.id ? (
                                        <>
                                            <td className="px-6 py-4"><input className="w-full px-3 py-2 rounded border-2 border-brand-primary text-base font-medium" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value })}/></td>
                                            <td className="px-6 py-4 text-base font-medium text-brand-primary">{editData.id}</td>
                                            <td className="px-6 py-4"><input className="w-full px-3 py-2 rounded border-2 border-brand-primary text-base font-medium" value={editData.machtiging} onChange={e => setEditData({...editData, machtiging: e.target.value})}/></td>
                                            <td className="px-6 py-4"><input className="w-full px-3 py-2 rounded border-2 border-brand-primary text-base font-medium" value={editData.naam} onChange={e => setEditData({...editData, naam: e.target.value})}/></td>
                                            <td className="px-6 py-4 text-base font-medium text-brand-primary">{editData.user_identifier}</td>
                                            <td className="px-6 py-4 space-x-2">
                                                <button className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded font-bold transition-colors" onClick={() => updateUser(editData)}>Save</button>
                                                <button className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded font-bold transition-colors" onClick={() => setEditId(null)}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                    <>
                                        <td className="px-6 py-4 text-base font-medium text-gray-800">{user.email}</td>
                                        <td className="px-6 py-4 text-base font-medium text-brand-primary">{user.id}</td>
                                        <td className="px-6 py-4 text-base font-medium"><span className="bg-blue-200 text-brand-primary px-3 py-1 rounded-full">{user.machtiging}</span></td>
                                        <td className="px-6 py-4 text-base font-medium text-gray-800">{user.naam}</td>
                                        <td className="px-6 py-4 text-base font-medium text-brand-primary">{user.user_identifier}</td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors" onClick={() => deleteUser(user.user_identifier)}>Delete</button>
                                            <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors" onClick={() => { setEditId(user.id); setEditData(user)}}>Edit</button>
                                        </td>
                                    </>
                                    )}
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                </div>
            </main>
        </>
    )
}

export default Dashboard;