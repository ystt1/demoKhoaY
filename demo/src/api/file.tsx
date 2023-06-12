import axios from 'axios'
import { book } from 'ionicons/icons';

export const fileApi = () => {
    const api = axios.create({
        baseURL: 'http://101.99.31.151:3002/api'
    })
    const uploadFile = async (formData: any) => {
        const response = await api.post('/files', formData)
            .then(res => {
                return res
            })
            .catch(error => {
                return error
            })
        return response;
    }
    const parseJson = async (csvFileUrl: string) => {
        const response = await api.post('/parse-csv', {
            csvFileUrl:`${csvFileUrl}`
        })
            .then(res => {
                return res
            })
            .catch(error => {
                return error
            })
        return response;
    }
    const uploadEmp=async(Emp:any)=>{        
        const response = await api.post('/employees', Emp)
        .then(res=>{
            return res
        })
        .catch(error=>{
            return error
        })
        return response;
    }


    return {
        uploadFile,
        parseJson,
        uploadEmp
    }
}
export default fileApi;