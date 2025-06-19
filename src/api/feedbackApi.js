import { fetch } from "./Fetch"

export const getFeebBackByUser = async () => {
    let data = await fetch.get(`/feedback/customer/all`);
    return data.data;
}
export const deleteFeedbackById = async (feedbackId) => {
    try {
        const response = await fetch.delete(`/feedback/delete/${feedbackId}`);
        return response.data; 
    } catch (error) {
        console.error('Error deleting feedback:', error);
        return null; 
    }
}
export const editFeedbackById = async (feedbackId, formData) => {
    let response = await fetch.put(`/feedback/edit/${feedbackId}`, formData);
    return response.data; 
};

export const removeImage =async (id) => {
    let response = await fetch.post("/feedback/remove-image/"+id)
    return response.data;
}