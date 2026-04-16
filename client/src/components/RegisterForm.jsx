import { useEffect, useState } from "react"
import Button from '@mui/material/Button'
import { InputAdornment, IconButton, Stepper, Step, StepLabel, Checkbox, FormGroup, RadioGroup, FormControlLabel, FormLabel, FormControl, Stack, TextField, Radio, InputLabel, Select, MenuItem, Menu, Tooltip } from "@mui/material"
import { Visibility } from "@mui/icons-material"
import { VisibilityOff } from "@mui/icons-material"

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

    //step control for the form to allow it to fit better with the new splash stuff
    const steps = ["Account", "Personal Info", "Assignment"];
    const [activeStep, setActiveStep] = useState(0);
    const [isValid, setIsValid] = useState(true);
    const validateStep = () => {
        //validate account
        if(activeStep === 0){
            if(!form.username || !form.password || !form.confirmPass || !form.email){
                setLocalError('All fields are required!')
                setIsValid(false);
                return false;
            }
            if(form.password !== form.confirmPass){
                setLocalError('Passwords must match!')
                setIsValid(false);
                return false;
            }
        }

        //validate personal info
        if(activeStep === 1){
            if(!form.name_first || !form.name_last || !form.phone || !form.dodid){
                setLocalError('All fields are required!')
                setIsValid(false);
                return false;
            }

            if(isNaN(form.phone) || isNaN(form.dodid)){
                setLocalError('Phone and DoDID must be numbers')
                setIsValid(false);
                return false;
            }

            if(form.dodid.length !== 10){
                setLocalError('DoDID must be 10 digits')
                setIsValid(false);
                return false;
            }

            if(form.phone.length < 10 || form.phone.length > 15){
                setLocalError('Phone number must be between 10 and 15 digits')
                setIsValid(false);
                return false;
            }
        }

        //validate assignment
        if(activeStep === 2){
            if(!form.rank || !form.uic){
                setLocalError('All fields are required!')
                setIsValid(false);
                return false;
            }
            if(roles.length === 0){
                setLocalError('At least one role must be selected!')
                setIsValid(false);
                return false;
            }
            if(accountType === 'user' && !roles.includes('hrh') && !roles.includes('sub-hrh') && !roles.includes('t-hrh')){
                setLocalError('Users must have at least one HRH role!')
                setIsValid(false);
                return false;
            }
        }

        //If we pass all that, clear error and move on
        setLocalError('');
        setIsValid(true);
        return true;
    }

    //next and back buttons
    const handleNext = () => {
        if(validateStep()) setActiveStep((prev) => prev + 1)
    };
    const handleBack = () => {
        setIsValid(true);
        setActiveStep((prev) => prev - 1);
    };


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

    //Need this to check for updates
    useEffect(() => {
        validateStep();
    }, [form, roles, activeStep]);

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
        if(form.password !== form.confirmPass){
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

    //password visibility stuff
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);


    return (
        <form className="registerFormContainer" onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ width: 400 }}>
            
            {/*Steppin it*/}
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
                ))}
            </Stepper>

            {/*Step 1 - Account */}
            {activeStep === 0 && (
                <Stack spacing={2}>
                    <TextField required label="Username" name="username" value={form.username} onChange={handleChange} fullWidth />
                    {/*password*/}
                    <TextField
                    required
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                    />
                    {/*confirm password*/}
                    <TextField
                    required
                    label="Confirm Password"
                    name="confirmPass"
                    type={showConfirmPass ? "text" : "password"}
                    value={form.confirmPass}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                            onClick={() => setShowConfirmPass((prev) => !prev)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                            >
                            {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                    />
                    <TextField required label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
                </Stack>
            )}

            {/*Step 2 - Personal info */}
            {activeStep === 1 && (
                <Stack spacing={2}>
                <TextField required label="First Name" name="name_first" value={form.name_first} onChange={handleChange} fullWidth />
                <TextField required label="Last Name" name="name_last" value={form.name_last} onChange={handleChange} fullWidth />
                <TextField required label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
                <TextField required label="DoDID" name="dodid" value={form.dodid} onChange={handleChange} fullWidth />
                </Stack>
            )}

            {/*Step 3 - Admin stuff */}
            {activeStep === 2 && (
                <Stack padding={1} borderRight={1} borderLeft={1} borderColor="divider" direction="row" spacing={2}>
                    <Stack spacing={3.7} sx={{width: '50%'}}>
                        {/*ranks */}
                        <FormControl>
                            <FormLabel>Rank Type</FormLabel>
                            <RadioGroup required value={rankType} onChange={handleRankTypeChange}>
                            <FormControlLabel value="enlisted" control={<Radio />} label="Enlisted" />
                            <FormControlLabel value="officer" control={<Radio />} label="Officer" />
                            <FormControlLabel value="warrant" control={<Radio />} label="Warrant" />
                            <FormControlLabel value="civilian" control={<Radio />} label="Civilian" />
                            </RadioGroup>
                        </FormControl>
                        <FormLabel>Rank</FormLabel>
                        <Select required value={form.rank} onChange={handleChange} name="rank" fullWidth>
                            {rankType === "enlisted" && enlistedRanks.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            {rankType === "officer" && officerRanks.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            {rankType === "warrant" && warrantRanks.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            {rankType === "civilian" && civilianRanks.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                        </Select>
                    </Stack>
                    <Stack spacing={2} sx={{width: '50%'}}>
                        {/*roles*/}
                        <FormControl>
                            <FormLabel>Account Type</FormLabel>
                            <RadioGroup required value={accountType} onChange={handleAccountTypeChange}>
                            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                            <FormControlLabel value="user" control={<Radio />} label="User" />
                            </RadioGroup>

                            <FormLabel>Roles</FormLabel>
                            <FormGroup>
                            <FormControlLabel control={<Checkbox disabled={accountType === "admin"} value="hrh" checked={roles.includes("hrh")} onChange={handleRoleChange} />} label="HRH" />
                            <FormControlLabel control={<Checkbox disabled={accountType === "admin"} value="sub-hrh" checked={roles.includes("sub-hrh")} onChange={handleRoleChange} />} label="sub-HRH" />
                            <FormControlLabel control={<Checkbox disabled={accountType === "admin"} value="t-hrh" checked={roles.includes("t-hrh")} onChange={handleRoleChange} />} label="t-HRH" />
                            </FormGroup>
                        </FormControl>
                        {/* UIC */}
                        <FormControl fullWidth>
                            <InputLabel>UIC</InputLabel>
                            <Select required value={form.uic} onChange={handleUicChange}>
                            {uics.map((uic) => (
                                <MenuItem key={uic.uic} value={uic.uic}>{uic.uic}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>
            )}

            {/*nav buttons*/}
            <Stack direction="row" spacing={2} justifyContent="space-between">
                <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
                </Button>

                {activeStep < steps.length - 1 ? (
                    <Tooltip title={!isValid ? localError : ''}>
                        <span>
                            <Button disabled={!isValid} variant="contained" onClick={handleNext}>
                                Next
                            </Button>
                        </span>
                    </Tooltip>
                ) : (
                    <Tooltip title={!isValid ? localError : ''}>
                        <span>
                            <Button disabled={!isValid} type="submit" variant="contained">
                                Register
                            </Button>
                        </span>
                    </Tooltip>
                )}
            </Stack>

            
            {(error) && <p><strong>Error: {error}</strong></p>}
            </Stack>
        </form>
    )
}