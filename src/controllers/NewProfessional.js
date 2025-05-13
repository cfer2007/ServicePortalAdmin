import React, { useEffect, useState } from "react";
import {getProfessions, getProfessional,updateProfessional,getSkillByProfession, addSkillList, 
        getSkillListByProfessional, deleteProfessionalSkill,addProfessionalAvailabilityList,
        getProfessionalAvailabilitiesByProfessional, deleteProfessionalAvailabilities } from "../api/api";
import { useParams } from "react-router-dom";

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const NewProfessional = () => {

    const [value, setValue] = React.useState(0);
    
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const { id } = useParams();    
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getProfessional(id);
          setProfessional(response.data);
          setSelectedProfession(response.data.profession.professionId);
          if(response.data.profession.professionId !== "") {
            fetchAvailableSkills(response.data.profession.professionId);
          }
        } catch (error) {
          console.error(error.response.data);
          //console.error("Error al obtener los datos:", error);
        }
      };
      fetchData();
      fetchProfessions();      
      fetchSkillListByProfessional();
      fetchProfessionalAvailability();
    }, [id]); 

    /********************************************* Informacion General ********************************************/
    const [professional, setProfessional] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [selectedProfession, setSelectedProfession] = useState("");
    const [professions, setProfessions] = useState([]);

    const handleUpdateProfessional = async () => {
      try {
          await updateProfessional(id, { name: name, lastName: lastName, professionId: selectedProfession });
      } catch (error) {
        console.error("Error al actualizar:", error);
      }
    };

    const fetchProfessions = async () => {
      try {
        const response = await getProfessions();
        setProfessions(response.data);        
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    const handleChangeProfession = (event) => {
      setSelectedProfession(event.target.value)
      fetchAvailableSkills(event.target.value);
      setSelectedSkills([]);
    };

    const fetchAvailableSkills = async (professionId) => {
      try {
        const response = await getSkillByProfession(professionId);
        setAvailableSkills(response.data);        
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    /************************************************************************************************************** */
    /********************************************* Habilidades ******************************************************/    
    const [availableSkills, setAvailableSkills] = useState([]);  
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [savedSkills, setSavedSkills] = useState([]);
    const [deleteSkills, setDeleteSkills] = useState([]);
    const [totalSkills, setTotalSkills] = useState([]);

    const handleSelectedSkill = (event) => {   
      if (totalSkills.some((skill) => skill.skillId === parseInt(event.target.value))) return; 
        availableSkills.map((skill) => {
          if(skill.skillId === parseInt(event.target.value)) {
            setSelectedSkills([...selectedSkills, {skill: {skillId:skill.skillId}, professional: {professionalId:parseInt(id)}}]);
            setTotalSkills([...totalSkills, {name:skill.name, professionalSkillId: 0, professionalId: parseInt(id), skillId:skill.skillId,  }]);
          }
        });
    }

    const handleDeleteSkill = async (skillId) => {
      setSelectedSkills([...selectedSkills.filter((selectedSkill) => selectedSkill.skillId !== skillId)]); 
      setTotalSkills([...totalSkills.filter((selectedSkill) => selectedSkill.skillId !== skillId)]);   
      if (savedSkills.some((skill) => skill.skillId === skillId))  
        setDeleteSkills([...deleteSkills, savedSkills.find((selectedSkill) => selectedSkill.skillId === skillId).professionalSkillId]);

    };

    const fetchSkillListByProfessional = async () => {
      try {
        const response = await getSkillListByProfessional(id);        
        setSavedSkills(response.data);
        setTotalSkills(response.data);      
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } 
    };

    const handleEditSelectedSkills = async () => {
        if (selectedSkills.length > 0){
          try {
            await addSkillList(id,selectedSkills);
            setSelectedSkills([]);
          }         
          catch (error) {
            console.error("Error al agregar habilidades:", error);
          }
        }
        if(deleteSkills.length > 0) {
          try {
            deleteSkills.forEach(async (professionalSkillId) => {
              await deleteProfessionalSkill(professionalSkillId);
            });
            setDeleteSkills([]);
          }         
          catch (error) {
            console.error("Error al eliminar habilidades:", error);
          }
        }
      };


    /******************************************************************************************************** */
    /********************************************* Disponibilidad ********************************************/
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedHours, setSelectedHours] = useState([]);    
    const [savedHours, setSavedHours] = useState([]);
    const [totalHours, setTotalHours] = useState([]);
    const [deleteHours, setDeleteHours] = useState([]);    
    const [selectedStartHour, setSelectedStartHours] = useState("");
    const [selectedEndHour, setSelectedEndHours] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const days =['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const startHours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    const endHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    const fetchProfessionalAvailability = async () => {
      try {
        const response = await getProfessionalAvailabilitiesByProfessional(id);        
        setSavedHours(response.data);
        setTotalHours(response.data);
        response.data.map((res) => selectedDays.includes(res.day) ? null :  selectedDays.push(res.day));
      }
      catch (error) { 
        console.error("Error al obtener los datos:", error);
      }
    };

    const handleSelectedDay = (event) => {
      if (selectedDays.includes(event.target.value)) return;
      setSelectedDays([...selectedDays, event.target.value]);
    };

    const handleSelectedHour = () => {
      //validar que hora fin sea mayor a hora inicio
      if (selectedStartHour === "" || selectedEndHour === "") return;
      if (selectedStartHour >= selectedEndHour) return;
      //validar que no se repita el dia con el mismo rango de horas
      if (totalHours.some((hour) => hour.day === selectedDay && hour.startTime === selectedStartHour && hour.endTime === selectedEndHour)) return;
      //validar que no se repita una hora el mismo dia
      if (totalHours.some((hour) => hour.day === selectedDay && (hour.startTime === selectedStartHour || hour.endTime === selectedEndHour))) return;
      
      setSelectedHours([...selectedHours, {professional:{ professionalId:id}, day: selectedDay, startTime: selectedStartHour, endTime: selectedEndHour, professionalAvailabilityId: 0}]);
      setTotalHours([...totalHours, {professional:{ professionalId:id}, day: selectedDay, startTime: selectedStartHour, endTime: selectedEndHour, professionalAvailabilityId: 0}]);
    }

    const handleDeleteDay = async (day) => {
      setSelectedDays([...selectedDays.filter((d) => d !== day)]); 
      setSelectedHours([...selectedHours.filter((hour) => hour.day !== day)]);
      setTotalHours([...totalHours.filter((hour) => hour.day !== day)]);

      savedHours.map((res) => {
        if(res.day === day) {
          deleteHours.push(res.professionalAvailabilityId);
        }
      }); 
    }

    const handleDeleteHour = async (hour) => {
      setTotalHours([...totalHours.filter((h) => h.day !== hour.day || h.startTime !== hour.startTime || h.endTime !== hour.endTime)]);
      setSelectedHours([...selectedHours.filter((h) => h.day !== hour.day || h.startTime !== hour.startTime || h.endTime !== hour.endTime)]);
      
      if(hour.professionalAvailabilityId !== 0)
        setDeleteHours([...deleteHours, savedHours.find((h) => h.professionalAvailabilityId === hour.professionalAvailabilityId).professionalAvailabilityId]);          
    };

    const handleSaveAvailabilityChanges = async () => {
      if (selectedHours.length > 0){
        try {
          await addProfessionalAvailabilityList(selectedHours);

          setSelectedHours([]);


        }
        catch (error) {
          console.error("Error al agregar disponibilidad:", error);
        }
      }

      if(deleteHours.length > 0) {
        try {
          deleteHours.forEach(async (professionalAvailabilityId) => {
            await deleteProfessionalAvailabilities(professionalAvailabilityId);
          });
          setDeleteHours([]);
        }         
        catch (error) {
          console.error("Error al eliminar disponibilidad:", error);
        }
      }
    }

    

    /******************************************************************************************************** */

    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Informacion General" {...a11yProps(0)} />
            <Tab label="Habilidades" {...a11yProps(1)} />
            <Tab label="Disponibilidad" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <input  type="text" defaultValue={professional.name} placeholder="Nombre..." onChange={(e) => {setName(e.target.value);}}/>
          <br/>
          <input type="text" defaultValue={professional.lastName} placeholder="Apellido..." onChange={(e) => {setLastName(e.target.value);}}/>
          <br/>        
          <input type="text" defaultValue={professional.email}  placeholder="Mail..." disabled={true} />
          <br/>
          <label>Profesiones: </label>
          <br/>
          <select id="ProfessionList"  onChange={handleChangeProfession}
            //value={professional.profession.professionId}
            //onChange={e => setSelectedProfession(e.target.value)}
            value={selectedProfession}
          >
            <option value="">-- Selecciona tu profesion --</option>
              {professions.map((profession) => (          
                <option key={profession.professionId} value={profession.professionId}>
                  {profession.name}
                </option>
              ))}
          </select>
          <br/>
          <br/>
          <button onClick={handleUpdateProfessional}>Guardar</button>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          
          <label>Habilidades: </label>
          <br/>
          <select id="skillList"  onChange={handleSelectedSkill}>
            <option value="">-- Selecciona tus Habilidades --</option>
              {availableSkills.map((skill) => (          
                <option key={skill.skillId} value={skill.skillId}>
                  {skill.name}
                </option>
          ))}
          </select>        
          {totalSkills.map((skill) => (
            <li key={skill.skillId}>
            {
              <>
                {skill.skillId+' - '+skill.name}
                <button onClick={() => handleDeleteSkill(skill.skillId)}>🗑️</button>
              </>
            }
            </li>
          ))}
          <br/>
          <br/>
          <button onClick={handleEditSelectedSkills}>Guardar habilidades</button>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <label >Elegir dias de disponibilidad laboral: </label>
          
          <select id="dayList"  onChange={handleSelectedDay}>
            <option value="">-- Seleccionar dia --</option>
              {days.map((day) => (          
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
          </select>
          {selectedDays.map((day) => (
            <ul key={day} >
            {
              <>
                {day}

                <button onClick={() => handleDeleteDay(day)}>🗑️</button>
                <br/>
                <select id="startHourList"  onChange={e => {setSelectedDay(day); setSelectedStartHours(e.target.value)}}>
                  <option value="">-- Inicio turno --</option>
                    {startHours.map((hour) => (          
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                </select>
                <label> a </label>
                <select id="endHourList"  onChange={e => setSelectedEndHours(e.target.value)}>
                  <option value="">-- Fin turno --</option>
                    {endHours.map((hour) => (          
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                </select>   
                <button onClick={handleSelectedHour}>Agregar</button>   
                <br/>
                {totalHours.map((hour) => (
                  <ol key={hour.day+hour.startTime}>
                    {day === hour.day ?(
                      <> 
                        {hour.startTime+' a '+hour.endTime}
                        <button onClick={() => handleDeleteHour(hour)}>🗑️</button>
                      </>
                      ):null
                    }
                  </ol>
                ))}
              </>            
            }
            </ul> 
          ))}
          <br/>
          <button onClick={handleSaveAvailabilityChanges}>Guardar Disponibilidad</button>
        </CustomTabPanel>
      </Box>

    );
}

export default NewProfessional
