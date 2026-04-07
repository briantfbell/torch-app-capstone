import {useMemo, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Snackbar,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {getCurrentUser} from '../api/auth.js';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const getInitialProfile = () => {
    const currentUser = getCurrentUser() ?? {};

    return {
        username: currentUser.username ?? currentUser.sub ?? 'user',
        email: currentUser.email ?? 'test@test.com',
    };
};

const SectionHeader = ({title, description}) => (
    <Stack spacing={0.75}>
        <Typography variant="h6" fontWeight={700}>
            {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {description}
        </Typography>
    </Stack>
);

const UserSettings = () => {
    const initialProfile = useMemo(() => getInitialProfile(), []);
    const { id } = useParams()
    const { user } = useAuth()
    
    if (user && user.uic !== id) {
    return <div>Access Denied</div>
    }

    const [savedProfile, setSavedProfile] = useState(initialProfile);
    const [username, setUsername] = useState(initialProfile.username);
    const [email, setEmail] = useState(initialProfile.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [desiredPassword, setDesiredPassword] = useState('');
    const [verifyDesiredPassword, setVerifyDesiredPassword] = useState('');
    const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const usernameDirty = username.trim() !== savedProfile.username;
    const emailDirty = email.trim().toLowerCase() !== savedProfile.email.toLowerCase();
    const passwordReady = currentPassword && desiredPassword && verifyDesiredPassword;

    const showFeedback = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
    };

    const resetPasswordForm = () => {
        setCurrentPassword('');
        setDesiredPassword('');
        setVerifyDesiredPassword('');
    };

    const handleUsernameSave = async () => {
        const nextUsername = username.trim();

        if (!nextUsername) {
            setErrorMessage('Enter a display name before saving.');
            return;
        }

        // Placeholder until the backend is done
        setSavedProfile((previous) => ({...previous, username: nextUsername}));
        setUsername(nextUsername);
        setErrorMessage('');
        showFeedback('Display name updated.');
    };

    const handleEmailSave = async () => {
        const nextEmail = email.trim().toLowerCase();
        const isValidEmail = /\S+@\S+\.\S+/.test(nextEmail);

        if (!isValidEmail) {
            setErrorMessage('Enter a valid email address before saving.');
            return;
        }

        // Placeholder until the backend is done
        setSavedProfile((previous) => ({...previous, email: nextEmail}));
        setEmail(nextEmail);
        setErrorMessage('');
        showFeedback('Email address updated.');
    };

    const handlePasswordIntent = () => {
        if (!passwordReady) {
            setErrorMessage('Complete all password fields before continuing.');
            return;
        }

        if (desiredPassword.length < 8) {
            setErrorMessage('New password must be at least 8 characters long.');
            return;
        }

        if (desiredPassword !== verifyDesiredPassword) {
            setErrorMessage('New password and confirmation do not match.');
            return;
        }

        if (currentPassword === desiredPassword) {
            setErrorMessage('Choose a new password that is different from the current one.');
            return;
        }

        setErrorMessage('');
        setConfirmPasswordOpen(true);
    };

    const handlePasswordSave = async () => {
        // Placeholder until the backend is done
        setConfirmPasswordOpen(false);
        resetPasswordForm();
        showFeedback('Password updated.');
    };

    return (
        <>
            <Box sx={{maxWidth: 880, mx: 'auto', width: '100%'}}>
                <Stack spacing={3}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <CardContent sx={{p: {xs: 3, sm: 4}}}>
                            <Stack spacing={2}>
                                <Stack
                                    direction={{xs: 'column', sm: 'row'}}
                                    justifyContent="space-between"
                                    alignItems={{xs: 'flex-start', sm: 'center'}}
                                    spacing={2}
                                >
                                    <Stack spacing={1}>
                                        <Typography variant="overline" color="primary" fontWeight={700}>
                                            Account Settings
                                        </Typography>
                                        <Typography variant="h4" fontWeight={800}>
                                            Manage your profile
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Update your display name, email address, and password from one place.
                                        </Typography>
                                    </Stack>
                                </Stack>
                                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{borderRadius: 4, border: '1px solid', borderColor: 'divider'}}>
                        <CardContent sx={{p: {xs: 3, sm: 4}}}>
                            <Stack spacing={3}>
                                <SectionHeader
                                    title="Display Name"
                                    description="Change the name shown across the app."
                                />
                                <Divider/>
                                <Stack spacing={2}>
                                    <Typography variant="body2" color="text.secondary">
                                        Current username: <Box component="span" sx={{color: 'text.primary', fontWeight: 700}}>{savedProfile.username}</Box>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Desired Username"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                    />
                                    <Box>
                                        <Button
                                            variant="contained"
                                            onClick={handleUsernameSave}
                                            disabled={!usernameDirty}
                                        >
                                            Save Username
                                        </Button>
                                    </Box>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{borderRadius: 4, border: '1px solid', borderColor: 'divider'}}>
                        <CardContent sx={{p: {xs: 3, sm: 4}}}>
                            <Stack spacing={3}>
                                <SectionHeader
                                    title="Email"
                                    description="Keep your account email current."
                                />
                                <Divider/>
                                <Stack spacing={2}>
                                    <Typography variant="body2" color="text.secondary">
                                        Current email: <Box component="span" sx={{color: 'text.primary', fontWeight: 700}}>{savedProfile.email}</Box>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Desired Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                    <Box>
                                        <Button
                                            variant="contained"
                                            onClick={handleEmailSave}
                                            disabled={!emailDirty}
                                        >
                                            Save Email
                                        </Button>
                                    </Box>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{borderRadius: 4, border: '1px solid', borderColor: 'divider'}}>
                        <CardContent sx={{p: {xs: 3, sm: 4}}}>
                            <Stack spacing={3}>
                                <SectionHeader
                                    title="Password"
                                    description="Confirm your current password before applying a new one."
                                />
                                <Divider/>
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(event) => setCurrentPassword(event.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Desired Password"
                                        type="password"
                                        value={desiredPassword}
                                        onChange={(event) => setDesiredPassword(event.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Verify Desired Password"
                                        type="password"
                                        value={verifyDesiredPassword}
                                        onChange={(event) => setVerifyDesiredPassword(event.target.value)}
                                    />
                                    <Box>
                                        <Button
                                            variant="contained"
                                            onClick={handlePasswordIntent}
                                            disabled={!passwordReady}
                                        >
                                            Update Password
                                        </Button>
                                    </Box>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Box>

            <Dialog open={confirmPasswordOpen} onClose={() => setConfirmPasswordOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Confirm password change</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your new password will replace the current one immediately after confirmation.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmPasswordOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handlePasswordSave} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={Boolean(snackbarMessage)}
                autoHideDuration={3000}
                onClose={() => setSnackbarMessage('')}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            >
                <Alert onClose={() => setSnackbarMessage('')} severity={snackbarSeverity} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default UserSettings;
