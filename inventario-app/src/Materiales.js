import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './Materiales.css';

const Materiales = () => {
    const [addMaterial, setAddMaterial] = useState('');
    const [addCantidad, setAddCantidad] = useState('');
    const [modifyMaterial, setModifyMaterial] = useState('');
    const [modifyCantidad, setModifyCantidad] = useState('');
    const [materiales, setMateriales] = useState([]);
    const [modifyFilteredMaterials, setModifyFilteredMaterials] = useState([]);
    const [availableFilteredMaterials, setAvailableFilteredMaterials] = useState([]);
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const navigate = useNavigate();

    const fetchMaterials = async () => {
        const querySnapshot = await getDocs(collection(db, 'materiales'));
        const allMaterials = [];
        querySnapshot.forEach(doc => {
            allMaterials.push({ id: doc.id, ...doc.data() });
        });
        setMateriales(allMaterials);
        setAvailableFilteredMaterials(allMaterials); // Inicializa los materiales disponibles
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleAddMaterial = async () => {
        if (addMaterial === '' || addCantidad === '') {
            alert('Por favor, completa todos los campos');
            return;
        }

        try {
            await addDoc(collection(db, 'materiales'), {
                nombre: addMaterial,
                cantidad: Number(addCantidad),
            });
            alert('Material agregado exitosamente');
            setAddMaterial('');
            setAddCantidad('');
            fetchMaterials(); // Refresh the materials list
        } catch (error) {
            console.error('Error al agregar material: ', error);
        }
    };

    const handleModifySearchMaterial = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setModifyMaterial(searchValue);

        if (searchValue.length >= 2) {
            const results = materiales.filter(material =>
                material.nombre.toLowerCase().includes(searchValue)
            );
            setModifyFilteredMaterials(results);
        } else {
            setModifyFilteredMaterials([]); // No muestra nada si hay menos de 2 caracteres
        }
    };

    const handleSelectMaterial = (material) => {
        setModifyMaterial(material.nombre);
        setModifyCantidad(material.cantidad);
        setSelectedMaterialId(material.id);
    };

    const handleModifyMaterial = async () => {
        if (selectedMaterialId === '') {
            alert('Por favor, selecciona un material para modificar');
            return;
        }

        try {
            const materialRef = doc(db, 'materiales', selectedMaterialId);
            await updateDoc(materialRef, {
                nombre: modifyMaterial,
                cantidad: Number(modifyCantidad),
            });
            alert('Material modificado exitosamente');
            setModifyMaterial('');
            setModifyCantidad('');
            setSelectedMaterialId('');
            fetchMaterials(); // Refresh the materials list
        } catch (error) {
            console.error('Error al modificar material: ', error);
        }
    };

    const handleAvailableSearchMaterial = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const results = materiales.filter(material =>
            material.nombre.toLowerCase().includes(searchValue)
        );
        setAvailableFilteredMaterials(results);
    };

    const handleGoToHome = () => {
        navigate('/Home');
    };

    return (
        <div className="page-container">
            <div className="top-container">
                <button className="red-button" onClick={handleGoToHome}>Regresar</button>
            </div>
            <div className="content-container">
                {/* Sección de Agregar Material */}
                <div className="section">
                    <h2 className="section-title">Agregar materiales</h2>
                    <label htmlFor="add-material">Material:</label>
                    <input
                        type="text"
                        id="add-material"
                        placeholder="Escribe el material aquí"
                        value={addMaterial}
                        onChange={(e) => setAddMaterial(e.target.value)}
                    />
                    <label htmlFor="add-cantidad">Cantidad:</label>
                    <input
                        type="number"
                        id="add-cantidad"
                        placeholder="Escribe la cantidad aquí"
                        value={addCantidad}
                        onChange={(e) => setAddCantidad(e.target.value)}
                    />
                    <button className="add-button" onClick={handleAddMaterial}>
                        Agregar
                    </button>
                </div>

                {/* Sección de Modificar Material */}
                <div className="section">
                    <h2 className="section-title">Modificar Material</h2>
                    <label htmlFor="modify-material">Material:</label>
                    <input
                        type="text"
                        id="modify-material"
                        placeholder="Buscar material a modificar"
                        value={modifyMaterial}
                        onChange={handleModifySearchMaterial}
                    />
                    {modifyFilteredMaterials.length > 0 && (
                        <ul className="material-list">
                            {modifyFilteredMaterials.map((material) => (
                                <li key={material.id} onClick={() => handleSelectMaterial(material)}>
                                    {material.nombre} (Cantidad: {material.cantidad})
                                </li>
                            ))}
                        </ul>
                    )}
                    <label htmlFor="modify-cantidad">Cantidad:</label>
                    <input
                        type="number"
                        id="modify-cantidad"
                        placeholder="Escribe la cantidad aquí"
                        value={modifyCantidad}
                        onChange={(e) => setModifyCantidad(e.target.value)}
                    />
                    <button className="modify-button" onClick={handleModifyMaterial}>
                        Modificar
                    </button>
                </div>

                {/* Sección de Materiales Disponibles */}
                <div className="section">
                    <h2 className="section-title">Materiales disponibles</h2>
                    <label htmlFor="available-filter-material">Buscar Material:</label>
                    <input
                        type="text"
                        id="available-filter-material"
                        placeholder="Escribe el material aquí"
                        onChange={handleAvailableSearchMaterial}
                    />
                    <div className="material-container">
                        {availableFilteredMaterials.length > 0 ? (
                            availableFilteredMaterials.map((material) => (
                                <div key={material.id} className="material-item">
                                    <span>{material.nombre}</span>
                                    <span>{material.cantidad}</span>
                                </div>
                            ))
                        ) : (
                            <div className="material-item">
                                <span>No hay materiales disponibles</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Materiales;
