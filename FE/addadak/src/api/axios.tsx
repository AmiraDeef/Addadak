import axios from "axios";

 const authApi=axios.create({
    baseURL:"http://localhost:3001/user"
})

 const elecApi=axios.create({
    baseURL:"http://localhost:3002/logged/user"
})


export default {authApi,elecApi}