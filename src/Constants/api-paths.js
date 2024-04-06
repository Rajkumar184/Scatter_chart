import env from "./env";

const API_URL = { 
    CREATE: `${env.BASE_URL}/create`,
    LIST: `${env.BASE_URL}/getcharts`,
    UPDATE: `${env.BASE_URL}/update`,
    DELETE: `${env.BASE_URL}/delete`,
    UPDATEDATAPOINTS: `${env.BASE_URL}/updateDataPoint`,
}

export default API_URL;
