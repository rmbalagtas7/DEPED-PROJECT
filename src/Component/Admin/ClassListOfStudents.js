import { ChevronRight } from '@mui/icons-material'
import { CssBaseline, Grid, IconButton, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import axiosInstance from '../../library/axios'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer'

function ClassListOfStudents() {
    const {id} = useParams()
    const [classDetails, setClassDetails] = useState(null)
    const [teacher, setTeacher] = useState(null)
    const [students, setStudents] = useState(null)
    const getClassDetails = React.useCallback( async() => {
        const {data} = await axiosInstance.get(`/classes/${id}`)
        console.log(data.class)
        setClassDetails(data.class)
        const t = await axiosInstance.get(`/users/${data.class.teacher._id}`)
        console.log(t.data)
        setTeacher(t.data.user)
        const students = await axiosInstance.get(`/studentrecords?grade_level=${data.class.grade_level}&section=${data.class.section}&school_year=${data.class.school_year}`)
        setStudents(students.data.students)
    }, [])
    useEffect(() => {
        getClassDetails()
    },[getClassDetails])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6" gutterBottom>{classDetails?.className} Class List</Typography>
                <Typography variant="body2" color="GrayText">{classDetails?.start_time} - {classDetails?.end_time} / {teacher?.firstName} {teacher?.lastName}</Typography>
                <Grid container spacing={2}>
                    {
                        students?.map((student, index) => (
                            <Grid item xs={12} key={index}>
                                <StudentList student={student} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
            <CustomBottomBar menu={adminMenu} />
        </Box>
    )
}


const StudentList = ({student}) => {
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
              <ListItemButton component={Link} to={`/student/${student.user._id}`}>
                  <ListItemText 
                    primary={
                        <Typography variant="body2">{student.user.firstName} {student.user.lastName}</Typography>
                    } 
                    secondary={
                        <Typography variant="caption" color="GrayText">
                            {student.lrn} / {student.sex.toUpperCase()} / Grade {student.grade_level} - {student.section}
                        </Typography>
                    } 
                  />
              </ListItemButton>
        </ListItem>
    )
}

export default ClassListOfStudents