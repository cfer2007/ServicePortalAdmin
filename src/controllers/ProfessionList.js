import React, { useEffect, useState } from "react";
import { getProfessions, addProfession, updateProfession, deleteProfession } from "../api/api";

const ProfessionList = () => {
  const [professions, setProfessions] = useState([]);
  const [newProfession, setNewProfession] = useState("");
  const [editingProfession, setEditingProfession] = useState(null);

  useEffect(() => {
    fetchProfessions();
    
  }, []);

  const fetchProfessions = async () => {
    try {
      const response = await getProfessions();
      setProfessions(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleAddProfession = async () => {
    if (newProfession.trim() === "") return;
    try {
      const response = await addProfession({ name: newProfession });
      setProfessions([...professions, response.data]);
      setNewProfession("");
    } catch (error) {
      console.error("Error al agregar:", error);
    }
  };

  const handleUpdateProfession = async (professionId, updatedTitle) => {
    try {
      await updateProfession(professionId, { name: updatedTitle});
      setProfessions(
        professions.map((profession) => (profession.professionId === professionId ? { ...profession, name: updatedTitle } : profession))
      );
      setEditingProfession(null);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleDeleteProfession = async (professionId) => {
    try {
      await deleteProfession(professionId);
      setProfessions(professions.filter((profession) => profession.professionId !== professionId));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div>
      <h2>Profesiones</h2>
      
      {/* Agregar nueva tarea */}
      <input type="text" value={newProfession} onChange={(e) => {setNewProfession(e.target.value)}} placeholder="Nueva Categoria..." />
      <button onClick={handleAddProfession}>Agregar</button>

      <ul>
        {professions.map((profession) => (
          <li key={profession.professionId}>
            {editingProfession === profession.professionId ? (
              <>
                <input
                  type="text"
                  defaultValue={profession.name}
                  onBlur={(e) => handleUpdateProfession(profession.professionId, e.target.value)}
                  autoFocus
                />
                <button onClick={() => setEditingProfession(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {profession.professionId+' - '+profession.name}
                <button onClick={() => setEditingProfession(profession.professionId)}>✏️</button>
                <button onClick={() => handleDeleteProfession(profession.professionId)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfessionList;
