import RootHome from './pages/rootHome/RootHome'
import Register from './pages/rootHome/rootHomeChildren/RegisterPage'
import Login from './pages/rootHome/rootHomeChildren/LoginPage'
import RootBody from './components/RootHomeComp/RootBody'
import UserProfile from './pages/loggedUser/loggedUserChidlren/ProfilePage'
import LoggedRoot from './pages/loggedUser/LoggedUserRoot'
import ElectricDashboard from './components/LoggedComp/ElectricDashboard'
import GasDashboard from './components/LoggedComp/GasDashboard'
import Dashboard from './pages/loggedUser/loggedUserChidlren/Dashboard'
import './App.css'
import type { ReactElement } from 'react'
import { Routes,Route } from 'react-router-dom'
import Forecast from './pages/loggedUser/loggedUserChidlren/Forecast'
import Mycredit from './pages/loggedUser/loggedUserChidlren/Mycredit'
import GasForecast from './components/LoggedComp/GasForecast'
import GasCredit from './components/LoggedComp/GasCredit'
import ELectricForecast from './components/LoggedComp/ElectricForecast'
import ElectricCredit from './components/LoggedComp/ElectricCredit'


function App() {
  interface routings{
    path?:string
    element:ReactElement
    children?:routings[];
    idx?:boolean;
  } 


  const mainRoutings:Array<routings>=[
    {path:'user/profile',element:<UserProfile></UserProfile>},
    {
      path:'user/dashboard',
      element:<Dashboard></Dashboard>, 
      children:
      [
        {path:'electricity',element:<ElectricDashboard ></ElectricDashboard>},
        {path:'gas',element:<GasDashboard></GasDashboard>}
      ]
    },
    {
      path:'user/forecast',
      element:<Forecast></Forecast>,
      children:
      [
        {path:'electricity',element:<ELectricForecast></ELectricForecast>},
        {path:'gas',element:<GasForecast></GasForecast>}
      ]
    },
    {
      path:'user/credit',
      element:<Mycredit></Mycredit>,
      children:
      [
        {path:'electricity',element:<ElectricCredit ></ElectricCredit>},
        {path:'gas',element:<GasCredit></GasCredit>}
      ]
    },    
  ]

  const rootchildrenRoutings:Array<routings>=[
    {path:'/user/register',element:<Register></Register> },
    {path:'/user/login',element:<Login></Login> }

  ]

  return (
    <>
      <Routes>
        <Route path='/' element={<RootHome/>}>
          <Route  index element={<RootBody></RootBody>}></Route>
          {
            rootchildrenRoutings.map((ele:any,index:number)=>{
                return(<Route path={ele.path} key={index} element={ele.element}/>)
            })
          }
          
        </Route>
        <Route path="/logged" element={<LoggedRoot></LoggedRoot>}>
          {
            mainRoutings.map((ele:any,index:number)=>{ 
              if(ele.children)
              {
                return(
                  <Route path={ele.path} key={index} element={ele.element}>
                    {
                      ele.children.map((ele:any, index:number)=>{
                        return(<Route path={ele.path}  key={index} element={ele.element}></Route>)
                        
                      })

                    }
                  </Route>
                )
              }
              else{return(<Route path={ele.path} key={index} element={ele.element}></Route>)}

            })
          }
        </Route>
      </Routes>
    </>
  )

}
export default App ;
