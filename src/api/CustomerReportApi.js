import { fetch } from "./Fetch";

export const getReportType = async () => {
    try {
        const response = await fetch.get('/customer-report-type/report-types');
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

export const submitReport = async (fomrdata) => {
        const data = await fetch.post("/customer-reports/submit-report", fomrdata)
        return data
};


export const customerGetResponse =async () =>{
    const data = await fetch.get("/customer-reports/get-customer-response")
    
    
    return data.data
}