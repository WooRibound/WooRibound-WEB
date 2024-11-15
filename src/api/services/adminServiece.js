import handleApiCall from '@/api/apiService';

// 채용공고 삭제
export const deleteJobPosting= async (postId) => {
    try {
        const response = await handleApiCall('post', `/admin/jobposting/delete?postId=${postId}`);
        return response;
    } catch (error) {
        console.error('Failed to delete:', error);
        throw error;
    }
}