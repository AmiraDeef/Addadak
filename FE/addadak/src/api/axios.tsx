import axios from "axios";

 const authApi=axios.create({
    baseURL:"http://localhost:3001/"
})

 const elecApi=axios.create({
    baseURL:"http://localhost:3002/logged/user"
})

 const walletApi=axios.create({
    baseURL:"http://localhost:3000/logged/user/wallet/"
})
export default {authApi,elecApi,walletApi}