import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import Spinner from './Spinner';

const Login = (props) => {
    const [loading, setLoading] = useState(false)
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    let history = useNavigate()
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const handlesubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json()
        console.log(json)
        if (json.success) {
            setLoading(false)
            localStorage.setItem('token', json.authtoken)
            history("/")
            props.showAlert("Account login succesfully", "success")
        }
        else {
            props.showAlert("Invalid credentials", "danger")
        }
    }
    return (
        <div className='mt-1'>
            <h2 className='my-4'>Login</h2>
            {loading ? <Spinner></Spinner> :
            <form onSubmit={handlesubmit}>
                <div className="mb-3 row">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-label" name='email' value={credentials.email} onChange={onChange} id="email" aria-describedby='emailHelp' />
                </div>
                <div className="mb-3 row">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={credentials.password} onChange={onChange} name='password' />
                </div>
                <button type='submit' className='btn btn-primary'>Submit</button>
            </form>}
        </div>
    )
}

export default Login