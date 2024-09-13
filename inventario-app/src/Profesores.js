import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación
import './Profesores.css';

const Profesores = () => {
    const [carreras, setCarreras] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [selectedCarrera, setSelectedCarrera] = useState('');
    const [selectedMateria, setSelectedMateria] = useState('');
    const navigate = useNavigate(); // Inicializa useNavigate

    // Carga las carreras
    useEffect(() => {
        const fetchCarreras = async () => {
            const carrerasCollection = collection(db, 'carreras');
            const carrerasSnapshot = await getDocs(carrerasCollection);
            const carrerasData = carrerasSnapshot.docs.map(doc => doc.data().nombre);
            setCarreras(carrerasData);
        };

        fetchCarreras();
    }, []);

    // Carga las materias cuando cambia la carrera seleccionada
    useEffect(() => {
        const fetchMaterias = async () => {
            if (!selectedCarrera) return;

            const materiasCollection = collection(db, 'materias');
            const q = query(materiasCollection, where('carrera', '==', selectedCarrera));
            const materiasSnapshot = await getDocs(q);
            const materiasData = materiasSnapshot.docs.map(doc => ({ nombre: doc.data().nombre }));
            setMaterias(materiasData);
        };

        fetchMaterias();
    }, [selectedCarrera]);

    // Carga los profesores cuando cambia la materia seleccionada
    useEffect(() => {
        const fetchProfesores = async () => {
            if (!selectedMateria) return;

            const profesoresCollection = collection(db, 'profesores');
            const q = query(profesoresCollection, where('materia', '==', selectedMateria));
            const profesoresSnapshot = await getDocs(q);
            const profesoresData = profesoresSnapshot.docs.map(doc => doc.data());
            setProfesores(profesoresData);
        };

        fetchProfesores();
    }, [selectedMateria]);

    // Maneja el botón de regreso
    const handleGoBack = () => {
        navigate('/home'); // Cambia la ruta a '/home'
    };

    return (
        <div className="profesores-container">
            <div className="top-container">
                <div className="button-group">
                    <button className="custom-button" onClick={handleGoBack}>Regresar</button>
                </div>
            </div>

            <div className="content-wrapper">
                <div className="left-container">
                    <div className="selector-container">
                        <label htmlFor="carrera">Carrera:</label>
                        <select
                            id="carrera"
                            value={selectedCarrera}
                            onChange={(e) => setSelectedCarrera(e.target.value)}
                        >
                            <option value="">Elegir carrera</option>
                            {carreras.map((carrera, index) => (
                                <option key={index} value={carrera}>
                                    {carrera}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="selector-container">
                        <label htmlFor="materia">Materia:</label>
                        <select
                            id="materia"
                            value={selectedMateria}
                            onChange={(e) => setSelectedMateria(e.target.value)}
                            disabled={!selectedCarrera} // Desactiva el selector de materias si no hay carrera seleccionada
                        >
                            <option value="">Elegir materia</option>
                            {materias.map((materia, index) => (
                                <option key={index} value={materia.nombre}>
                                    {materia.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sección para mostrar los profesores */}
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
                <div className="right-container">
                    <h2>Contenedor Derecho</h2>
                    <p>Aquí puedes agregar contenido adicional.</p>
                </div>
            </div>
        </div>
    );
};

export default Profesores;
