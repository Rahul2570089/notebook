import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import Spinner from './Spinner';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""})
    const [loading, setLoading] = useState(false)
    let history = useNavigate()
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const handlesubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const {name, email, password} = credentials
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email, password})
        });
        const json = await response.json()
        console.log(json)
        if(json.success) {
            setLoading(false)
            localStorage.setItem('token', json.authtoken)
            history("/")
            props.showAlert("Account created succesfully", "success")
        }
        else {
            props.showAlert("Invalid credentials", "danger")
        }
    }
    return (
        <div className='mt-1'>
            <h2 className='my-4'>Create an account</h2>
            {loading ? <Spinner></Spinner> :
            <form onSubmit={handlesubmit}>
                <div className="mb-3 row">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-label" name='name' value={credentials.name} onChange={onChange} id="text" aria-describedby='emailHelp' />
                </div>
                <div className="mb-3 row">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-label" name='email' value={credentials.email} onChange={onChange} id="email" aria-describedby='emailHelp' />
                </div>
                <div className="mb-3 row">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={credentials.password} onChange={onChange} name='password' required minLength={7}/>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" value={credentials.cpassword} onChange={onChange} name='cpassword' required minLength={7}  />
                </div>
                <button type='submit' className='btn btn-primary'>Submit</button>
            </form>}
        </div>
    )
}

export default Signup