import handleApiCall from '@/api/apiService';

export const fetchJobs = async () => {
    try {
        const data = await handleApiCall('get', '/global/jobs');
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};