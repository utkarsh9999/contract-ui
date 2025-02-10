import './App.css';
import React from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Contracts from './components/Contracts';
import UploadContract from './components/Upload-Contract';
import io  from 'socket.io-client';
import {c} from "react/compiler-runtime";
import { useEffect } from 'react';
import EditContract from './components/Edit-Contract';
const socket = io.connect('http://localhost:5000');

function App() {
  const notify = (message) => toast(message);
  useEffect(()=>{
      const handlereceive=(message)=>{
          console.log("data received "+message);
          notify(message);
        }
        socket.on('receive_message',handlereceive);

        return ()=>{
          socket.off("receive_message",handlereceive);
      }
    },[socket]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Contracts />} />
        <Route path="/upload-contract" element={<UploadContract/>} />
        <Route path="/edit-contract/:contract_id" element={<EditContract/>} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        draggable
        theme="light"
        transition={Bounce}
      />
    </Router>
    
  );
}

export default App;
