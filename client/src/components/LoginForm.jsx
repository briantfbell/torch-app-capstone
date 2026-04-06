import DefaultPropsProvider from "@mui/material/DefaultPropsProvider";
import Button from '@mui/material/Button'
export default function LoginForm({username, password, handleLoginSubmit, handleUsernameInput, handlePasswordInput}) {
    return(
        <form className='loginForm' onSubmit= {handleLoginSubmit}>

            <input
                onChange={handleUsernameInput}
                value={username}
                type='text'
                placeholder="Username"
            />

            <input
                onChange={handlePasswordInput}
                value={password}
                type='password'
                placeholder="Password"
            />
            <br />
            <Button variant='contained'>Login</Button>

        </form>
    )
}