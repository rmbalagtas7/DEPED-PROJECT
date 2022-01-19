import { Close, History, Save } from '@mui/icons-material'
import { Backdrop, Button, CircularProgress, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, TextField, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { fetchFromStorage } from '../../library/utilities/Storage'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomDrawer, { studentMenu } from '../layout/CustomDrawer'
import axiosInstance from '../../library/axios'
import CustomBottomBar from '../layout/CustomBottomBar'
function Profile() {
    const user = fetchFromStorage('user')

    const [studentProfile, setStudentProfile] = useState(null)
    useEffect(() => {
        const getStudentProfile = async () => {
            const res = await axiosInstance.get(`/studentrecords/profile/${user._id}`)
            setStudentProfile(res.data)
        }
        getStudentProfile()
    }, [])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6">My Student Information</Typography>
                {studentProfile && (
                    <StudentProfileForm profile={studentProfile} user={user} />
                )}
            </Box>
            <CustomBottomBar menu={studentMenu} />
        </Box>
    )
}

export const StudentProfileForm = ({profile, user}) => {
    console.log(profile)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [sections, setSections] = useState([])
    const [archiveStudent, setArchiveStudent] = useState(false)
    const initialAddress = {
        houseNo: profile?.address?.houseNo || '',
        barangay: profile?.address?.barangay ||'',
        city: profile?.address?.city ||'',
        province: profile?.address?.province ||'',
    }
    const initialParents = [
        {
            relationship: 'Father',
            firstName: profile?.parents[0]?.firstName || '',
            middleName: profile?.parents[0]?.middleName ||  '',
            lastName: profile?.parents[0]?.lastName || '',
        },
        {
            relationship: 'Mother',
            firstName: profile?.parents[1]?.firstName || '',
            middleName: profile?.parents[1]?.middleName ||  '',
            lastName: profile?.parents[1]?.lastName || '',
        },
    ]
    const {errors, handleChange, values, handleBlur, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            ...user, 
            guardian: profile?.student_record.guardian || '',
            guardianRelationship: profile?.student_record.guardianRelationship || '', 
            parent_guardian_contact: profile?.student_record.parent_guardian_contact ||  '',
            learning_modality: profile?.student_record.learning_modality || '' ,
            remarks: profile?.student_record.remarks || '',
            studentRecord: profile.student_record,
            address: profile?.address ? profile.address : initialAddress,
            parents: profile?.parents.length > 0 ? profile.parents : initialParents
        },
        onSubmit : async (values) => {
            setLoading(true)
            const res = await axiosInstance.post(`/studentrecords/update_profile`,values)
            setLoading(false)
            if (!res.data.success){
                return setMessage('Something wrong happened. Please try again.')
            }
            return setMessage('Awesome! Account Updated.')
        }
    });
    const getSections = React.useCallback(async() => {
        const {data} = await axiosInstance.get(`/sections`) 
        setSections(data.sections.filter((a) => a.grade_level === values.studentRecord.grade_level.toString()))
    }, [values.studentRecord.grade_level])
    useEffect(() => {
        getSections()
    }, [getSections])
    return (
        <Grid container spacing={2} sx={{p: 2}} component="form" onSubmit={handleSubmit}> 
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress />
            </Backdrop>
            <Snackbar 
                open={Boolean(message)} 
                message={message} 
                autoHideDuration={3000} 
                onClose={() => setMessage('')} 
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => setMessage('')}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                }
            />
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="button">Basic Information</Typography>
                        {profile.student_record.grade_level === "6" ? 
                            !user.archived ? (
                                <Button onClick={() => setArchiveStudent(true)} size="small" color="primary" variant="contained" startIcon={<History />}>Archive Student</Button>
                            ): (
                                <Button onClick={() => setArchiveStudent(true)} size="small" color="primary" variant="contained" startIcon={<History />}>Restore Student Records</Button>
                            ): null}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField 
                            fullWidth
                            size="small"
                            label="Learners Reference Number" 
                            InputProps={{
                                readOnly: true
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            name="studentRecord.lrn"
                            value={values.studentRecord.lrn}
                        />
                    </Grid>                
                    <Grid item sm={8}/>
                    <Grid item xs={12} sm={4}>
                        <TextField 
                            fullWidth
                            size="small"
                            label="First Name" 
                            InputLabelProps={{
                                shrink: true
                            }}
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                        />
                    </Grid>                
                    <Grid item xs={12} sm={4}>
                        <TextField 
                            fullWidth
                            size="small"
                            label="Middle Name" 
                            InputLabelProps={{
                                shrink: true
                            }}
                            name="middleName"
                            value={values.middleName}
                            onChange={handleChange}
                        />
                    </Grid>                
                    <Grid item xs={12} sm={4}>
                        <TextField 
                            fullWidth
                            size="small"
                            label="Last Name" 
                            InputLabelProps={{
                                shrink: true
                            }}
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                        />
                    </Grid> 
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel shrink={true}>Sex</InputLabel>
                            <Select
                                size="small"
                                label="Sex"
                                // name="studentRecord.sex"
                                value={values.studentRecord.sex}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                <MenuItem value={`male`}>Male</MenuItem>
                                <MenuItem value={`female`}>Female</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            required
                            fullWidth
                            size="small"
                            id="date"
                            label="Birthday"
                            type="date"
                            value={new Date(values.studentRecord.bday).toISOString().split('T')[0]}
                            error={errors.bday}
                            helperText={errors.bday}
                            onChange={({target}) => setFieldValue('studentRecord.bday', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>           
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Mother Tongue" size="small" InputLabelProps={{shrink: true}}
                            name="studentRecord.motherTongue"
                            value={values.studentRecord.motherTongue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Grid>    
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel shrink={true}>Grade Level</InputLabel>
                            <Select
                                size="small"
                                value={values.studentRecord.grade_level}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="studentRecord.grade_level"
                                label="Grade Level"
                                // error={errors.studentRecord.grade_level}
                            >
                                {Array.from(new Array(6)).map((el, index) => (
                                    <MenuItem key={index} value={index + 1}>{index + 1}</MenuItem>
                                ))}
                            </Select>
                            {/* {errors.grade_level && (
                                <FormHelperText error>{errors.grade_level}</FormHelperText>
                            )} */}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                            <InputLabel shrink={true}>Section</InputLabel>
                            <Select
                                size="small"
                                value={values.studentRecord.section}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="studentRecord.section"
                                label="Section"
                                // error={errors.studentRecord.grade_level}
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
                            name="studentRecord.section"
                            value={values.studentRecord.section}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.studentRecord.section}
                            // helperText={errors.studentRecord.section}
                        /> */}
                    </Grid>   
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Learning Modality" size="small" InputLabelProps={{shrink: true}}
                            name="learning_modality"
                            value={values.learning_modality}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Grid>   
                    <Grid item xs={12}>
                        <TextField multiline rows={5} fullWidth label="Remarks" size="small" InputLabelProps={{shrink: true}}
                            name="remarks"
                            value={values.remarks}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Grid>   
                    <Grid item xs={12}>
                        <Divider />
                    </Grid> 

                    <Grid item xs={12}>
                        <Typography variant="button">Address Information</Typography>
                    </Grid>  
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="House #/Street/Sitio/Purok"
                            name="address.houseNo"
                            value={values.address.houseNo}
                            onChange={({target}) => setFieldValue('address.houseNo', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Barangay"
                            name="address.barangay"
                            value={values.address.barangay}
                            onChange={({target}) => setFieldValue('address.barangay', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="City/Municipality"
                            name="address.city"
                            value={values.address.city}
                            onChange={({target}) => setFieldValue('address.city', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Province"
                            name="address.province"
                            value={values.address.province}
                            onChange={({target}) => setFieldValue('address.province', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>       
                    <Grid item xs={12}>
                        <Typography variant="button">Parent Information</Typography>
                    </Grid>  
                    <Grid item xs={12}>
                        <Typography variant="caption">Father's Name</Typography>
                    </Grid>  
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="First Name"
                            value={values.parents[0].firstName}
                            onChange={({target}) => setFieldValue('parents[0].firstName', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Middle Name"
                            value={values.parents[0].middleName}
                            onChange={({target}) => setFieldValue('parents[0].middleName', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Last Name"
                            value={values.parents[0].lastName}
                            onChange={({target}) => setFieldValue('parents[0].lastName', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12}>
                        <Typography variant="caption">Mother's Maiden Name</Typography>
                    </Grid>  
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="First Name"
                            value={values.parents[1].firstName}
                            onChange={({target}) => setFieldValue('parents[1].firstName', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Middle Name"
                            value={values.parents[1].middleName}
                            onChange={({target}) => setFieldValue('parents[1].middleName', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Last Name"
                            value={values.parents[1].lastName}
                            onChange={({target}) => setFieldValue('parents[1].lastName', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12}>
                        <Typography variant="caption">Guardian(if not parent)</Typography>
                    </Grid>  
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Name"
                            value={values.guardian}
                            onChange={({target}) => setFieldValue('guardian', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Relationship"
                            value={values.guardianRelationship}
                            onChange={({target}) => setFieldValue('guardianRelationship', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                    <Grid item xs={12}>
                        <Typography variant="caption">Guardian(if not parent)</Typography>
                    </Grid> 
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Contact Number of Parent/Guardian"
                            value={values.parent_guardian_contact}
                            onChange={({target}) => setFieldValue('parent_guardian_contact', target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>  
                     
                    <Grid item xs={6}>
                        <Button type="submit" variant="contained" size="small" color="primary"
                            startIcon={<Save />}
                        >
                            Save Changes
                        </Button> 
                    </Grid> 
                    {archiveStudent && (
                        <ArchiveStudentDialog open={archiveStudent} onClose={() => setArchiveStudent(false)} student={values} refresh={getSections}/>
                    )}               
                </Grid>
    )

}

const ArchiveStudentDialog = ({open, onClose, student, }) => {
    const [confirm, setConfirm] = useState('')
    const handleConfirm = async () =>{
        const {data} = await axiosInstance.put(`/users/archive/${student._id}`, {archived: !student.archived})
        console.log(data)
        window.location.reload(false)
        onClose()
    }
    return (
        <Dialog maxWidth="md" open={open} onClose={onClose}>
            <DialogTitle>Archive Student Records</DialogTitle>
            <DialogContent>
                <Typography variant="body2">
                    Are you sure you want to {student.archived ? `restore`: `archive`} this student's records?
                </Typography>
                <Typography variant="caption" color="GrayText">
                    Type in <i>{student.archived ? `restore records`: `archive student`}</i> to confirm this action. 
                </Typography>
                <TextField value={confirm} onChange={({target}) => setConfirm(target.value)} sx={{mt: 2}} placeholder={student.archived ? 'restore records' : 'archive student'} size="small" fullWidth/>
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="outlined" color="primary" onClick={onClose}>Cancel</Button>
                {student.archived ? (
                    <Button size="small" variant="contained" color="primary" disabled={confirm !== 'restore records'} 
                    onClick={handleConfirm} 
                    >Confirm</Button>
                ):(
                    <Button size="small" variant="contained" color="primary" disabled={confirm !== 'archive student'} 
                    onClick={handleConfirm} 
                    >Confirm</Button>
                ) }
            </DialogActions>
        </Dialog>
    )
}

export default Profile
