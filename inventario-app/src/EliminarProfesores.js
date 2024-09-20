import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';
import './EliminarProfesores.css';

const EliminarProfesores = () => {
    // Estados para el contenedor izquierdo
    const [carrerasIzq, setCarrerasIzq] = useState([]);
    const [materiasIzq, setMateriasIzq] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [selectedCarreraIzq, setSelectedCarreraIzq] = useState('');
    const [selectedMateriaIzq, setSelectedMateriaIzq] = useState('');
    const [selectedProfesor, setSelectedProfesor] = useState('');

    // Estados para la notificación
    const [notification, setNotification] = useState('');
    const [notificationVisible, setNotificationVisible] = useState(false);

    const navigate = useNavigate();

    // Carga las carreras para el contenedor izquierdo
    useEffect(() => {
        const carrerasCollection = collection(db, 'carreras');
        const unsubscribe = onSnapshot(carrerasCollection, (snapshot) => {
            const carrerasData = snapshot.docs.map(doc => doc.data().nombre);
            setCarrerasIzq(carrerasData);
        });

        return () => unsubscribe();
    }, []);

    // Carga las materias cuando cambia la carrera seleccionada en el contenedor izquierdo
    useEffect(() => {
        if (!selectedCarreraIzq) return;

        const materiasCollection = collection(db, 'materias');
        const q = query(materiasCollection, where('carrera', '==', selectedCarreraIzq));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const materiasData = snapshot.docs.map(doc => ({ nombre: doc.data().nombre }));
            setMateriasIzq(materiasData);
        });

        return () => unsubscribe();
    }, [selectedCarreraIzq]);

    // Carga los profesores cuando cambia la materia seleccionada en el contenedor izquierdo
    useEffect(() => {
        if (!selectedMateriaIzq) return;

        const profesoresCollection = collection(db, 'profesores');
        const q = query(profesoresCollection, where('materia', '==', selectedMateriaIzq));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const profesoresData = snapshot.docs.map(doc => ({ id: doc.id, nombre: doc.data().nombre }));
            setProfesores(profesoresData);
        });

        return () => unsubscribe();
    }, [selectedMateriaIzq]);

    // Función para eliminar un profesor
    const handleRemoveProfesor = async () => {
        if (!selectedProfesor) {
            alert('Por favor, selecciona un profesor para eliminar.');
            return;
        }

        try {
            await deleteDoc(doc(db, 'profesores', selectedProfesor));

            // Muestra la notificación
            setNotification('Profesor eliminado exitosamente');
            setNotificationVisible(true);

            // Oculta la notificación después de 3 segundos
            setTimeout(() => {
                setNotificationVisible(false);
            }, 3000);
        } catch (error) {
            console.error('Error al eliminar profesor: ', error);
        }
    };

    // Maneja el botón de regreso
    const handleGoBack = () => {
        navigate('/home');
    };

    return (
        <div className="eliminar-profesores-container">
            <div className="header-container">
                <button className="back-button" onClick={handleGoBack}>Regresar</button>
            </div>

            <div className="content-wrapper">
                {/* Contenedor izquierdo */}
                <div className="left-section">
                    <h2 className="title">Profesores para Eliminar</h2>
                    <div className="selector-container">
                        <label htmlFor="carrera-izq">Carrera:</label>
                        <select
                            id="carrera-izq"
                            value={selectedCarreraIzq}
                            onChange={(e) => setSelectedCarreraIzq(e.target.value)}
                        >
                            <option value="">Elegir carrera</option>
                            {carrerasIzq.map((carrera, index) => (
                                <option key={index} value={carrera}>
                                    {carrera}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="selector-container">
                        <label htmlFor="materia-izq">Materia:</label>
                        <select
                            id="materia-izq"
                            value={selectedMateriaIzq}
                            onChange={(e) => setSelectedMateriaIzq(e.target.value)}
                            disabled={!selectedCarreraIzq}
                        >
                            <option value="">Elegir materia</option>
                            {materiasIzq.map((materia, index) => (
                                <option key={index} value={materia.nombre}>
                                    {materia.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="profesor-list">
                        <h3>Profesores:</h3>
                        <ul>
                            {profesores.length > 0 ? (
                                profesores.map((profesor) => (
                                    <li key={profesor.id}>
                                        <input
                                            type="radio"
                                            id={profesor.id}
                                            name="profesor"
                                            value={profesor.id}
                                            onChange={(e) => setSelectedProfesor(e.target.value)}
                                        />
                                        <label htmlFor={profesor.id}>{profesor.nombre}</label>
                                    </li>
                                ))
                            ) : (
                                <li>No hay profesores disponibles.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Contenedor derecho */}
                <div className="right-section">
                    <h2 className="title">Eliminar Profesor</h2>
                    <button className="remove-button" onClick={handleRemoveProfesor}>
                        Eliminar Profesor
                    </button>

                    {/* Notificación */}
                    {notificationVisible && (
                        <div className="notification">
                            {notification}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EliminarProfesores;
