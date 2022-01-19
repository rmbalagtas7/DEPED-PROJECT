import { Card, CardActionArea, CardMedia, CssBaseline, Grid, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Link } from 'react-router-dom'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer'

function Schedules() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6" gutterBottom>Manage Classes</Typography>
                    <Grid container spacing={2}>
                    {Array.from(new Array(6)).map((el, index) => (
                        <GradeCard key={index} grade={index + 1} />
                    ))}
                    </Grid>
            </Box>
            <CustomBottomBar menu={adminMenu} />
        </Box>
    )
}

const GradeCard = ({grade}) => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <CardActionArea sx={{borderRadius: 2}} component={Link} to={`/admin/grade?level=${grade}`}>
                <Card elevation={16} sx={{ display: 'flex', borderRadius: 2}}>
                    <Typography variant="h6" sx={{width: '70%', padding: 2}}>Grade {grade}</Typography>
                    <CardMedia
                        component="img"
                        width="50"
                        height="150"
                        image="/Images/class.png"
                        alt={grade}
                    />
                </Card>
            </CardActionArea>
        </Grid>
    )
} 
export default Schedules
