import axios from "axios";

const API_URL = "http://localhost:8080"; // URL de prueba

export const api = axios.create({
  baseURL: API_URL,
});

// profession

export const getProfessions = async () => api.get('/profession/all');
export const addProfession = async (params) => api.post('/profession/add', params);
export const updateProfession = async (id, params) => api.put(`/profession/edit/${id}`, params);
export const deleteProfession = async (id) => api.delete(`/profession/delete/${id}`);

// Skill
export const getSkillByProfession = async (id) => api.get(`/skill/get/${id}`);
export const addSkill = async (params) => api.post('/skill/add', params);
export const updateSkill = async (id, params) => api.put(`/skill/edit/${id}`, params);
export const deleteSkill = async (id) => api.delete(`/skill/delete/${id}`);

//professional
export const getProfessionales = async () => api.get('/professional/all');
export const getProfessional = async (id) => api.get(`/professional/get/${id}`);
export const addProfessional = async (params) => api.post('/professional/add', params);
export const updateProfessional = async (id, params) => api.put(`/professional/edit/${id}`, params);
export const deleteProfessional = async (id) => api.delete(`/professional/delete/${id}`);

//professional_skill
export const addSkillList = async (params) => api.post('/professional_skill/add/list/', params);
export const getSkillListByProfessional = async (id) => api.get(`/professional_skill/get/${id}`);
export const deleteProfessionalSkill = async (id) => api.delete(`/professional_skill/delete/${id}`);

//professional_availability
export const addProfessionalAvailabilityList = async (params) => api.post('/professional_availability/add/list', params);
export const getProfessionalAvailabilitiesByProfessional = async (id) => api.get(`/professional_availability/get/${id}`);
export const deleteProfessionalAvailabilities = async (id) => api.delete(`/professional_availability/delete/${id}`);