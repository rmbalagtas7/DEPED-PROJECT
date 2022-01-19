
import { CssBaseline, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { AuthenticatedAppBar } from '../layout/CustomAppBar';
import CustomBottomBar from '../layout/CustomBottomBar';
import CustomDrawer, { superadminMenu } from '../layout/CustomDrawer';

function Dashboard() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6">Good day.</Typography>
            </Box>
            <CustomBottomBar menu={superadminMenu} />
            </Box>
    )
}

export default Dashboard
