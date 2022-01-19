import { AccountCircle, Assignment, Close, Delete, Female, LibraryBooks, Male, MoreVert } from '@mui/icons-material';
import { Button, Card, CardContent, CardHeader, Chip, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { formatDistanceToNowStrict } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react'
import axios from '../../library/axios';
import { AuthenticatedAppBar } from '../layout/CustomAppBar';
import CustomBottomBar from '../layout/CustomBottomBar';
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer';
import TotalCard from './cards/TotalCard';
import ImageViewer from 'react-simple-image-viewer';
import axiosInstance from '../../library/axios';

function Dashboard() {
    const [school, setSchool] = useState(null)
    const user = JSON.parse(sessionStorage.getItem('user'))
    const [announcements, setAnnouncements] = useState([])
    const [schoolStats, setSchoolStats] = useState(null)

    const getSchool = useCallback ( async () => {
        const {data} = await axios.get(`/schools/stats/${user.school}`)
        setSchool(data.school_info)
        setAnnouncements(data.school_announcements)
        setSchoolStats(data.stats)
    },[user.school])
    useEffect(() => {
        getSchool()
    }, [getSchool])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mb: 10 }}>
                <Toolbar />
                <Typography variant="h4">{school?.name}</Typography>
                <Typography variant="caption" color="GrayText" gutterBottom>School ID: {school?.schoolId} / Region {school?.region} - {school?.division}</Typography>
                {schoolStats && (
                    <Grid container spacing={2} sx={{marginTop: 1}}>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TotalCard color="#48beff" total={schoolStats?.students} title={`Total Enrolled Students`} icon={<AccountCircle />}/>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TotalCard color="#14453d" total={schoolStats?.faculty} title={`Total Faculty`} icon={<Assignment />} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={2}>
                            <TotalCard color="#3e8989" total={schoolStats?.male} title={`Male`} icon={<Male />} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={2}>
                            <TotalCard color="#05f140" total={schoolStats?.female} title={`Female`} icon={<Female />} />
                        </Grid>
                    </Grid>
                )}
                <Grid container spacing={2} style={{marginTop: 2}}>
                    <Grid item md={12} lg={8} container spacing={2}>
                        {announcements?.map((announcement, index) => (
                            <AnnouncementCard item={announcement} key={index}/>
                        ))}
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                        <Card elevation={5} sx={{borderRadius: 2}}>
                            <CardHeader 
                                title="No. of Students"
                                titleTypographyProps={{
                                    fontSize: 18, 
                                }}    
                            />
                            <CardContent>
                                {schoolStats?.gradeLevelCounts?.map((grade, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Typography variant="body1">
                                                {grade.students} Students
                                            </Typography>
                                        }
                                        >
                                        <ListItemIcon>
                                            <LibraryBooks />
                                        </ListItemIcon>
                                        <ListItemText primary={`Grade ${grade.grade_level}`} />
                                    </ListItem>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <CustomBottomBar menu={adminMenu} />
        </Box>
    )
}

export const AnnouncementCard = ({item}) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [links, setLinks] = useState([])
    const [remove, setRemove] = useState(false)
    const getLinks = useCallback( async () => {
        const mediaLinks = await Promise.all(
            item.media.map(async (a) => {
                const {data} = await axiosInstance.get(`/announcements/image?path=${a}`)
                return data.link
            }
        ));
        setLinks(mediaLinks)
    }, [item.media])

    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
      }, []);
    
      const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
      };

    useEffect(() => {
        getLinks()
    }, [getLinks])
    console.log(isViewerOpen)
    return (
        <>
        <Grid item xs={12} sm={4} style={{cursor: 'pointer'}}>
            
                    <Box style={{background: '#eee', width:'200', height: 200, borderRadius: 10}} sx={{boxShadow: 5}} onClick={() => openImageViewer(0)}>
                        <img src={links[0]} alt={links[0]} style={{borderRadius: 10, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left'}} />
                    </Box>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                            <Typography variant="body2" style={{fontSize: 14, paddingTop: 10, paddingLeft: 3}}>
                                {item.title}
                            <Chip label={(item.audience).toUpperCase()} size="small" sx={{marginLeft: 2, fontSize: 9, fontWeight: 'bold'}} color={item.audience === "student"? 'info' : 'success'}/>
                            </Typography>
                            <Typography variant="caption" color="textSecondary" style={{fontSize: 12, paddingLeft: 3}}>
                                {formatDistanceToNowStrict(new Date(item.date_created), { addSuffix: true })}
                            </Typography>
                        </div>
                        <IconButton size="small" color="secondary" onClick={() => setRemove(true)}>
                            <Delete fontSize="small" />
                        </IconButton>
                    </div>
        </Grid>
            <RemoveAnnouncement open={remove} onClose={ () => setRemove(false)} id={item._id} />
            {isViewerOpen && (
                <ImageViewer
                    src={links}
                    currentIndex={currentImage}
                    disableScroll={ false }
                    closeOnClickOutside={true}
                    backgroundStyle={{
                        backgroundColor: "rgba(0,0,0,0.7)"
                    }}
                    onClose={closeImageViewer}
                />
            )}
        </>
    )
}

const RemoveAnnouncement = ({id, open, onClose}) => {

    const handleRemove = async () => {
        const {data} = await axiosInstance.delete(`/announcements/${id}`)
        console.log(data)
        onClose()
        window.location.reload()
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to remove this announcement? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="primary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" color="error" onClick={handleRemove}>
                    Remove
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default Dashboard
