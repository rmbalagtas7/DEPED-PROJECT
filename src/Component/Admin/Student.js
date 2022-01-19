import { CssBaseline, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axiosInstance from '../../library/axios'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer'
import { StudentProfileForm } from '../Student/Profile'

function Student() {
    const {id} = useParams()

    const [studentProfile, setStudentProfile] = useState(null)
    const [user, setUser] = useState(null)
    useEffect(() => {
        const getStudentProfile = async () => {
            const res = await axiosInstance.get(`/studentrecords/profile/${id}`)
            console.log(res.data)
            setStudentProfile(res.data)
            const {accountId} = res.data.student_record
            const {data} = await axiosInstance.get(`/users/${accountId}`)
            setUser(data.user)
        }
        getStudentProfile()
    }, [id])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6">Student Information</Typography>
                {(studentProfile && user) &&(
                    <StudentProfileForm profile={studentProfile} user={user} />
                )}
            </Box>
            <CustomBottomBar menu={adminMenu} />
        </Box>
    )
}

export default Student
