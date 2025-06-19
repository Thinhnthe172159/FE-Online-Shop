import { fetch } from "./Fetch";

export const getReportType = async () => {
    try {
        const response = await fetch.get('/shop-report-type/all'); 
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching report types:", error);
        return null; 
    }
};
export const submitReport = async (formData) => {
    try {
        const data = await fetch.post("/shop-reports/submit-report", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error submitting report:", error);
        return null;
    }
};

