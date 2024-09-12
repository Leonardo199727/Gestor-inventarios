import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import './RequestSummary.css';

const RequestSummary = () => {
    const { id } = useParams();
    const [requestData, setRequestData] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const docRef = doc(db, 'solicitudes', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRequestData(docSnap.data());
                } else {
                    console.log('No existe tal documento');
                }
            } catch (error) {
                console.error('Error recuperando el documento:', error);
            }
        };

        const fetchMaterials = async () => {
            try {
                const materialsQuery = query(collection(db, 'materiales'));
                const querySnapshot = await getDocs(materialsQuery);
                const materialsList = querySnapshot.docs.map(doc => doc.data());
                setMaterials(materialsList);
            } catch (error) {
                console.error('Error recuperando los materiales:', error);
            }
        };

        fetchRequestData();
        fetchMaterials();
    }, [id]);

    useEffect(() => {
        if (searchQuery.length >= 3) {
            const results = materials.filter(material =>
                material.nombre.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMaterials(results);
        } else {
            setFilteredMaterials([]);
        }
    }, [searchQuery, materials]);

    if (!requestData) {
        return <div>Cargando...</div>;
    }

    // Función para verificar si un valor es un objeto de fecha de Firestore
    const isFirestoreDate = (value) => {
        return value instanceof Object && value.seconds;
    };

    const handleLogout = () => {
        navigate('/Home');
    };

    const handleAddMaterial = async () => {
        if (!selectedMaterial) return;

        try {
            const docRef = doc(db, 'solicitudes', id);
            await updateDoc(docRef, {
                materiales: [...(requestData.materiales || []), selectedMaterial.nombre] // Actualiza el campo materiales
            });
            setRequestData(prevData => ({
                ...prevData,
                materiales: [...(prevData.materiales || []), selectedMaterial.nombre]
            }));

            // Limpia el campo de búsqueda y selección después de agregar el material
            setSearchQuery('');
            setSelectedMaterial(null);
            setFilteredMaterials([]);
        } catch (error) {
            console.error('Error actualizando el documento:', error);
        }
    };

    const handleSelectMaterial = (material) => {
        setSearchQuery(material.nombre); // Autocompleta el campo de búsqueda
        setSelectedMaterial(material);   // Guarda el material seleccionado
        setFilteredMaterials([]);        // Limpia las sugerencias
    };

    const handleRemoveLastMaterial = async () => {
        const updatedMaterials = requestData.materiales.slice(0, -1); // Elimina el último material

        try {
            const docRef = doc(db, 'solicitudes', id);
            await updateDoc(docRef, {
                materiales: updatedMaterials // Actualiza el campo materiales en Firestore
            });
            setRequestData(prevData => ({
                ...prevData,
                materiales: updatedMaterials // Actualiza el estado local
            }));
        } catch (error) {
            console.error('Error al eliminar el último material:', error);
        }
    };

    return (
        <div>
            <div className="top-container">
                <button className="logout-button" onClick={handleLogout}>Regresar</button>
            </div>

            <div className="request-summary-container">
                <h2>Resumen de la Solicitud</h2>
                <table className="request-summary-table">
                    <tbody>
                        {Object.entries(requestData).map(([key, value]) => (
                            !isFirestoreDate(value) && (  // Omitimos las fechas
                                <tr key={key}>
                                    <td><strong>{key}:</strong></td>
                                    <td>{Array.isArray(value) ? value.join(', ') : value?.toString()}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>

                {/* Etiqueta Agregar Material */}
                <h3>Agregar material</h3>

                <div className="material-search-container">
                    <input
                        type="text"
                        placeholder="Buscar material..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Sugerencias de materiales */}
                    {filteredMaterials.length > 0 && (
                        <div className="materials-list">
                            <ul>
                                {filteredMaterials.map((material, index) => (
                                    <li key={index} onClick={() => handleSelectMaterial(material)}>
                                        {material.nombre}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button 
                        onClick={handleAddMaterial} 
                        disabled={!selectedMaterial}
                    >
                        Agregar
                    </button>

                    <button 
                        onClick={handleRemoveLastMaterial}
                        disabled={!requestData.materiales || requestData.materiales.length === 0}
                        style={{ 
                            backgroundColor: 'red', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 20px', 
                            borderRadius: '5px', 
                            cursor: 'pointer' 
                        }}
                    >
                        Borrar último material agregado
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestSummary;
