import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

export const analyzeCode = async (code, language) => {
    try {
        const response = await axios.post(`${API_URL}/analyze`, { code, language });
        return response.data;
    } catch (error) {
        console.error("Error analyzing code:", error);
        throw error;
    }
};

export const generateCode = async (prompt, language) => {
    try {
        const response = await axios.post(`${API_URL}/ghost-write`, { prompt, language });
        return response.data;
    } catch (error) {
        console.error("Error generating code:", error);
        throw error;
    }
};

export const generateDocs = async (code, language) => {
    try {
        const response = await axios.post(`${API_URL}/generate-docs`, { code, language });
        return response.data;
    } catch (error) {
        console.error("Error generating docs:", error);
        throw error;
    }
};

export const analyzeImpact = async (code, language) => {
    try {
        const response = await axios.post(`${API_URL}/impact-analysis`, { code, language });
        return response.data;
    } catch (error) {
        console.error("Error analyzing impact:", error);
        throw error;
    }
};
