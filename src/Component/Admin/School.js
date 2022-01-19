import {  CssBaseline,   Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer'
import { SchoolDetails } from '../SuperAdmin/School'

function School() {
    const user = fetchFromStorage('user')
    const [school, setSchool] = useState(null)

    const getSchool = useCallback(
        async () => {
            const {data} = await axiosInstance.get(`/schools/${user.school}`)
            console.log(data)
            setSchool(data.school)
        },
        [user.school],
    )

    useEffect(() => {
        getSchool()
    }, [getSchool])

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6">{`Manage School Information`}</Typography>
                {school && (
                    <SchoolDetails school={school} />
                )}
            </Box>
            <CustomBottomBar menu={adminMenu} />
        </Box>
    )
}

export default School
