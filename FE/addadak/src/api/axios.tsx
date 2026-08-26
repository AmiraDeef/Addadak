import axios from "axios";

 const authApi=axios.create({
    baseURL:"http://localhost:3000/"
})

 const elecApi=axios.create({
    baseURL:"http://localhost:3002/logged/user"
})
 const forecastApi=axios.create({
    baseURL:"http://localhost:3003/logged/user/predict"
 })

 const walletApi=axios.create({
    baseURL:"http://localhost:3004/logged/user/wallet/"
})


export default {authApi,elecApi,forecastApi,walletApi}
