import React, { useEffect, useState } from "react";
import Navbar from "./subcomponents/Navbar";
import axios from "axios";
import io  from 'socket.io-client';
import {c} from "react/compiler-runtime";
import { useNavigate, useParams } from "react-router-dom";
const socket = io.connect('http://localhost:5000');


export default function EditContract() {
    const {contract_id}= useParams();
    const [data, set_data] = useState();
    const [contract_status, set_contract_status] = useState('');
    const navigate=useNavigate();
    const change_contract = (e) => {
        set_data(JSON.parse(e.target.value));
    };
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:5000/api/contract/get-contract/${contract_id}`);
                console.log("Fetched Data:", response.data);
                set_contract_status(response.data.contract_status);
                const url_data = await fetch(response.data.file_url);
                const url_d = await url_data.json();
                set_data(url_d);
                const { id, createdAt, updatedAt,date, ...rest } = response.data;
            } catch (error) {
                console.error("❌ Error fetching contract:", error);
            }
        }
        fetchData();
    }, [contract_id]);
        
    // useEffect(()=>{
    //     const handlereceive=(message)=>{
    //         alert(message);
    //         console.log("data received "+message);
    //     }
    //     socket.on('receive_message',handlereceive);
    //     return ()=>{
    //         socket.off("receive_message",handlereceive);
    //     }
    // },[socket]);

    const update_data = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/contract/update-contract/${contract_id}`, {
                data:{
                    "contract_status": document.querySelector("select").value
                }
            });
            console.log(response.data);
            socket.emit('message',`Contract ${contract_id} updated to ${document.querySelector("select").value}`);
            alert("✅ Contract Update successful!");
            navigate("/");

        } catch (error) {
            console.error("❌ Error updating contract:", error);
        }
    };
    return (
        <>
            <Navbar />
            <div className="container">
                <form>
                    <div className="row">
                    <div
                        className="col-md-12 col-sm-6"
                        style={{ marginTop: 10, marginBottom: 10 }}
                    >
                        <span className="label label-default" style={{ fontSize: 13 }}>
                        Contract ID :&nbsp;{contract_id}
                        </span>
                    </div>
                    <div className="col-md-12 col-sm-6" style={{ marginTop: 10, marginBottom: 10 }}>
                        <select className="form-control">
                        <option value="Select" disabled>Select Contract Status</option>
                           {contract_status?.replace(/"/g, '') === 'Draft' && (
                                <>
                                    <option value="Draft" selected>
                                        Draft (Current)
                                    </option>
                                    <option value="Finalized">Finalized</option>
                                </>
                            )}
                            {contract_status?.replace(/"/g, '') === 'Finalized' && (
                                <>
                                    <option value="Draft">Draft</option>
                                    <option value="Finalized" selected>
                                        Finalized (Current)
                                    </option>
                                </>
                            )}
                        </select>
                        
                    </div>
                    <div
                        className="col-md-12 col-sm-6"
                        style={{ marginTop: 10, marginBottom: 10 }}
                    >
                        <textarea
                        className="form-control"
                        style={{ resize: "none" }}
                        disabled
                        rows={9}
                        value={JSON.stringify(data, null, 8)}
                        onChange={(e) => change_contract(e)}
                        />
                    </div>
                    
                    <div
                        className="col-md-12 col-sm-6"
                        style={{
                        marginTop: 10,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "end"
                        }}
                    >
                        <button className="btn btn-success" onClick={update_data} type="button">
                            Save Contract
                        </button>
                    </div>
                    </div>
                </form>
            </div>
        </>
  );
}