import RootHome from './pages/rootHome/RootHome'
import Register from './pages/rootHome/rootHomeChildren/RegisterPage'
import Login from './pages/rootHome/rootHomeChildren/LoginPage'
import RootBody from './components/RootHomeComp/RootBody'
import UserProfile from './pages/loggedUser/loggedUserChidlren/ProfilePage'
import LoggedRoot from './pages/loggedUser/LoggedUserRoot'
import { Routes,Route } from 'react-router-dom'
import './App.css'
import type { ReactElement } from 'react'

function App() {
  interface routings{
    path:string
    element:ReactElement
  } 

  const routings:any=[
    {path:'/user/register',element:<Register></Register> },
    {path:'/user/login',element:<Login></Login> },
    {path:'user/profile',element:<UserProfile></UserProfile>},
    

  ]

  return (
    <>
      <Routes>
        <Route path='/' element={<RootHome/>}>
          <Route index element={<RootBody></RootBody>}/>
          {
            routings.map((ele:any,index:number)=>{
              if(index==0||index==1){return(<Route path={ele.path} key={index} element={ele.element}/>)}
            })
          }
        </Route>
        <Route path="/logged" element={<LoggedRoot></LoggedRoot>}>
        {
          routings.map((ele:any,index:number)=>{
            if(index>1){return(<Route path={ele.path} key={index} element={ele.element}/>)}
          }) 
        }


        </Route>
      </Routes>
    </>
  )
}

export default App
