import {useEffect, useState} from 'react';
import './UserControl.css';
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
            <details>
                <summary>Create new user</summary>
                <form onSubmit={createUser}>
                    <input className="form-input" type="text" id="name" name="name" onChange={handleUsernameChange} placeholder="Name"/>
                    <input className="form-input" type="text" id="email" name="email" onChange={handleEmailChange} placeholder="Email"/>
                    <input className="form-input" type="text" id="password" name="password" onChange={handlePasswordChange} placeholder="Password"/>
                    <input className="form-input" type="text" id="user_identifier" name="user_identifier" onChange={handleUserIdentifierChange} placeholder="User Identifier, such as OSAKA-003"/>
                    <button className="button" onClick={createUser}>Create</button>
                </form>
            </details>
            {error && <p style={{color: "red"}}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <td>Email</td>
                        <td>ID</td>
                        <td>Role</td>
                        <td>Name</td>
                        <td>User Identifier</td>
                        <td>Acties</td>
                    </tr>
                </thead>
                <tbody>
                {userList.map(user => (
                    <tr key={user.id}>
                        {editId === user.id ? (
                            <>
                                <td><input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value })}/></td>
                                <td><input value={editData.naam} onChange={e => setEditData({...editData, name: e.target.value})}/></td>
                                <td><input placeholder="new password" value={editData.password} onChange={e => setEditData({...editData, password: e.target.value})}/></td>
                                <td>
                                    <button onClick={() => updateUser(editData)}>Save</button>
                                    <button onClick={() => setEditId(null)}>Cancel</button>
                                </td>
                            </>
                        ) : (
                        <>
                            <td>{user.email}</td>
                            <td>{user.id}</td>
                            <td>{user.machtiging}</td>
                            <td>{user.naam}</td>
                            <td>{user.user_identifier}</td>
                            <td>
                                <button onClick={() => deleteUser(user.user_identifier)}>Delete</button>
                                <button onClick={() => { setEditId(user.id); setEditData(user)}}>Edit</button>
                            </td>
                        </>
                        )}
                    </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default UserControl;
