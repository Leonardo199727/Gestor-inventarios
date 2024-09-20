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
                    nombre: solicitudData.nombre, // Asegúrate de que el campo nombre esté disponible en la base de datos
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

    // Función para navegar a la ventana de Eliminar Profesores
    const handleGoToEliminarProfesores = () => {
        navigate('/eliminar-profesores'); // Redirige a la ventana de Eliminar Profesores
    };

    
    const handleGoToReportes = () => {
        navigate('/materiales'); 
    };

   
    const handleGoToConfiguracion = () => {
        navigate('/configuracion'); // Redirige a la ventana de Configuración
    };

    // Función para navegar a la ventana de Estadísticas
    const handleGoToEstadisticas = () => {
        navigate('/estadisticas'); // Redirige a la ventana de Estadísticas
    };

    return (
        <div className="home-container">
            <div className="top-container">
                <div className="button-group">
                    <button className="custom-button" onClick={handleGoToProfesores}>Agregar Profesores</button>
                    <button className="custom-button" onClick={handleGoToEliminarProfesores}>Eliminar Profesores</button>
                    <button className="custom-button" onClick={handleGoToReportes}>Materiales</button>
                    <button className="custom-button" onClick={handleGoToConfiguracion}></button>
                    <button className="custom-button" onClick={handleGoToEstadisticas}>Estadísticas</button>
                </div>
                <button className="logout-button" onClick={handleLogout}>Salir</button>
            </div>

            <div className="table-header-container">
                <table className="requests-table-header">
                    <thead>
                        <tr>
                            <th>ID Solicitud</th>
                            <th>Nombre</th>
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
                                <td>{request.nombre}</td>
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
