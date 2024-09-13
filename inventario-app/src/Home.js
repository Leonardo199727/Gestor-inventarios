import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import './Home.css';

const Home = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'solicitudes'), (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const solicitudData = doc.data();
                return {
                    id: doc.id,
                    matricula: solicitudData.matricula,
                    fecha: solicitudData.fecha?.seconds 
                        ? new Date(solicitudData.fecha.seconds * 1000).toLocaleString() 
                        : 'Fecha no disponible',
                };
            });
            const sortedData = data.sort((a, b) => b.fecha.localeCompare(a.fecha));
            setRequests(sortedData);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        navigate('/login');
    };

    // Función para navegar a la ventana de Profesores
    const handleGoToProfesores = () => {
        navigate('/profesores'); // Redirige a la ventana de Profesores
    };

    return (
        <div className="home-container">
            <div className="top-container">
                <div className="button-group">
                    <button className="custom-button" onClick={handleGoToProfesores}>Botón 1</button>
                    <button className="custom-button">Botón 2</button>
                </div>
                <button className="logout-button" onClick={handleLogout}>Salir</button>
            </div>

            <div className="table-header-container">
                <table className="requests-table-header">
                    <thead>
                        <tr>
                            <th>ID Solicitud</th>
                            <th>Matrícula</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                </table>
            </div>

            <div className="center-container">
                <table className="requests-table">
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td>
                                    <Link to={`/request-summary/${request.id}`}>{request.id}</Link>
                                </td>
                                <td>{request.matricula}</td>
                                <td>{request.fecha}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;
