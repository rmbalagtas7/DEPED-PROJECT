import { Card, CardActionArea, CardHeader, CssBaseline, Grid, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { studentMenu } from '../layout/CustomDrawer'

function Classes() {
    const user = fetchFromStorage('user')
    const student_record = fetchFromStorage('student_record')
    const [classes, setClasses] = useState([])
    const getClasses = useCallback(async() => {
        const res = await axiosInstance.get(`/classes?grade_level=${student_record.grade_level}&section=${student_record.section}&school=${user.school}`)
        setClasses(res.data.classes)
    },[user.school])

    useEffect(() =>{
        getClasses()
    }, [getClasses])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6">My Classes</Typography>
                <Grid container spacing={2} sx={{mt: 2}}>
                    {classes?.map((c, index) => (
                        <Grid key={index} item xs={12} sm={6}>
                            <ClassCard c={c} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <CustomBottomBar menu={studentMenu} />
        </Box>
    )
}

export const ClassCard = ({c}) => {

    return (
        <CardActionArea component={Link} to={`/myclass/${c._id}`}>
            <Card sx={{borderRadius: 2, height: 'auto', padding: 1}} elevation={5}>
                <CardHeader 
                    title={
                        <Typography variant="h6">
                            {c.className}
                        </Typography>
                    } 
                    subheader={
                        <Typography variant="caption" color="GrayText">
                            Mr./Ms. {c.teacher_info.firstName} {c.teacher_info.lastName}
                        </Typography>
                    }/>
                    <Typography variant="subtitle2" sx={{ml: 2}} gutterBottom>Time: {c.start_time} - {c.end_time}</Typography>
            </Card>
        </CardActionArea>
    )
}

export default Classes
