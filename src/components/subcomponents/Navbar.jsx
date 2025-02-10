import React from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="navbar navbar-default">
    <div className="container-fluid">
        <div className="navbar-header">
        <a className="navbar-brand" href="#">
            Contract System
        </a>
        <button
            data-toggle="collapse"
            className="navbar-toggle collapsed"
            data-target="#navcol-1"
        >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
        </button>
        </div>
        <div className="collapse navbar-collapse" id="navcol-1">
        <ul className="nav navbar-nav">
            <li className="dropdown" style={{cursor:"pointer"}}>
            <a
                className="dropdown-toggle"
                aria-expanded="false"
                data-toggle="dropdown"
            >
                Contracts&nbsp;
                <span className="caret" />
            </a>
            <ul className="dropdown-menu">
                <li>
                    <Link to="/">View Contracts</Link>
                </li>
                <li>
                    <Link to="/upload-contract">Upload Contract</Link>
                </li>
            </ul>
            </li>
        </ul>
        </div>
    </div>
    </nav>
  );
}