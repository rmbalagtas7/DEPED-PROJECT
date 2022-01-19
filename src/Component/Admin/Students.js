import React from 'react'
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage'
import { Button, Chip, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Switch, TextField, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { getFullName, returnAccessLevelString } from '../utils/functions'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import {Link} from 'react-router-dom'
import CustomBottomBar from '../layout/CustomBottomBar'

function Students() {
    const user = fetchFromStorage('user')
    const [users, setUsers] = React.useState([])
    const [pageSize, setPageSize] = React.useState(10);
    const [selectedRecord, setSelectedRecord] = React.useState(null)
    const [filter, setFilter] = React.useState(true)
    const getUsers = React.useCallback(
        async () => {
            const res = await axiosInstance.get(`/users?&school=${user.school}&access_level=3`)
            console.log(res.data)
            setUsers(res.data.users)
        },
    [user.school])

    React.useEffect(() => {
        getUsers()
    }, [getUsers])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6" gutterBottom>{`Manage Students`}</Typography>
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
                <Button size='small' color="primary" variant="contained" onClick={() => setFilter(!filter)}>{filter ? `Show` : `Hide`} Archived Records</Button>
                {users && (
                    <DataGrid rows={users.filter(a => filter ? !a.archived : a)} 
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
                                            <Typography variant="body2" 
                                            component={Link} to={ cell.row.provisioned ? `/student/${cell.id}` : `/admin/students`} 
                                            color="black" sx={{textDecoration: 'none'}}>{cell.value}</Typography>
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
                                    field: 'archived', 
                                    headerName: 'Status',
                                    width: 150, 
                                    sortable: true,
                                    renderCell: (cellValues) => {
                                        return (
                                            cellValues.value ? <Chip size="small" label="Archived" color="warning" sx={{fontSize: 10}}/> : <Chip size="small" label="Active" color="info" sx={{fontSize: 10}} />
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
            </Box>
            <CustomBottomBar menu={adminMenu} />
        </Box>
    )
}

const ProvisionDialog = ({id, user, open, onClose, onChange}) => {
    const [loading, setLoading] = React.useState(false)
    const [grantAccess, setGrantAccess] = React.useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(false)
        const res = await axiosInstance.post(`/users/provision/${id}`, 
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
                {
                    user.access_level !== 2048 && (
                        <Button 
                            variant="contained" 
                            onClick={() => setGrantAccess(true)}
                            size="small" disabled={loading} color="primary">Proceed with Granting Access</Button>
                    )
                }
                
            </DialogActions>
            {grantAccess && (
                <GrantAccessDialog user={user} open={grantAccess} onClose={() => setGrantAccess(false)} parentClose={onClose} refreshList={onChange}/>
            )}
        </Dialog>
    )
}

const GrantAccessDialog = ({user, open, onClose, parentClose, refreshList}) => {
    
    const [studentData, setStudentData] = React.useState(null)
    const getStudentRecord = React.useCallback(async() => {
        const {data} = await axiosInstance.get(`/studentrecords/byaccount/${user._id}`)
        console.log(data)
        setStudentData({...user, lrn: data.student.lrn})
    }, [user])
    
    React.useEffect(() => {
        getStudentRecord()
    },[getStudentRecord])
    return(
        <Dialog open={open} onClose={onClose} fullScreen style={{width: '500px'}}>
            <DialogContent>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="button" gutterBottom>Update Student Record</Typography>
                    </Grid>
                        {studentData && (
                            <UpdateStudentForm student={studentData} 
                                closeModal={() => {
                                    onClose()
                                    parentClose()
                                    refreshList()
                                }}
                            />
                        )}
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export const UpdateStudentForm = ({student, closeModal}) => {

    const yearNow = new Date().getFullYear()
    const currentSY = `${yearNow} - ${yearNow + 1}`
    const {errors, handleChange, values, handleBlur, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            ...student, 
            sex: 'male',
            bday: '',
            motherTongue: '',
            IP: '',
            grade_level: '', 
            section: '',
            school_year: currentSY
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .required('We need to know your first name.'),
            lastName: Yup.string()
                .required('We need to know your last name.'),
            middleName: Yup.string()
                .required('We need to know your middle name.'),
            lrn: Yup.string()
                .matches(/^[0-9]+$/, "Must be only digits")
                .max(12, "LRN must be 12 digits")
                .required('Please provide a valid LRN'),
            sex: Yup.string()
                .required('Sex is required'),
            bday: Yup.string()
                .required('Birth Date is required'),
            motherTongue: Yup.string(),
            IP: Yup.string(),
            grade_level: Yup.string()
                .required('Grade Level is required'),
            section: Yup.string()
                .required('Section is required'),
        }), 
        onSubmit:  async (values, {resetForm}) => {
            console.log(values)
            const {data} = await axiosInstance.put(`/studentrecords/byaccount/${values._id}`,values)
            console.log(data)
            resetForm()
            closeModal()
          }
    })
    const [sections, setSections] = React.useState([])
    const getSections = React.useCallback(async() => {
        const {data} = await axiosInstance.get(`/sections`)
        setSections(data.sections.filter((a) => a.grade_level === values.grade_level.toString()))
    }, [values.grade_level])

    React.useEffect(() => {
        getSections()
    }, [getSections])

    return (
        <Grid item xs={12} container spacing={2} sx={{mt: 2}}>
            <Grid item xs={12}>
                <TextField 
                    required
                    fullWidth 
                    label="First Name" 
                    size="small" 
                    InputLabelProps={{shrink: true}}
                    name="firstName"
                    autoFocus
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.firstName}
                    helperText={errors.firstName}    
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    required
                    fullWidth 
                    label="Middle Name" 
                    size="small" 
                    InputLabelProps={{shrink: true}}
                    name="middleName"
                    value={values.middleName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.middleName}
                    helperText={errors.middleName}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" size="small" InputLabelProps={{shrink: true}}
                    required
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.lastName}
                    helperText={errors.lastName}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Learner Reference Number (LRN)" size="small" InputLabelProps={{shrink: true}}
                    required
                    name="lrn"
                    value={values.lrn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.lrn}
                    helperText={errors.lrn}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel shrink={true}>Sex</InputLabel>
                    <Select
                        size="small"
                        label="Sex"
                        name="sex"
                        value={values.sex}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    >
                        <MenuItem value={`male`}>Male</MenuItem>
                        <MenuItem value={`female`}>Female</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    size="small"
                    id="date"
                    label="Birthday"
                    type="date"
                    value={values.bday}
                    error={errors.bday}
                    helperText={errors.bday}
                    onChange={({target}) => setFieldValue('bday', target.value) }
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Mother Tongue" size="small" InputLabelProps={{shrink: true}}
                    name="motherTongue"
                    value={values.motherTongue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.motherTongue}
                    helperText={errors.motherTongue}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Ethnic Group" size="small" InputLabelProps={{shrink: true}}
                    name="IP"
                    value={values.IP}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.IP}
                    helperText={errors.IP}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel shrink={true}>Grade Level</InputLabel>
                    <Select
                        size="small"
                        value={values.grade_level}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="grade_level"
                        label="Grade Level"
                        error={errors.grade_level}
                    >
                        {Array.from(new Array(6)).map((el, index) => (
                            <MenuItem value={index + 1}>{index + 1}</MenuItem>
                        ))}
                    </Select>
                    {errors.grade_level && (
                        <FormHelperText error>{errors.grade_level}</FormHelperText>
                    )}
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel shrink={true}>Section</InputLabel>
                        <Select
                            size="small"
                            value={values.section}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="section"
                            label="Section"
                        >
                            {sections?.map((section, index) => (
                                <MenuItem key={index} value={section.section}>{section.section}</MenuItem>
                            ))}
                        </Select>
                        {/* {errors.grade_level && (
                            <FormHelperText error>{errors.grade_level}</FormHelperText>
                        )} */}
                    </FormControl>
                {/* <TextField fullWidth label="Section" size="small" InputLabelProps={{shrink: true}}
                    name="section"
                    value={values.section}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.section}
                    helperText={errors.section}
                /> */}
            </Grid>
            <Grid item xs={12}>
                <Button size="small" fullWidth variant="outlined" color="primary" onClick={closeModal}>Cancel</Button>
            </Grid>
            <Grid item xs={12}>
                <Button size="small" fullWidth variant="contained" color="primary" onClick={handleSubmit}>Save Changes</Button>
            </Grid>
        </Grid>
    )
}
export default Students
