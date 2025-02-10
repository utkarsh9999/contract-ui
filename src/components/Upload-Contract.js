import React, { useState, useRef } from "react";
import Navbar from "./subcomponents/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function UploadContract() {
    const navigate=useNavigate();
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [contractText, setContractText] = useState("");

    const fileInputRef = useRef(null);

    function handleUploadClick() {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    function handleFileChange(event) {
        const file = event.target.files[0];

        if (!file) return;
        setFile(file);
        setFileName(file.name);

        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = () => {
            setContractText(reader.result); // Update state instead of modifying DOM directly
        };
    }

    async function UploadContract() {
        try{
            if (!file) {
                alert("Please select a JSON file first!");
                return;
            }
            const date = new Date();
            const onlyDate = date.toISOString().split("T")[0];
            const formData = new FormData();
            formData.append("jsonFile", file);
            formData.append("created_at", onlyDate);
            formData.append("contract_status", document.querySelector("select").value);
            console.log("Uploading JSON File:", file);
            console.log("JSON Content:", contractText);
            const response = await axios.post("http://localhost:5000/api/contract/upload-file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Response:", response.data);
            alert("✅ Upload successful!");
            navigate("/");
        }catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <form>
                    <div className="row">
                        <div className="col-md-12 col-sm-6" style={{ marginTop: 10, marginBottom: 10 }}>
                            <div className="input-group">
                                <div className="input-group-addon">
                                    <span>Upload a JSON File</span>
                                </div>
                                <input className="form-control" type="text" value={fileName} readOnly />
                                <input 
                                    ref={fileInputRef} 
                                    type="file" 
                                    accept=".json" 
                                    style={{ display: "none" }} 
                                    onChange={handleFileChange} 
                                />
                                
                                <div className="input-group-btn">
                                    <button className="btn btn-primary" type="button" onClick={handleUploadClick}>
                                        Select File
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-6" style={{ marginTop: 10, marginBottom: 10 }}>
                            <select className="form-control">
                                <option value="Select" disabled selected>Select Contract Status</option>
                                <option value="Draft">Draft</option>
                                <option value="Finalized">Finalized</option>
                            </select>
                        </div>
                        
                        <div className="col-md-12 col-sm-6" style={{ marginTop: 10, marginBottom: 10 }}>
                            <textarea
                                className="form-control"
                                value={contractText}
                                readOnly
                                rows={6}
                                style={{ resize: "none" }}
                            />
                        </div>
                        <div className="col-md-12 col-sm-6" style={{ marginTop: 10, marginBottom: 10, display: "flex", justifyContent: "end" }}>
                            <button className="btn btn-success" type="button" onClick={UploadContract}>
                                Upload Contract
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
