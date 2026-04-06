import Button from '@mui/material/Button';
import {Stack, TextField} from '@mui/material';

export default function LoginForm({username, password, handleLoginSubmit, handleUsernameInput, handlePasswordInput}) {
    return(
        <form className='loginForm' onSubmit={handleLoginSubmit}>
            <Stack spacing={2}>
                <TextField id="outlined-basic" label="Username" variant="outlined" required type={'text'} onChange={handleUsernameInput} value={username}/>
                <TextField id="outlined-basic" label="Password" variant="outlined" required type={'password'} onChange={handlePasswordInput} value={password}/>
                <Button variant='contained' type={"submit"}>Login</Button>
            </Stack>
        </form>
    )
}