// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Asegúrate de que la importación sea correcta

const Login = () => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const usuariosRef = collection(db, 'usuarios');
            const q = query(usuariosRef, where('nombre', '==', nombre), where('password', '==', password));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                navigate('/home');
            } else {
                setError('Credenciales inválidas');
                window.location.reload(); // Recarga la página en caso de credenciales incorrectas
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            setError('Error durante el login');
            window.location.reload(); // Recarga la página en caso de error
        }

        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ padding: '40px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Ingresa tus credenciales</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        required 
                        style={{ padding: '10px', marginBottom: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ padding: '10px', marginBottom: '20px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{
                            padding: '10px',
                            fontSize: '16px',
                            borderRadius: '5px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        {loading ? 'Cargando...' : 'Login'}
                    </button>
                    {error && <p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;
