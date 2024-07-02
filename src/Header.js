import React from 'react'
import './index.css';

export default function Header() {
  const nd = new Date();
  return (
    <header>
        <h1>Task Manager</h1>
       
        <p>{`${nd.getDate()}-${nd.getMonth()}-${nd.getFullYear()}`}</p>
    </header>
  )
}
