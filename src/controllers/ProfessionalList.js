import React, { useEffect, useState } from "react";
import { getProfessionales, addProfessional, updateProfessional, deleteProfessional } from "../api/api";
import { Link } from "react-router-dom";

const ProfessionalList = () => {
  const [professionals, setProfessionals] = useState([]);
  const [newProfessional, setNewProfessional] = useState("");
  const [editingProfessional, setEditingProfessional] = useState(null);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const response = await getProfessionales();
      setProfessionals(response.data);
    } catch (error) {
      //console.error("Error al obtener los datos:", error);
      console.error(error.response.data);
    }
  };

  const handleAddProfessional = async () => {
    if (newProfessional.trim() === "") return;
    try {
      const response = await addProfessional({ email: newProfessional});
      setProfessionals([...professionals, response.data]);
      setNewProfessional("");
    } catch (error) {
      //console.error("Error al agregar:", error);
      console.error(error.response.data);
    }
  };

  const handleUpdateProfessional = async (professionalId, updatedTitle) => {
    try {
      await updateProfessional(professionalId, { email: updatedTitle});
      setProfessionals(
        professionals.map((professional) => (professional.professionalId === professionalId ? { ...professional, name: updatedTitle } : professional))
      );
      setEditingProfessional(null);
    } catch (error) {
      //console.error("Error al actualizar:", error);
      console.error(error.response.data);
    }
  };

  const handleDeleteProfessional = async (professionalId) => {
    try {
      const response = await deleteProfessional(professionalId);
      console.log(response);
      setProfessionals(professionals.filter((professional) => professional.professionalId !== professionalId));
    } catch (error) {
      //console.error("Error al eliminar:", error);
      console.error(error.response.data);
    }
  };

  return (
    <div>
      <h2>Profesionales</h2>
      
      <input type="text" value={newProfessional} onChange={(e) => { setNewProfessional(e.target.value); }} placeholder="e-mail" />
      <button onClick={handleAddProfessional}>Agregar</button>

      <ul>
        {professionals.map((professional) => (
          <li key={professional.professionalId}>
            {editingProfessional === professional.professionalId ? (
              <>
                <input
                  type="text"
                  defaultValue={professional.email}
                  onBlur={(e) => handleUpdateProfessional(professional.professionalId, e.target.value)}
                  autoFocus
                />
                <button onClick={() => setEditingProfessional(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <Link to={`/NewProfessional/${professional.professionalId}`}>{professional.professionalId+' - '+professional.email}</Link>
                <button onClick={() => handleDeleteProfessional(professional.professionalId)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfessionalList;
