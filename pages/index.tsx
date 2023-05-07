import {useEffect} from "react";
import Router from "next/router";
import {useSession} from "next-auth/react";
import SignInButton from "../components/sign-in";


export  const Home = () => {
    const {data : session, status} = useSession();
   useEffect(()=>{
       if(status === 'unauthenticated'){
           Router.push('/apiUtil').then((res)=>{
               if(res){
                   console.log('Redirect Successful')
               }else{
                   console.log('Redirect Failed')
               }
           });
       }
   })
    
    
    
    return (<>
        <SignInButton/>
    </>)
}


export default Home;