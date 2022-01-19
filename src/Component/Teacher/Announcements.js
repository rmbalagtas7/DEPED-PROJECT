import { CssBaseline, Grid, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomDrawer from '../layout/CustomDrawer'
import { AnnouncementCard } from './Dashboard'

function Announcements() {
    const [announcements, setAnnouncements] = useState([])
    const user = fetchFromStorage('user')
    const getAnnouncements = useCallback(async () => {
        const {data: a } = await axiosInstance.get(`/announcements?school=${user.school}&audience=teacher`)
        setAnnouncements(a.announcements)       
    }, [user._id])
    useEffect(() => {
        getAnnouncements()
    },[getAnnouncements])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <Typography variant="h6">Announcements</Typography>
                    </div>
                </div>
                <Grid container spacing={2} sx={{p:2}}>
                    {announcements?.slice(0,5).map((item, index) => (
                        <AnnouncementCard key={index} item={item} />
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}

export default Announcements
