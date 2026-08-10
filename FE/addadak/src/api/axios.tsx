import axios from "axios";

 const authApi=axios.create({
    baseURL:"http://localhost:3001/"
})

 const elecApi=axios.create({
    baseURL:"http://localhost:3002/logged/user"
})
 const forecastApi=axios.create({
    baseURL:"http://localhost:3003/logged/user/predict"
 })


export default {authApi,elecApi,forecastApi}