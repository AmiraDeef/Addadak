import axios from "axios";

 const authApi=axios.create({
    baseURL:"https://addadak-ikif.vercel.app/"
})

 const elecApi=axios.create({
    baseURL:"https://addadak-metrics.vercel.app/logged/user"
})
 const forecastApi=axios.create({
    baseURL:"https://addadak-bzia.vercel.app/logged/user/predict"
 })

 const walletApi=axios.create({
    baseURL:"https://addadak-n5id.vercel.app/logged/user/wallet/"
})


export default {authApi,elecApi,forecastApi,walletApi}
