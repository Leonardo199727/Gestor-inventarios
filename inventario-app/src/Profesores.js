import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';
import './Profesores.css';

const Profesores = () => {
    // Estados para el contenedor izquierdo
    const [carrerasIzq, setCarrerasIzq] = useState([]);
    const [materiasIzq, setMateriasIzq] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [selectedCarreraIzq, setSelectedCarreraIzq] = useState('');
    const [selectedMateriaIzq, setSelectedMateriaIzq] = useState('');

    // Estados para el contenedor derecho
    const [carrerasDer, setCarrerasDer] = useState([]);
    const [materiasDer, setMateriasDer] = useState([]);
    const [newProfesorName, setNewProfesorName] = useState('');
    const [selectedCarreraDer, setSelectedCarreraDer] = useState('');
    const [selectedMateriaDer, setSelectedMateriaDer] = useState('');

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
            const profesoresData = snapshot.docs.map(doc => doc.data());
            setProfesores(profesoresData);
        });

        return () => unsubscribe();
    }, [selectedMateriaIzq]);

    // Carga las carreras para el contenedor derecho
    useEffect(() => {
        const carrerasCollection = collection(db, 'carreras');
        const unsubscribe = onSnapshot(carrerasCollection, (snapshot) => {
            const carrerasData = snapshot.docs.map(doc => doc.data().nombre);
            setCarrerasDer(carrerasData);
        });

        return () => unsubscribe();
    }, []);

    // Carga las materias cuando cambia la carrera seleccionada en el contenedor derecho
    useEffect(() => {
        if (!selectedCarreraDer) return;

        const materiasCollection = collection(db, 'materias');
        const q = query(materiasCollection, where('carrera', '==', selectedCarreraDer));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const materiasData = snapshot.docs.map(doc => ({ nombre: doc.data().nombre }));
            setMateriasDer(materiasData);
        });

        return () => unsubscribe();
    }, [selectedCarreraDer]);

    // Función para agregar un nuevo profesor
    const handleAddProfesor = async () => {
        if (!selectedCarreraDer || !selectedMateriaDer || !newProfesorName) {
            alert('Por favor, selecciona una carrera, una materia y escribe el nombre del profesor.');
            return;
        }

        try {
            await addDoc(collection(db, 'profesores'), {
                nombre: newProfesorName,
                carrera: selectedCarreraDer,
                materia: selectedMateriaDer
            });

            // Resetea el campo de nombre del profesor después de agregarlo
            setNewProfesorName('');

            // Muestra la notificación
            setNotification('Profesor agregado exitosamente');
            setNotificationVisible(true);

            // Oculta la notificación después de 3 segundos
            setTimeout(() => {
                setNotificationVisible(false);
            }, 3000);
        } catch (error) {
            console.error('Error al agregar profesor: ', error);
        }
    };

    // Maneja el botón de regreso
    const handleGoBack = () => {
        navigate('/home');
    };

    return (
        <div className="profesores-container">
            <div className="top-container">
                <div className="button-group">
                    <button className="custom-button" onClick={handleGoBack}>Regresar</button>
                </div>
            </div>

            <div className="content-wrapper">
                {/* Contenedor izquierdo */}
                <div className="left-container">
                    <h2 className="title">Profesores Registrados</h2>
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

                    <div className="profesores-list">
                        <h3>Profesores:</h3>
                        <ul>
                            {profesores.length > 0 ? (
                                profesores.map((profesor, index) => (
                                    <li key={index}>{profesor.nombre}</li>
                                ))
                            ) : (
                                <li>No hay profesores disponibles.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Contenedor derecho */}
                <div className="right-container">
                    <h2 className="title">Agregar Profesores</h2>
                    <div className="selector-container">
                        <label htmlFor="carrera-der">Carrera:</label>
                        <select
                            id="carrera-der"
                            value={selectedCarreraDer}
                            onChange={(e) => setSelectedCarreraDer(e.target.value)}
                        >
                            <option value="">Elegir carrera</option>
                            {carrerasDer.map((carrera, index) => (
                                <option key={index} value={carrera}>
                                    {carrera}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="selector-container">
                        <label htmlFor="materia-der">Materia:</label>
                        <select
                            id="materia-der"
                            value={selectedMateriaDer}
                            onChange={(e) => setSelectedMateriaDer(e.target.value)}
                            disabled={!selectedCarreraDer}
                        >
                            <option value="">Elegir materia</option>
                            {materiasDer.map((materia, index) => (
                                <option key={index} value={materia.nombre}>
                                    {materia.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-container">
                        <label htmlFor="profesor-nombre">Nombre del Profesor:</label>
                        <input
                            type="text"
                            id="profesor-nombre"
                            value={newProfesorName}
                            onChange={(e) => setNewProfesorName(e.target.value)}
                        />
                    </div>

                    <button className="custom-button2" onClick={handleAddProfesor}>
                        Agregar Profesor
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

export default Profesores;
