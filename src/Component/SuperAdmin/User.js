import { CssBaseline, Grid, Toolbar, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useParams } from 'react-router'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomDrawer, { superadminMenu } from '../layout/CustomDrawer'
import axios from '../../library/axios'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { accountsAvailablePublic } from '../utils/constants'
import CustomBottomBar from '../layout/CustomBottomBar'


function User() {
    
    const {id} = useParams()
    const [user, setUser] = React.useState(null)
    const [errorFetching, setErrorFetching] = React.useState(false)
    const getUser = React.useCallback(
        async () => {
            const res = await axios.get(`/users/${id}`)
            console.log(res.data)
            if (!res.data.success) return setErrorFetching(true)
            return setUser(res.data.user)
        },
        [id],
    )
    const [schools, setSchools] = React.useState(null)
    const getSchools = React.useCallback(
        async () => {
            const res = await axios.get(`/schools`)
            console.log(res.data)
            setSchools(res.data.schools)
        },
    [])
    React.useEffect(() => {
        getUser()
        getSchools()
    },[getUser, getSchools])
    
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6">Manage User Account</Typography>
                <Paper sx={{background: '#edf1f7', p: 2}} elevation={0}>
                    <Typography variant="button" sx={{color: "#000"}}>User Account Details </Typography> 
                    {user && (
                        <UserDetails user={user} schools={schools} />
                    )}
                </Paper>
                {errorFetching && 'The User you are looking for cannot be found. Try going back.'}
            </Box>
            <CustomBottomBar menu={superadminMenu} />
        </Box>
    )
}

const UserDetails = ({user, schools}) => {

    const {errors, handleChange, values, handleBlur} = useFormik({
        initialValues: user, 
        validationSchema: Yup.object({
          firstName: Yup.string()
            .required('First Name is required.'),
          lastName: Yup.string()
            .required('Last Name is required.'),
          email: Yup.string()
            .email('We need a valid email address')
            .required('Email Address is required.'),
          access_level: Yup.number()
            .required('Access Level is required.'),
          school: Yup.string()
        }), 
       
      })
    
    return (
    <Grid container spacing={1} xs={12}>
        <Grid item xs={4}>
        <TextField
            size="small"
            margin="normal"
            required 
            fullWidth
            label="First Name"
            name="firstName"
            autoFocus
            value={values.firstName}
            onChange={handleChange}
            // onBlur={handleBlur}
            error={errors.firstName}
            helperText={errors.firstName}
        />
        </Grid>
        <Grid item xs={4}>
        <TextField
            size="small"
            margin="normal"
            required 
            fullWidth
            label="Last Name"
            name="lastName"
            autoFocus
            value={values.lastName}
            onChange={handleChange}
            // onBlur={handleBlur}
            error={errors.lastName}
            helperText={errors.lastName}
        />
        </Grid>
        <Grid item xs={4}>
        <TextField
            size="small"
            margin="normal"
            fullWidth
            label="Middle Name"
            name="middleName"
            autoFocus
            value={values.middleName}
            onChange={handleChange}
            // onBlur={handleBlur}
            error={errors.middleName}
            helperText={errors.middleName}
        />
        </Grid>
        <Grid item xs={6}>
        <TextField
            size="small"
            margin="normal"
            required 
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={values.email}
            onChange={handleChange}
            // onBlur={handleBlur}
            error={errors.email}
            helperText={errors.email}
        />
        </Grid>
        <Grid item xs={6} style={{marginTop: 15}} >
            <FormControl 
            fullWidth
            >
                <InputLabel>User Level Access</InputLabel>
                <Select
                    size="small"
                    value={values.access_level}
                    label="User Level Access"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="access_level"
                >
                    {accountsAvailablePublic.map((account, index) => (
                        <MenuItem key={index} value={account.value}>{account.text}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={12} style={{marginTop: 15}} >
            <FormControl fullWidth >
                <InputLabel>School</InputLabel>
                <Select
                    size="small"    
                    value={values.school}
                    label="School"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="school"
                >
                    {schools?.map((school, index) => (
                        <MenuItem key={index} value={school._id}>{school.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    </Grid>
    )
}

export default User
