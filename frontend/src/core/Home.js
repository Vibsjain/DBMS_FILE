import React from 'react';
import "../styles.css";
import {API} from "../backend";
import Base from  "./Base";

export default function Home(){
    console.log("APP IS", API);
    return (
        <Base title = "Home Page" description = "Welcome to our T-shirt Store!">
            <h1 className="text-white" >Hello front end, We will be running at {API}</h1>
        </Base>
    )
}