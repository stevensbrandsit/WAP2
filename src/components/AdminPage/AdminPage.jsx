import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './AdminPage.css';

function AdminPage() {

    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const contract = localStorage.getItem('contract');
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({})
    const [userList, setuserList] = useState([]);
    const [name, setName] = useState("");
    const [createEmail, setCreateEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userIdentifier, setUserIdentifier] = useState("");
    const [machtiging, setMachtiging] = useState("user");

    const getUsers = useCallback(async () => {
        try {
            const response = await fetch(`/IWA/contracten/${contract}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('contract');
                    localStorage.removeItem('email');
                    navigate('/');
                    return;
                }
                setError(data.error || 'Failed to load the user list.');
            } else {
                setError(null);
                setuserList(data.users);
            }
        } catch {
            navigate('/');
        }
    }, [contract, navigate, token]);

    useEffect(() => {
        if (!token || !contract) {
            navigate('/');
            return;
        }

        const timeoutId = window.setTimeout(() => {
            getUsers();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [token, contract, navigate, getUsers]);

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

    function handleRoleChange(evt) {
        setMachtiging(evt.target.value);
    }

    async function updateUser(user) {
        try {
            const response = await fetch(`/IWA/contracten/${contract}/user/${user.user_identifier}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ naam: user.naam, email: user.email, machtiging: user.machtiging, password: user.password })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || data.err || 'Failed to update the user.')
            } else {
                setEditId(null)
                await getUsers();
            }
        } catch {
            setError('An error occurred while updating the user.');
        }
    }

    async function createUser() {
        try {
            const response = await fetch(`/IWA/contracten/${contract}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ naam: name, email: createEmail, password: password, user_identifier: userIdentifier, machtiging: machtiging })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || data.err || 'Failed to create the user.');
            } else {
                setName("");
                setCreateEmail("");
                setPassword("");
                setUserIdentifier("");
                setMachtiging("user");
                await getUsers();
            }
        } catch {
            setError('An error occurred while creating the user.');
        }
    }

    async function deleteUser(identifier) {
        try {
            const response = await fetch(`/IWA/contracten/${contract}/user/${identifier}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            if (response.ok) {
                await getUsers();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to delete the user.');
            }
        } catch {
            setError('An error occurred while deleting the user.');
        }
    }

    const totalUsers = userList.length;
    const adminUsers = userList.filter((user) => user.machtiging === 'admin').length;
    const regularUsers = Math.max(0, totalUsers - adminUsers);

    return (
        <>
            <main className="admin-page">
                <div className="admin-container">
                    <div className="admin-hero">
                        <span className="admin-hero__kicker">Contract Administration</span>
                        <h1 className="admin-hero__title">Users and permissions</h1>
                        <p className="admin-hero__text">
                            Add accounts or change permissions for users who may view or manage this contract data.
                        </p>
                    </div>

                    <div className="admin-stats">
                        <article className="admin-stat">
                            <p className="admin-stat__label">Total accounts</p>
                            <p className="admin-stat__value">{totalUsers}</p>
                        </article>
                        <article className="admin-stat">
                            <p className="admin-stat__label">Admin users</p>
                            <p className="admin-stat__value">{adminUsers}</p>
                        </article>
                        <article className="admin-stat">
                            <p className="admin-stat__label">Regular users</p>
                            <p className="admin-stat__value">{regularUsers}</p>
                        </article>
                        <article className="admin-stat">
                            <p className="admin-stat__label">Signed in as</p>
                            <p className="admin-stat__value admin-stat__value--email">{email || 'Unknown'}</p>
                        </article>
                    </div>

                    {error && <p className="admin-alert admin-alert--error">{error}</p>}

                    <section className="admin-section">
                        <details className="admin-details">
                            <summary className="admin-details__summary">Add new user</summary>
                            <form onSubmit={(e) => { e.preventDefault(); createUser(); }} className="admin-form">
                                <label className="admin-field">
                                    <span>Full name</span>
                                    <input
                                      type="text" value={name} onChange={handleUsernameChange}
                                      placeholder="For example: Aya Nakamura" required
                                    />
                                </label>
                                <label className="admin-field">
                                    <span>Email address</span>
                                    <input
                                      type="email" value={createEmail} onChange={handleEmailChange}
                                      placeholder="name@organisation.com" required
                                    />
                                </label>
                                <label className="admin-field">
                                    <span>Password</span>
                                    <input
                                      type="password" value={password} onChange={handlePasswordChange}
                                      placeholder="Choose a strong password" required
                                    />
                                </label>
                                <label className="admin-field">
                                    <span>User identifier</span>
                                    <input
                                      type="text" value={userIdentifier} onChange={handleUserIdentifierChange}
                                      placeholder="For example: OSAKA-003" required
                                    />
                                </label>
                                <label className="admin-field">
                                    <span>Role</span>
                                    <select value={machtiging} onChange={handleRoleChange}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </label>
                                <div className="admin-form__actions">
                                    <button className="admin-primary-button" type="submit">Create user</button>
                                </div>
                            </form>
                        </details>

                        <div className="admin-table-shell">
                            <div className="admin-table-shell__header">
                                <div>
                                    <h3>Contract users</h3>
                                    <p>{totalUsers} accounts linked to this contract.</p>
                                </div>
                            </div>
                            <div className="admin-table-scroll">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>ID</th>
                                            <th>Role</th>
                                            <th>Name</th>
                                            <th>Identifier</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {userList.map(user => (
                                        <tr key={user.id}>
                                            {editId === user.id ? (
                                                <>
                                                    <td><input className="admin-table__input" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value })}/></td>
                                                    <td className="admin-table__id">{editData.id}</td>
                                                    <td><input className="admin-table__input" value={editData.machtiging} onChange={e => setEditData({...editData, machtiging: e.target.value})}/></td>
                                                    <td><input className="admin-table__input" value={editData.naam} onChange={e => setEditData({...editData, naam: e.target.value})}/></td>
                                                    <td className="admin-table__id">{editData.user_identifier}</td>
                                                    <td>
                                                        <div className="admin-table__actions">
                                                            <button className="admin-action-button admin-action-button--success" onClick={() => updateUser(editData)}>Save</button>
                                                            <button className="admin-action-button admin-action-button--neutral" onClick={() => setEditId(null)}>Cancel</button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                            <>
                                                <td>{user.email}</td>
                                                <td className="admin-table__id">{user.id}</td>
                                                <td>
                                                    <span className="admin-role-pill">{user.machtiging}</span>
                                                </td>
                                                <td>{user.naam}</td>
                                                <td className="admin-table__id">{user.user_identifier}</td>
                                                <td>
                                                    <div className="admin-table__actions">
                                                        <button className="admin-action-button admin-action-button--danger" onClick={() => deleteUser(user.user_identifier)}>Delete</button>
                                                        <button className="admin-action-button admin-action-button--primary" onClick={() => { setEditId(user.id); setEditData(user)}}>Edit</button>
                                                    </div>
                                                </td>
                                            </>
                                            )}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}

export default AdminPage;
