import { Link, useNavigate } from "react-router-dom"
import { Input } from "./Input"
import { useState } from "react"
import { SignupInput } from "@jayantguru/medium-clone-common"
import axios from "axios"
import { BACKEND_URL } from "../config"

export const Auth = ({type}: {type: "signup" | "signin"}) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: "",
    })

    async function sendRequest() {
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === 'signup'? 'signup' : 'signin'}`, postInputs);
            const jwt = response.data.token;
            localStorage.setItem('token', jwt);
            navigate('/blogs');
        } catch(e) {
            // alert the user here that the request failed
        }
    }

    return(
        <div className="flex flex-col justify-center h-screen">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-4xl font-bold py-3">
                            {type === "signup"? "Create an account" : "Sign in to your account"}
                        </div>
                        <div className="text-base font-normal text-slate-700 pb-7">
                            {type ==="signup"? "Already have an account? " : "Don't have an account?"} 
                            <Link className="underline" to={type ==="signup"? "/signin" : "/signup"}>
                                {type === "signup"? "Sign in": "Sign up"}
                            </Link>
                        </div>
                    </div>
                    
                    {type === "signup"? <Input label="Name" placeholder="John Doe" onChange={(e) => {
                        setPostInputs((c) => ({
                            ...c,
                            name: e.target.value
                        }))
                    }}/>: null}
                    

                    <Input label="Email" placeholder="johndoe@gmail.com" onChange={(e) => {
                        setPostInputs((c) => ({
                            ...c,
                            email: e.target.value
                        }))
                    }}/>

                    <Input label="Password" type="password" placeholder="123456" onChange={(e) => {
                        setPostInputs((c) => ({
                            ...c,
                            password: e.target.value
                        }))
                    }}/>
                    <button onClick={sendRequest} type="button" className="mt-4 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{type === "signup" ? "Sign up": "Sign in"}</button>
                </div> 
            </div>
        </div>
    )
}