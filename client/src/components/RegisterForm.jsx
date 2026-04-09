import { useEffect, useState } from "react"
import Button from '@mui/material/Button'
import { Checkbox, FormGroup, RadioGroup, FormControlLabel, FormLabel, FormControl, Stack, TextField, Radio, InputLabel, Select, MenuItem, Menu } from "@mui/material"

export default function RegisterForm({onSubmit, error}){
    //Form for form data (trying something new)

    const initialFormState = {
        username: '',
        password: '',
        confirmPass: '',
        email: '',
        name_first: '',
        name_last: '',
        phone: '',
        rank: '',
        dodid: '',
        uic: ''
    }
    const [form, setForm] = useState(initialFormState)


    //clearing the screen
    const handleClear = () => {
        if(!window.confirm('Clear entire form?')) return;
        setForm(initialFormState)
        setRoles([])
        setAccountType('user');
        setLocalError('');
    }

    //role modification
    const [accountType, setAccountType] = useState('user'); 
    const [roles, setRoles] = useState([]);

    const handleAccountTypeChange = (e) => {
        const value = e.target.value;
        setAccountType(value)

        if (value === 'admin'){
            setRoles(['admin'])
        } else {
            setRoles(['user'])
        }
    }

    const handleRoleChange = (e) => {
        const {value, checked} = e.target;

        if (accountType === 'admin') return;

        setRoles((prev) => {
            if(checked) {
                return [...prev, value]
            } else {
                return prev.filter((r) => r !== value)
            }
        })
    }

    //Error messaging
    const [localError, setLocalError] = useState('')

    //Handle regular change (not uic and role)
    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm({
            ...form,
            [name]: value
        })

        //When change happens, clear error
        setLocalError('');
    }

    //Handle overall submit
    const handleSubmit = (e) => {
        e.preventDefault();

        //Validate all filled
        const {confirmPass, ...rest} = form;
        if(Object.values(rest).some((v) => !v)){
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
            uic: form.uic,
            email: form.email.trim().toLowerCase(),
            name_first: form.name_first.trim(),
            name_last: form.name_last.trim(),
            phone: form.phone.trim(),
            rank: form.rank.trim(),
            role: roles,
            dodid: form.dodid.trim()
        }
        console.log(payload)
        onSubmit(payload)
    }

    //Handle the UIC change
    const handleUicChange = (e) => {
        setForm({
            ...form,
            uic: e.target.value
        })
    }

    //Fetch the UICs
    const [uics, setUics] = useState([''])
    
    useEffect(() => {
        const fetchUics = async () => {
            try{
                const res = await fetch('http://localhost:8080/uics')
                const data = await res.json();
                setUics(data.allUics)
                console.log(data.allUics)
            } catch{
                console.error('Failed to fetch UICs')
            }
        }
        fetchUics()
    }, [])

    //Create the damn ranks
    const enlistedRanks = ['E-1', 'E-2', 'E-3', 'E-4', 'E-5', 'E-6', 'E-7', 'E-8', 'E-9']
    const officerRanks = ['O-1', 'O-2', 'O-3', 'O-4', 'O-5', 'O-6', 'O-7', 'O-8', 'O-9', 'O-10']
    const warrantRanks = ['W-1', 'W-2', 'W-3', 'W-4', 'W-5']
    const civilianRanks = ['GS-1', 'GS-2', 'GS-3', 'GS-4', 'GS-5', 'GS-6', 'GS-7', 'GS-8', 'GS-9', 'GS-10', 'GS-11', 'GS-12', 'GS-13', 'GS-14', 'GS-15']

    const [rankType, setRankType] = useState('');
    const handleRankTypeChange = (e) => {
        const value = e.target.value;
        setRankType(value);
    };


    return(
        <form className='registerFormContainer' onSubmit={handleSubmit}>
            <Stack spacing={2} direction="row" justifyContent="center">
                <Stack spacing={3}>
                    <TextField id='outlined-basic'  value={form.username} label='username' required onChange={handleChange} name='username' type='text' placeholder="Username"/>
                    <TextField id='outlined-basic'  value={form.password} label='password' required onChange={handleChange} name='password' type='password' placeholder="Password"/>
                    <TextField id='outlined-basic'  value={form.confirmPass} label='confirmPass' required onChange={handleChange} name='confirmPass' type='password' placeholder="Confirm Password"/>
                    
                    {/* etc info, */}
                    <TextField id='outlined-basic'  label='email' required value={form.email} onChange={handleChange} name='email' placeholder="Email Address" />
                    <TextField id='outlined-basic'  label='name_first' required value={form.name_first} onChange={handleChange} name='name_first' placeholder="First Name"/>
                    <TextField id='outlined-basic'  label='name_last' required value={form.name_last} onChange={handleChange} name='name_last' placeholder="Last Name"/>
                    <TextField id='outlined-basic'  label='phone' required value={form.phone} onChange={handleChange} name='phone' placeholder="Phone Number" />
                    <TextField id='outlined-basic'  label='DoDID' required value={form.dodid}
                        onChange={handleChange}
                        name='dodid'
                        placeholder="DoDID"
                    />
                </Stack>
                <Stack spacing={2}>
                    
                    {/*Form for ranks, one select box for the type, the other changes based on the type chosen*/}
                    <FormControl required>
                        <FormLabel id="rank-type">Select Rank Type</FormLabel>
                        <RadioGroup value={rankType} onChange={handleRankTypeChange}>
                            <FormControlLabel value="enlisted" control={<Radio />} label="Enlisted" />
                            <FormControlLabel value="officer" control={<Radio />} label="Officer" />
                            <FormControlLabel value="warrant" control={<Radio />} label="Warrant Officer" />
                            <FormControlLabel value="civilian" control={<Radio />} label="Civilian" />
                        </RadioGroup>
                        <FormLabel id="rank">Select Rank</FormLabel>
                        <Select
                            labelId="rank"
                            id="rank"
                            value={form.rank}
                            label="Rank"
                            onChange={handleChange}
                            name='rank'
                        >
                            {rankType === 'enlisted' && enlistedRanks.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            {rankType === 'officer' && officerRanks.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            {rankType === 'warrant' && warrantRanks.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            {rankType === 'civilian' && civilianRanks.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                        </Select>
                    </FormControl>
                    
                    {/*Form for account control, has checkbox and radio control*/}
                    <FormControl required>
                        <FormLabel id="role">Account Type</FormLabel>
                        <RadioGroup value={accountType} onChange={handleAccountTypeChange}>
                            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                            <FormControlLabel value="user" control={<Radio />} label="User" />
                        </RadioGroup>
                        <FormLabel>Roles</FormLabel>
                        <FormGroup required>
                            <FormControlLabel control={<Checkbox value= 'hrh' checked={roles.includes('hrh')} disabled={accountType === 'admin'} onChange={handleRoleChange} />} label="HRH" />
                            <FormControlLabel control={<Checkbox value = 'sub-hrh' checked={roles.includes('sub-hrh')} disabled={accountType === 'admin'} onChange={handleRoleChange} />} label="sub-HRH" />
                            <FormControlLabel control={<Checkbox value = 't-hrh' checked={roles.includes('t-hrh')} disabled={accountType === 'admin'} onChange={handleRoleChange}/>} label="t-HRH" />
                        </FormGroup>
                    </FormControl>

                    {/*UIC input with drop down, from upper fetch*/}
                    <FormControl fullWidth>
                        <InputLabel id='uic'>UIC</InputLabel>
                        <Select
                            labelId='uic'
                            id='uic'
                            value={form.uic}
                            label="UIC"
                            onChange={handleUicChange}
                        >
                            {uics.map((uic) => (
                                <MenuItem key={uic.uic} value={uic.uic}>{uic.uic}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Stack>
            <br/>
            <Stack direction = "row" spacing={2} justifyContent="center">
                <Button type="submit" variant="contained">Register</Button>
                <Button type="button" variant="outlined" color="secondary" onClick={handleClear}>Clear Form</Button>
            </Stack>

            {(localError || error) && <p>{localError || error}</p>}
        </form>
    )
}