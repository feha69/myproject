import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "./Sidebar";


function Student() {
    const navigate = useNavigate();
    const { state } = useLocation()
    const { username } = state;
    const [data, setData] = useState([]);

    function getData() {
        axios.post("/getresult", { username, username })
            .then(res => {
                if (res.data.message === "success") {
                    setData(res.data.result);
                    alert(res.data.message);
                }
                else {
                    alert(res.data.message);
                }
            });
        console.log(data);
    }

    return (
        // <div>
        //     <div>
        //         <h2>username: {username}</h2>
        //         <button onClick={getData}>Show result</button>
        //     </div>
        //     {data.map((semResult, i) => {
        //         return (
        //             <div>
        //                 Semister: {semResult.sem}
        //                 {semResult.total.map((marks, i) => {
        //                     return (
        //                         <div>
        //                             {marks.subject}: {marks.marks}
        //                         </div>
        //                     )
        //                 })}
        //             </div>
        //         );
        //     })}
        // </div>

        <>
            <div style={{ position: "absolute", textAlign: "", marginLeft: "10%" }}>

                <div class="text-center p-5">

                    <div  >
                        <p className="m-3">Welcome to Student DashBoard</p>
                        <h5>username: {username}</h5>
                    </div>

                    <button type="button" class="btn btn-primary m-2" onClick={getData} >Show Result</button>
                    {/* <button type="button" class="btn btn-warning text-white m-2" onClick={() => navigate("/insert-mark")} >Insert Mark</button> */}
                    {/* <button type="button" class="btn btn-danger  m-2 " onClick={() => navigate("/insert-mark")}>student login</button> */}


                </div>



                {/* <div>
                    {data.map((semResult, i) => {
                        return (
                            <div>
                                Semister: {semResult.sem}
                                {semResult.total.map((marks, i) => {
                                    return (
                                        <div>
                                            {marks.subject}: {marks.marks}
                                        </div>
                                    )
                                })}
                            </div>
                        );
                    })}
                </div> */}


                <div>
                    {data.map((semResult, i) => {
                        return (
                            <div>
                                <div>
                                    <div className="m-1 p-1 mb-3" style={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                                        <div className="">
                                            <h5 className="text-center" >Semister: {semResult.sem}</h5>
                                        </div>


                                        <div>
                                            <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Course Name</th>
                                                        <th scope="col">Max Marks</th>
                                                        <th scope="col">Mark Obtain</th>
                                                        <th scope="col">Result</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {semResult.total.map((marks, i) => {
                                                        return (
                                                            <tr>
                                                                <td>{marks.subject}</td>
                                                                <td>100</td>
                                                                <td>{marks.marks}</td>
                                                                <td>Pass</td>
                                                            </tr>

                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>




                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>









            </div>

            <div style={{ position: 'fixed' }}>
                <Sidebar />
            </div>

        </>

    )
}

export default Student;