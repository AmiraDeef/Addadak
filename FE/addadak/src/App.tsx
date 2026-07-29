import RootHome from './pages/rootHome/RootHome'
import Register from './pages/rootHome/rootHomeChildren/RegisterPage'
import Login from './pages/rootHome/rootHomeChildren/LoginPage'
import RootBody from './components/RootHomeComp/RootBody'
import UserProfile from './pages/loggedUser/loggedUserChidlren/ProfilePage'
import LoggedRoot from './pages/loggedUser/LoggedUserRoot'
import ChartDashboard from "./components/LoggedComp/ElectricityComponents/ChartDashboard";
import TemplateDashboard from './pages/loggedUser/loggedUserChidlren/TemplateDashboard'
import Forecast from './pages/loggedUser/loggedUserChidlren/Forecast'
import Mycredit from './pages/loggedUser/loggedUserChidlren/Mycredit'
import './App.css'
import type { ReactElement } from 'react'
import { Routes,Route } from 'react-router-dom'
import NotFound from './pages/NotFound'




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
      element:<TemplateDashboard></TemplateDashboard>, 
      children:
      [
        //{path:'electricity',element:<ChartDashboard chartData={chartData}></ChartDashboard>},
        {path:'forecast' ,element:<Forecast></Forecast>},
        {path:'credit',element:<Mycredit></Mycredit>}
       
      ]
    },
  ]

  const rootchildrenRoutings:Array<routings>=[
    {path:'/user/register',element:<Register></Register> },
    {path:'/user/login',element:<Login></Login> },
    {path:'/user/notfound',element:<NotFound></NotFound>}

  ]

  return (
    <div >
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
    </div>
  )

}
export default App ;
