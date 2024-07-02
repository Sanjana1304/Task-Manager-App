import React, { useState } from 'react'
import './index.css';
import {useEffect} from 'react'
import { FaTrashAlt } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import apiReq from './apiReq';

export default function Content() {
  const API_URL = "http://localhost:4000/items";
  const [tasks,setTasks] = useState([]);

  const [isLoading,setIsLoading] = useState(true);

  const [fetchErr,setFetchErr] = useState(null);

  //to show how I fetch(READ OPERATION) data from REST API
  //we use useEffect() for reading as it will be faster.
  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error("Data not receeeivedd");
        const data = await response.json();
        setTasks(data);
        setFetchErr(null);
      } catch (error) {
        console.log(error);
        setFetchErr(error.message)
      } finally{
        setIsLoading(false);
      }
      
    }

    //creating my own setTimeout() to show how I handle data loading
    setTimeout(() => {
      (async () => await fetchData())()
    }, 2000);
    
    
  },[])
  const handleCheck = async(id) => {
    console.log(id);
    const newTasks = tasks.map((task) => (
      task.id===id? {...task,checked:!task.checked} : task
    ));
    setTasks(newTasks);

    //localStorage.setItem("todo_list",JSON.stringify(newTasks));

    const updTask = newTasks.filter((task) => task.id===id);

    const updAction = {
      method:'PATCH',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({checked:updTask[0].checked})
    }

    const reqUrl = `${API_URL}/${id}`;
    const result = await apiReq(reqUrl,updAction);
    if (result) setFetchErr(result);

  }

  const AddTask = async(event) =>{
    if (event.key === 'Enter') {
      const newTasks = tasks?tasks.map((task) =>(
        {...task}
      )):[]
  
      const val = document.getElementById("taskval").value;
      const idd = tasks.length?(+tasks[tasks.length-1].id)+1:1;
      
      const newItem = {id:idd,task:val,checked:false}
      newTasks.push(newItem);
      setTasks(newTasks);

      //this code is for simple local storage
      // localStorage.setItem("todo_list",JSON.stringify(newTasks));

      //Adding to the server
      const postAction = {
        method:'POST',
        headers:{
          'Content-Type' : 'application/json'
        },
        body:JSON.stringify(newItem)
      }

      const result = await apiReq(API_URL,postAction);
      if (result) setFetchErr(result)

      document.getElementById("taskval").value = '';

    }
    
  }

  const delTask  = async(id) => {
    const newTasks = tasks.filter((task) => task.id!==id).map((task)=>(
      {...task}
    ));

    setTasks(newTasks);
    //localStorage.setItem("todo_list",JSON.stringify(newTasks));

    const delAction = {
      method:'DELETE'
    }
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiReq(reqUrl,delAction);
    if (result) setFetchErr(result);
  }

  const [search,setSearch] = useState('');
  return (
    <main>
      
      <div className='taskinputContainer'>
        <div className='taskInputBox'>
        <FaTasks />
        <input id="taskval" type="text" placeholder='Add a new Task' onKeyDown={AddTask}/>
        </div>
      </div>
      
      <div className='searchBox'>
        <input 
          type="text" 
          id='search' 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search Tasks'/>
      </div>

      {fetchErr && <p className='info-msg err'>{`Error:  ${fetchErr} !!!!`}</p>}
      {isLoading && <p className='info-msg'>Your data is loading...</p>}
      {!isLoading && !fetchErr && (tasks.length>0?<p> </p>:<p className='info-msg'>Your list is empty</p>)}

      <div className='listContainer'>
        <ul>
          {
            tasks?
              
            tasks.filter(task => (task.task.toLowerCase().includes(search))).map((task) => (
              <li key={task.id}>
                
                <label className={task.checked? 'strikethrough':''} htmlFor="">{task.task}</label>

                <input 
                className='tickBox'
                type="checkbox" 
                onChange={()=>{handleCheck(task.id)}}
                checked = {task.checked}
                />
                <FaTrashAlt 
                  role='button'
                  onClick={()=> {delTask(task.id)}}
                  tabIndex="0"/>
              </li>
            )):
            ''
          }
          
        </ul>
      
      </div>
      
    </main>
  )
}
