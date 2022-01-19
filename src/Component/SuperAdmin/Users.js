import { Add } from '@mui/icons-material';
import { Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Switch, TextField, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { AuthenticatedAppBar } from '../layout/CustomAppBar';
import CustomDrawer, { superadminMenu } from '../layout/CustomDrawer';
import axios from '../../library/axios'
import { getFullName, returnAccessLevelString } from '../utils/functions';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertDialog } from '../LandingPage';
import { accountsAvailable } from '../utils/constants';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import CustomBottomBar from '../layout/CustomBottomBar';


function Users() {
    const [users, setUsers] = React.useState([])
    const [newUser, setNewUser] = React.useState(false)
    const [schools, setSchools] = React.useState(null)
    const [pageSize, setPageSize] = React.useState(10);
    const [selectedRecord, setSelectedRecord] = React.useState(null)
    const getUsers = React.useCallback(
        async () => {
            const res = await axios.get(`/users`)
            console.log(res.data)
            setUsers(res.data.users)
        },
    [])
    const getSchools = React.useCallback(
        async () => {
            const res = await axios.get(`/schools`)
            console.log(res.data)
            setSchools(res.data.schools)
        },
    [])

    React.useEffect(() => {
        getUsers()
        getSchools()
    }, [getUsers, getSchools])

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6">Manage Users Accounts</Typography>
                <NewUserModal open={newUser} onClose={() => setNewUser(false)} refreshList={getUsers} schools={schools} />
                <div style={{display: 'flex', justifyContent:"flex-end", alignItems: 'center', margin: "20px 0px"}}>
                    <Button 
                        onClick={() => setNewUser(true)}
                        variant="contained" size="small" color="primary" startIcon={<Add /> }>Add new User</Button>
                </div>
                {
                    selectedRecord && (
                        <ProvisionDialog 
                            id={selectedRecord.id} 
                            user={selectedRecord.row} 
                            open={Boolean(selectedRecord)}
                            onClose={() => setSelectedRecord(null)}
                            onChange={getUsers}
                        />
                    )
                }
                <div style={{minHeight: 650, height: 650, width: '100%'}}>
                    {users && (
                        <DataGrid rows={users} 
                            autoHeight 
                            rowHeight={35}
                            getRowId={(row) => row._id}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            columns={[
                                { 
                                    field: 'fullName', 
                                    headerName: 'Full Name',
                                    flex: 1,
                                    minWidth: 250,
                                    valueGetter: getFullName,
                                    sortable: false,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" component={Link} to={`/user/${cell.id}`} color="black" sx={{textDecoration: 'none'}}>{cell.value}</Typography>
                                        )
                                    }
                                },
                                { 
                                    field: 'email', 
                                    headerName: 'Email',
                                    flex: 1,
                                    minWidth: 350, 
                                },
                                { 
                                    field: 'provisioned', 
                                    headerName: 'Access Allowed',
                                    width: 150, 
                                    renderCell: (cellValues) => {
                                        return (
                                            <Switch readOnly checked={cellValues.value} onChange={() => setSelectedRecord(cellValues)}/>
                                        )
                                    }
                                },
                                { 
                                    field: 'access_level', 
                                    headerName: 'Access Level',
                                    flex: 1,
                                    minWidth: 250, 
                                    valueGetter: (params) => {
                                        return returnAccessLevelString(params.value)
                                    },
                                },
                            ]}
                            rowsPerPageOptions={[5, 10, 20]}
                            pagination
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        />
                    )}
                </div>
            </Box>
            <CustomBottomBar menu={superadminMenu} />
            </Box>
    )
}


export const ProvisionDialog = ({id, user, open, onClose, onChange}) => {
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(false)
        const res = await axios.post(`/users/provision/${id}`, 
        {
            provision: !user.provisioned, 
            access_level: user.access_level
        })
        console.log(res.data)
        onChange()
        onClose()
    }
    return (
        <Dialog open={open} onClose={onClose} component="form" onSubmit={handleSubmit}>
            <DialogTitle>Allow Access?</DialogTitle>
            <DialogContent>
                {user.access_level !== 3
                    ?(
                        <p>Are you sure you want to {user.provisioned ? 'revoke' : 'give'} access to this user?</p>
                    ): (
                        <p>Please update the student record first before granting access to a Student account.</p>
                    )}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" disabled={loading} onClick={onClose}>Cancel</Button>
                {
                    user.access_level !== 3 && (
                        <Button variant="contained" size="small" type="submit" disabled={loading} color="primary">Save</Button>
                    ) 
                }
            </DialogActions>
        </Dialog>
    )
}

export const NewUserModal = ({open, onClose, refreshList, schools, restricted}) => {
    const [message, setMessage] = React.useState(null)
    const [success, setSuccess] = React.useState("error")
    const [loading, setLoading] = React.useState(false)
    const now = new Date()
    const defaultPassword = "DEPED" + (now.getUTCMonth() + 1) + "" + now.getDate()  + "" + now.getFullYear()
    const {errors, handleChange, values, handleBlur, handleSubmit} = useFormik({
        initialValues: {
          firstName: '',
          lastName: '',
          email: '',
          password: defaultPassword,
          confirmed: true, 
          access_level: 2, 
          provisioned: true,
          school: '',
        }, 
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
        onSubmit:  async (values, {resetForm}) => {
            setLoading(true)
            const {data} = await axios.post('/users',values)
            console.log(data)
            const res = await axios.post(`/users/forgotpass`, {email: values.email})
            console.log(res)
            setLoading(false)
            setMessage(data.success 
                ? 'User Account Created.' 
                : data.message )
            setSuccess(data.success ? 'success' : 'error')
            resetForm()
            refreshList()
            onClose()
        }
      })
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth component="form" onSubmit={handleSubmit}>
            <AlertDialog callback={() => setMessage(null)} message={message} success={success}/>
            <DialogTitle>Add New User Account</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} xs={12}>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            margin="normal"
                            required fullWidth
                            label="First Name"
                            name="firstName"
                            autoFocus
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.firstName}
                            helperText={errors.firstName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            margin="normal"
                            required fullWidth
                            label="Last Name"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.lastName}
                            helperText={errors.lastName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            size="small"
                            margin="normal"
                            required fullWidth
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.email}
                            helperText={errors.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>User Level Access</InputLabel>
                            <Select
                                size="small"
                                value={values.access_level}
                                label="User Level Access"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="access_level"
                            >
                                { !restricted && accountsAvailable.map((account) => (
                                    <MenuItem value={account.value}>{account.text}</MenuItem>
                                ))}

                                {
                                    restricted && (
                                        <MenuItem value={2}>Faculty</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    {
                        values.access_level !== 4096 && (
                            <Grid item xs={12}>
                                <FormControl fullWidth focused>
                                    <InputLabel shrink={true}>School</InputLabel>
                                    <Select
                                        size="small"
                                        value={values.school}
                                        label="School"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="school"
                                    >
                                        {schools?.map((school) => (
                                            <MenuItem value={school._id}>{school.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )
                    }
                </Grid>   
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" disabled={loading} onClick={onClose}>Cancel</Button>
                <Button variant="contained" size="small" type="submit" disabled={loading} color="primary">Create Account</Button>
            </DialogActions>
        </Dialog>
    )
}
export default Users
