import Button from '@mui/material/Button';
import {Stack, TextField} from '@mui/material';

export default function LoginForm({email, password, handleLoginSubmit, handleEmailInput, handlePasswordInput}) {
    return(
        <form className='loginForm' onSubmit={handleLoginSubmit}>
            <Stack spacing={2}>
                <TextField id="outlined-basic" label="Email" variant="outlined" required type={'text'} onChange={handleEmailInput} value={email}/>
                <TextField id="outlined-basic" label="Password" variant="outlined" required type={'password'} onChange={handlePasswordInput} value={password}/>
                <Button variant='contained' type={"submit"}>Login</Button>
            </Stack>
        </form>
    )
}