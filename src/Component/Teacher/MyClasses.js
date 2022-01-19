import { CssBaseline, Grid, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { facultyMenu } from '../layout/CustomDrawer'
import { ClassCard } from './Dashboard'

function MyClasses() {

    const user = fetchFromStorage('user')
    const [classes, setClasses] = useState([])
    const getClasses = useCallback(async () => {
        const {data} = await axiosInstance.get(`/classes?teacher=${user._id}`)
        setClasses(data.classes)
    }, [user._id])
    useEffect(() => {
        getClasses()
    },[getClasses])

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Grid container spacing={2} sx={{p: 2}}>
                    <Grid item xs={12} md={6} lg={6}>
                        <Typography variant="h6">My Classes</Typography>
                        <Box sx={{pt: 2, pb:2, width: '100%'}}>
                            {classes?.map((c, index) => (
                                <ClassCard c={c} key={index} />
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <CustomBottomBar menu={facultyMenu} />
        </Box>
    )
}

export default MyClasses
