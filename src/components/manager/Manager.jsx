import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import styles from './managerstyle.module.css'
const Manager = () => {
  const [usersInfo, setUsersInfo] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:4000/allusersinfo')
      .then(response => {
        if(response.data.access===false){
          
        }
        setUsersInfo(response.data);
      })
      .catch(error => {
        //alert('Error fetching data: ' + error.response.data.access);
      });
        
      axios.get('http://localhost:4000/')
    .then( res => {
      console.log(res.data)
      if(res.data.valid){
        if(res.data.userType==='user'){
          navigate('/');
        }else{
          navigate('/manager')
        }
      }else{
        navigate('/login')
      }
    })
    .catch(err => console.log(err))

  },[navigate]);
    function deleteuser(id){
      axios.post('http://localhost:4000/deleteuser', { id})
      .then(response => {
        const filterusers=usersInfo.filter((user)=>user.id!==id)
          setUsersInfo(filterusers)
          console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
    }
  return (
    <div>
      <h1>All Users Information</h1>
      <table className={styles.usertable}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {usersInfo==null?(<tr><td>ACCESS DENIED</td></tr>):usersInfo.map(user => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
              <button onClick={() => deleteuser(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};


export default Manager