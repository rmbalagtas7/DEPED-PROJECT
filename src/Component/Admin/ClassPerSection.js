import { Add, ChevronRight, GridView, ViewList } from '@mui/icons-material';
import { Button, Card, CardActionArea, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputLabel, ListItem, ListItemButton, ListItemText, MenuItem, Select, TextField, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../library/axios';
import { AuthenticatedAppBar } from '../layout/CustomAppBar';
import CustomBottomBar from '../layout/CustomBottomBar';
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer';
import { useQuery } from './ClassPerGrade';
import * as Yup from 'yup';
import { fetchFromStorage } from '../../library/utilities/Storage';
import { Link } from 'react-router-dom';

function ClassPerSection() {
    const user = fetchFromStorage('user')
    let query = useQuery();
    const grade = query.get('grade')
    const section = query.get('name')
    const [classes, setClasses] = useState([]) 
    const [newClass, setNewClass] = useState(false)
    const [viewType, setViewType] = useState('Cards')
    const [teachers, setTeachers] = useState([])

    const getTeachers = useCallback(async () => {
        const {data} = await axiosInstance.get(`/users?school=${user.school}&access_level=2`)
        setTeachers(data.users)
    }, [] )

    const getClasses = React.useCallback( async () => {
        const {data} = await axiosInstance.get(`/classes/list/${grade}/${section}`)
        setClasses(data.classes)
    }, [grade, section])

    useEffect(() => {
        getClasses()
        getTeachers()
    }, [getClasses, getTeachers])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {newClass && (
                    <NewClassDialog 
                        open={newClass} 
                        onClose={() => setNewClass(false)} 
                        grade={grade} 
                        section={section} 
                        onChange={getClasses}
                        teachers={teachers}
                    />
                )}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h6" gutterBottom>Manage Grade {grade} Section {section} Classes</Typography>
                    <Button variant="contained" size="small" color="primary" startIcon={<Add />} onClick={() => setNewClass(true)}>Add a Class</Button>
                </div>
                
                <Grid container spacing={2}>
                    {classes.length < 1 && (
                        <Grid item xs={12}>
                            <Typography variant="body2">There are no classes here. Try adding one.</Typography>
                        </Grid>
                    )}
                    {viewType === 'Cards' && classes?.map((c, index) => (
                        <ClassCard key={index} c={c} />
                    ))}
                    {viewType === 'List' && classes?.map((c, index) => (
                        <ClassList key={index} c={c} teachers={teachers}/>
                    ))}
                </Grid>
            </Box>
            <CustomBottomBar menu={adminMenu} />
        </Box>   

    )
}

const ClassList = ({c, teachers}) => {
    const teacher = teachers.filter((a) => a._id === c.teacher)[0]
    return (
        <ListItem
            style={{border: 'solid 1px #eee', marginTop: 10}}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                <ChevronRight />
              </IconButton>
            }
            disablePadding
          >
              <ListItemButton component={Link} to={`/class/${c._id}`}>
                  <ListItemText 
                    primary={c.className} 
                    secondary={
                        <Typography variant="caption" color="GrayText">
                            {teacher?.firstName} {teacher?.lastName} / {c.start_time} - {c.end_time}
                        </Typography>
                    } 
                  />
              </ListItemButton>
        </ListItem>
    )
}


const ClassCard = ({c}) => {
    return (
        <Grid item xs={12} sm={6} >
            <CardActionArea sx={{borderRadius: 2}} component={Link} to={`/class/${c._id}`} >
                <Card elevation={16} sx={{ 
                        display: 'flex', 
                        borderRadius: 2,
                        height: 200, 
                        backgroundImage: `url(/Images/class-bg.jpg)`, 
                        backgroundRepeat: 'no-repeat', 
                        backgroundSize: '320px', 
                        backgroundPosition: 'right center' }}>
                    <Typography variant="h6" sx={{width: '80%', padding: 2}}>{c.className}</Typography>
                    {/* <CardMedia
                        component="img"
                        width="10"
                        height="150"
                        image="/Images/class-bg.jpg"
                        alt={c.className}
                    /> */}
                </Card>
            </CardActionArea>
        </Grid>
    )
}

const NewClassDialog = ({grade, section, open, onClose, onChange, teachers}) => {
    const yearNow = new Date().getFullYear()
    const currentSY = `${yearNow} - ${yearNow + 1}`
    const {errors, handleChange, values, handleBlur, handleSubmit} = useFormik({
        initialValues: {
            grade_level: grade,
            section, 
            className: '',
            teacher: '',
            start_time: '',
            end_time: '',
            school_year: currentSY
        }, 
        validationSchema: Yup.object({
            className: Yup.string()
                .required('For what subject would this class be?'),
            teacher: Yup.string()
                .required('Who will be teaching the class?'),
            start_time: Yup.string(),
            end_time: Yup.string(),
        }), 
        onSubmit: async (values, {resetForm}) => {
            console.log(values)
            const {data} = await axiosInstance.post(`/classes`, values)
            console.log(data)
            resetForm()
            onChange()
            onClose()
        }
    })
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth component="form" onSubmit={handleSubmit}>
            <DialogTitle>New Class Schedule Information</DialogTitle>
            <DialogContent sx={{padding: 2, mt: 2}}>
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <TextField 
                            style={{marginTop: 10}}
                            required
                            fullWidth 
                            label="Class Name e.g. Science, Math, English" 
                            size="small" 
                            InputLabelProps={{shrink: true}}
                            name="className"
                            value={values.className}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(errors.className)}
                            helperText={errors.className}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel shrink={true}>Teacher</InputLabel>
                            <Select
                                size="small"
                                value={values.teacher}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="teacher"
                                label="Teacher"
                                error={Boolean(errors.teacher)}
                            >
                                {teachers?.map((teacher, index) => (
                                    <MenuItem key={index} value={teacher._id}>{teacher.firstName} {teacher.lastName}</MenuItem>
                                ))}
                            </Select>
                            {errors.teacher && (
                                <FormHelperText error>{errors.teacher}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            label="Start Time" 
                            size="small" 
                            InputLabelProps={{shrink: true}}
                            name="start_time"
                            value={values.start_time}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(errors.start_time)}
                            helperText={errors.start_time}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            label="End Time" 
                            size="small" 
                            InputLabelProps={{shrink: true}}
                            name="end_time"
                            value={values.end_time}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(errors.end_time)}
                            helperText={errors.end_time}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="outlined" onClick={onClose}>Cancel</Button>
                <Button size="small" variant="contained" type="submit">Save Class Details</Button>
            </DialogActions>
        </Dialog>
    )
}
export default ClassPerSection
