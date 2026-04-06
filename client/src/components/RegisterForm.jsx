import { useState } from "react"
import Button from '@mui/material/Button'
export default function RegisterForm({onSubmit, error}){
    //Form for form data (trying something new)
    const [form, setForm] = useState( {
        username: '',
        password: '',
        confirmPass: '',
        email: '',
        name_first: '',
        name_last: '',
        phone: '',
        rank: '',
        role: '',
        DoDID: '',
        uic: ''
    })

    //Error messaging
    const [localError, setLocalError] = useState('')


    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm({
            ...form,
            [name]: value
        })

        //When change happens, clear error
        setError('');
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        //Validate all filled
        const {confirmPass, ...rest} = form;
        if(Object.values(rest).some(v => !v)){
            return setLocalError('All fields are required!')
        }

        //Validate matching pass
        if(form.password != form.confirmPass){
            return setLocalError('Passwords must match!')
        }

        //Send up the payload baby!
        const payload = {
            username: form.username.trim().toLowerCase(), //trim it for spaces, lowercase it for safety
            password: form.password,
            uic: form.uic.trim(),
            email: form.email.trim().toLowerCase,
            name_first: form.name_first.trim(),
            name_last: form.name_last.trim(),
            phone: form.phone.trim(),
            rank: form.rank.trim(),
            role: form.role,
            DoDID: form.DoDID.trim()
        }

        onSubmit(payload)
    }

    return(
        <form className='registerFormContainer' onSubmit={handleSubmit}>
            <div className='mainRegisterForm'>
                <input onChange={handleChange} name='username' type='text' placeholder="Username"/>
                <input onChange={handleChange} name='password' type='password' placeholder="Password"/>
                <input onChange={handleChange} name='confirmPassword' type='password' placeholder="Confirm Password"/>
                {/* etc info, TODO: refactor for visualization */}
                <input 
                    onChange={handleChange}
                    name='email'
                    placeholder="Email Address"
                />
                <input 
                    onChange={handleChange}
                    name='name_first'
                    placeholder="First Name"
                />
                <input 
                    onChange={handleChange}
                    name='name_last'
                    placeholder="Last Name"
                />
                <input 
                    onChange={handleChange}
                    name='phone'
                    placeholder="Phone Number"
                />
                <input 
                    onChange={handleChange}
                    name='rank'
                    placeholder="Rank"
                />
                <input 
                    onChange={handleChange}
                    name='role'
                    placeholder="Role (Command, supply, etc)"
                />
                <input 
                    onChange={handleChange}
                    name='DoDID'
                    placeholder="DoDID"
                />
                <input 
                    onChange={handleChange}
                    name='UIC'
                    placeholder="Unit UIC"
                />
            </div>

            <Button type="submit" variant="contained">Register</Button>

            {(localError || error)}
        </form>
    )
}