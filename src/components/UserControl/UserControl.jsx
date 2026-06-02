import {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import Topbar from "../Topbar/Topbar.jsx";

function UserControl() {

    const [error, setError] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({})
    const [userList, setuserList] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userIdentifier, setUserIdentifier] = useState("");
    const [machtiging, setMachtiging] = useState("user");
    const navigate = useNavigate();

    useEffect(() => {
        getUsers();
    }, []);

    function handleUsernameChange(evt) {
        setName(evt.target.value);
    }

    function handleEmailChange(evt) {
        setEmail(evt.target.value);
    }

    function handlePasswordChange(evt) {
        setPassword(evt.target.value);
    }

    function handleUserIdentifierChange(evt) {
        setUserIdentifier(evt.target.value);
    }

    function handleMachtigingChange(evt) {
        setMachtiging(evt.target.value);
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
            console.log(data);
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
                body: JSON.stringify({ naam: name, email: email, password: password, user_identifier: userIdentifier, machtiging: machtiging })
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                setError(data.err);
            } else {
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
                console.log(data)
                setuserList(data.users);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            navigate('/');
        }
    }

    return(
        <>
            <Topbar/>
            <main className="px-6 max-w-[1100px] mx-auto my-6">
                <details className="mb-6 cursor-pointer">
                    <summary className="font-semibold text-lg text-osaka-900 mb-4">Create new user</summary>
                    <form onSubmit={createUser} className="mt-4 space-y-3 bg-osaka-50 p-5 rounded-lg">
                        <input 
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-osaka-200 focus:outline-none focus:ring-2 focus:ring-osaka-500" 
                          type="text" id="name" name="name" onChange={handleUsernameChange} placeholder="Name"
                        />
                        <input 
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-osaka-200 focus:outline-none focus:ring-2 focus:ring-osaka-500" 
                          type="text" id="email" name="email" onChange={handleEmailChange} placeholder="Email"
                        />
                        <input 
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-osaka-200 focus:outline-none focus:ring-2 focus:ring-osaka-500" 
                          type="text" id="password" name="password" onChange={handlePasswordChange} placeholder="Password"
                        />
                        <input 
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-osaka-200 focus:outline-none focus:ring-2 focus:ring-osaka-500" 
                          type="text" id="user_identifier" name="user_identifier" onChange={handleUserIdentifierChange} placeholder="User Identifier, such as OSAKA-003"
                        />
                        <button className="px-4 py-2 bg-osaka-600 hover:bg-osaka-700 text-white font-medium rounded-lg transition-colors" onClick={createUser}>Create</button>
                    </form>
                </details>
                
                {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}
                
                <div className="overflow-x-auto rounded-lg shadow-md-purple">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-osaka-700 text-white">
                                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">User Identifier</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {userList.map(user => (
                            <tr key={user.id} className="border-b border-osaka-100 hover:bg-osaka-50 transition-colors">
                                {editId === user.id ? (
                                    <>
                                        <td className="px-4 py-3"><input className="w-full px-2 py-1 rounded border border-osaka-200 text-sm" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value })}/></td>
                                        <td className="px-4 py-3"><input className="w-full px-2 py-1 rounded border border-osaka-200 text-sm" value={editData.naam} onChange={e => setEditData({...editData, name: e.target.value})}/></td>
                                        <td className="px-4 py-3"><input className="w-full px-2 py-1 rounded border border-osaka-200 text-sm" placeholder="new password" value={editData.password} onChange={e => setEditData({...editData, password: e.target.value})}/></td>
                                        <td className="px-4 py-3 space-x-2">
                                            <button className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors" onClick={() => updateUser(editData)}>Save</button>
                                            <button className="px-3 py-1.5 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded font-medium transition-colors" onClick={() => setEditId(null)}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                <>
                                    <td className="px-4 py-3 text-sm">{user.email}</td>
                                    <td className="px-4 py-3 text-sm">{user.id}</td>
                                    <td className="px-4 py-3 text-sm">{user.machtiging}</td>
                                    <td className="px-4 py-3 text-sm">{user.naam}</td>
                                    <td className="px-4 py-3 text-sm">{user.user_identifier}</td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors" onClick={() => deleteUser(user.user_identifier)}>Delete</button>
                                        <button className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors" onClick={() => { setEditId(user.id); setEditData(user)}}>Edit</button>
                                    </td>
                                </>
                                )}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
}

export default UserControl;
