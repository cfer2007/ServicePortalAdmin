import React, { useEffect, useState } from "react";
import { getProfessions, getSkillByProfession, addSkill, updateSkill, deleteSkill } from "../api/api";

const SkillList = () => {
  const [professions, setProfessions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);
  const [selectedProfession, setSelectedProfession] = useState("");

  const handleChangeProfession = (event) => {
    setSelectedProfession(event.target.value);
    fetchSkills(event.target.value);
  };

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

  const fetchSkills = async (professionId) => {
    try {
      const response = await getSkillByProfession(professionId);
      setSkills(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleAddSkill = async () => {
    if (newSkill.trim() === "") return;
    try {
      const response = await addSkill({name: newSkill, professionId: selectedProfession });
      setSkills([...skills, response.data]);
      setNewSkill("");
    } catch (error) {
      console.error("Error al agregar:", error);
    }
  };

  const handleUpdateSkill = async (skillId, updatedTitle) => {
    try {
      await updateSkill(skillId, { name: updatedTitle, completed: false });
      setSkills(
        skills.map((skill) => (skill.skillId === skillId ? { ...skill, name: updatedTitle } : skill))
      );
      setEditingSkill(null);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await deleteSkill(skillId);
      setSkills(skills.filter((skill) => skill.skillId !== skillId));
      
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    
    <div>
      <div>
        <label htmlFor="dropdown">Selecciona una Categoria: </label>
        <select id="dropdown"  onChange={handleChangeProfession}>
          <option value="">-- Selecciona --</option>
          {professions.map((profession) => (          
            <option key={profession.professionId} value={profession.professionId}>
              {profession.name}
            </option>
          ))}
        </select>
      </div>
      <h2>Categorias</h2>
      
      {/* Agregar nueva tarea */}
      <input type="text" value={newSkill} onChange={(e) => {setNewSkill(e.target.value)}}
        placeholder="Nueva Categoria..."
      />
      <button onClick={handleAddSkill}>Agregar</button>

      <ul>
        {skills.map((skill) => (
          <li key={skill.skillId}>
            {editingSkill === skill.skillId ? (
              <>
                <input
                  type="text"
                  defaultValue={skill.name}
                  onBlur={(e) => handleUpdateSkill(skill.skillId, e.target.value)}
                  autoFocus
                />
                <button onClick={() => setEditingSkill(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {skill.skillId+' - '+skill.name}
                <button onClick={() => setEditingSkill(skill.skillId)}>✏️</button>
                <button onClick={() => handleDeleteSkill(skill.skillId)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillList;
