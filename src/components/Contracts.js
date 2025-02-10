import React, { useEffect, useState } from "react";
import Navbar from "./subcomponents/Navbar";
import { use } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Contracts() {
    const [pageValue, set_pageValue] = useState(1);
    const [data, set_data] = useState([]);
    const navigate=useNavigate();
    const [searchLabel,set_searchLabel]=useState("");
    async function setData(){
            const response=await axios.get(`http://localhost:5000/api/contract/get-contracts/${pageValue}`);
            set_data(response.data);
            console.log(response.data);
        }   
    useEffect(() => {
          
        setData();   
    }, [pageValue]);
    const reduce_pageValue = () => {
        if(pageValue>1){
            set_pageValue(pageValue-1);
        }
    }
    const increase_pageValue = () => {
        set_pageValue(pageValue+1);
    }
    const deleteRow = async (id,file_name) => {
        try{
            const response=await axios.delete(`http://localhost:5000/api/contract/delete-contract/${id}/file_name/${file_name}`);
            console.log(response.data);
            const response2=await axios.get(`http://localhost:5000/api/contract/get-contracts/${pageValue}`);
            set_data(response2.data);
        }
        catch(err){
            console.log(err);
        }

    }
    const EditRow = async (id) => {
        try{
            navigate(`/edit-contract/${id}`);
        }
        catch(err){
            console.log(err);
        }
    }
    const search_by_cs = async (e) => {
        try{
            console.log(":"+document.getElementById("contr_status").value+":");
            const response=await axios.get(`http://localhost:5000/api/contract/get-contracts/${pageValue}/contract_status/${e.target.value}`);
            if(response.status===200){
                set_data(response.data);
            }
            else{
                alert(response.data.message);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    const search_by_contractID = async (e) => {
        try{
            if(document.getElementById("search_id").value===null || document.getElementById("search_id").value===""){
                setData();
            }
            e.preventDefault();
            let value=document.getElementById("search_id").value;
            value=value.replace("CONT","");
            console.log(document.getElementById("search_id").value);
            const response=await axios.get(`http://localhost:5000/api/contract/get-contracts/contract_id/${value}`);
            set_data(Array.isArray(response.data) ? response.data : [response.data]); // ✅ Convert to array if needed
        }
        catch(err){
            console.log(err);
        }
    }
    const search_by_client_name = async (e) => {
        e.preventDefault();
        e.target.disabled=true;
        document.getElementById("search_name").disabled=true;
        set_searchLabel("Searching . . .");
        try{
            if(document.getElementById("search_name").value===null || document.getElementById("search_name").value===""){
                setData();
                e.target.disabled=false;
                set_searchLabel("");
                document.getElementById("search_name").disabled=false;
            }
            else{
                let value=document.getElementById("search_name").value;
                const response=await axios.get(`http://localhost:5000/api/contract/get-contracts/client_name/${value}`);
                if(response.status===200){
                    set_searchLabel("✅ Contract Found");
                    set_data(Array.isArray(response.data) ? response.data : [response.data]); 
                    e.target.disabled=false;
                    document.getElementById("search_name").disabled=false;
                }
                else if(response.status===204){
                    //alert("❌ No Contract Found");
                    e.target.disabled=false;
                    set_searchLabel("❌ No Contracts Found");
                    document.getElementById("search_name").disabled=false;
                }
            }
             
        }
        catch(err){
            console.log(err);
        }
    }
  return (
    <>
        <Navbar />
        <div className="container">
            <form>
                <div className="row">
                <div className="col-md-3 col-sm-6" style={{ marginTop: 10 }}>
                    <form>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                id="search_id"
                                required
                                placeholder="Search by Contract ID"
                                aria-describedby="inputGroupFileAddon04"
                                aria-label="Search"
                            />
                            <div className="input-group-btn">
                                <button
                                className="btn btn-primary"
                                type="submit"
                                onClick={(e)=>search_by_contractID(e)}
                                id="inputGroupFileAddon04"
                                >
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-md-3 col-sm-6" style={{ marginTop: 10 }}>
                    <form>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                id="search_name"
                                required
                                placeholder="Search by Client Name"
                                aria-label="Search"
                            />
                            <div className="input-group-btn">
                                <button
                                className="btn btn-primary"
                                type="submit"
                                onClick={(e)=>search_by_client_name(e)}
                                id="inputGroupFileAddon04"
                                >
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                            
                        </div>
                        <label>{searchLabel}</label>
                    </form>
                </div>
                <div className="col-md-3 col-sm-6" style={{ marginTop: 10 }}>
                    <select className="form-control" id="contr_status" onChange={search_by_cs}>
                        <option value="Select" disabled selected>Filter by Contract Status</option>
                        <option value="All" selected>All</option>
                        <option value="Draft">Draft</option>
                        <option value="Finalized">Finalized</option>
                    </select>
                </div>
                <div className="col-md-12">
                    <div className="table-responsive" style={{ marginTop: 10 }}>
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th>Contract ID</th>
                            <th>File Name</th>
                            <th style={{maxWidth:"120px"}}>File Url</th>
                            <th>Contract Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.length === 0 ? <tr><td colSpan="7">Loading . . . </td></tr> :
                            data.map((item,key) => (
                                <tr key={key}>
                                    <td id="contract_id_cell" style={{width:"100px"}}>{"CONT"+item.id}</td>
                                    <td>{item.file_name}</td>
                                    <td>{item.file_url}</td>
                                    <td>{item.contract_status}</td>
                                    <td>{item.created_at}</td>
                                    <td>
                                        <button className="btn btn-success" type="button"  onClick={() => EditRow(item.id)}>
                                            <i className="bi bi-pencil-fill" />
                                        </button>&nbsp;
                                        <button className="btn btn-danger" type="button" onClick={() => deleteRow(item.id,item.file_name)}>
                                            <i className="bi bi-trash-fill" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    </div>
                    <div>
                    <nav style={{ justifyContent: "center", display: "flex" }}>
                        <ul className="pagination">
                        <li>
                            <a aria-label="Previous" style={{cursor:"pointer"}} onClick={() => reduce_pageValue()}>
                                <span aria-hidden="true">
                                    <i class="bi bi-caret-left-fill"/>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a aria-label="Next" style={{cursor:"pointer"}} onClick={() => increase_pageValue()}>
                                <span aria-hidden="true">
                                    <i class="bi bi-caret-right-fill"/>
                                </span>
                            </a>
                        </li>
                        </ul>
                    </nav>
                    </div>
                </div>
                </div>
            </form>
        </div>
    </>
  );
}