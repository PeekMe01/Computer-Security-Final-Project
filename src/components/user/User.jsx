import React,{useState,useEffect, useTransition} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const User = () => {
  const [userInfo, setUserInfo] = useState('');
  const navigate = useNavigate();

  const { i } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:4000/userinfo/${i}`).then((response) => {
        if(response.data.success){
          setUserInfo(response.data);
        }
        else{
          navigate('/')
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    
  }, [i]);
  
  return (
    <div>
      <h1> Username:{userInfo.username}</h1>
      <h1>Email:{userInfo.email}</h1>
      <h1>Password:{userInfo.password}</h1>
      
    </div>
  )
}

export default User