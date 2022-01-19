import {  AccountCircle, Assignment, Book, ExpandMore, Female, Home,  ListAlt,  Male,  Settings } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Avatar, Card, CardActionArea, CardContent, CssBaseline, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react'
import { AuthenticatedAppBar } from '../layout/CustomAppBar';
import CustomDrawer, { facultyMenu } from '../layout/CustomDrawer';
import {fetchFromStorage } from '../../library/utilities/Storage'
import axiosInstance from '../../library/axios'
import CustomBottomBar from '../layout/CustomBottomBar';
import { Link } from 'react-router-dom';
import TotalCard from '../Admin/cards/TotalCard';
import { formatDistanceToNowStrict } from 'date-fns';
import ImageViewer from 'react-simple-image-viewer';

function Dashboard() {
    const yearNow = new Date().getFullYear()
    const user = fetchFromStorage('user')
    const [classes, setClasses] = useState([])
    const [stats, setStats] = useState(null)
    const [announcements, setAnnouncements] = useState([])
    const getClasses = useCallback(async () => {
        const {data} = await axiosInstance.get(`/classes?teacher=${user._id}`)
        setClasses(data.classes)
        const {data: a } = await axiosInstance.get(`/announcements?school=${user.school}&audience=teacher`)
        setAnnouncements(a.announcements)
        const {data: b} = await axiosInstance.get(`/classes/teacherstats/${user._id}`)
        setStats(b)        
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
                <Typography variant="h6">Welcome back, {user.firstName} {user.lastName} </Typography>

                {stats && (
                    <Grid container spacing={2} sx={{marginTop: 1}}>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TotalCard color="#48beff" total={stats?.classes} title={`My Classes`} icon={<Assignment />}/>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TotalCard color="#14453d" total={stats?.students} title={`My Total Students`} icon={<AccountCircle />} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={2}>
                            <TotalCard color="#3e8989" total={stats?.male} title={`Male`} icon={<Male />} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={2}>
                            <TotalCard color="#05f140" total={stats?.female} title={`Female`} icon={<Female />} />
                        </Grid>
                    </Grid>
                )}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
                    <Typography variant="h6" component="h2">Announcements</Typography>
                    <Link to="/faculty/announcements" style={{fontSize: 12, textDecoration: 'none', color: '#ff0000'}}>View All</Link>
                </div>
                <Grid container spacing={2} sx={{p:2}}>
                    {announcements?.slice(0,5).map((item, index) => (
                        <AnnouncementCard key={index} item={item} />
                    ))}
                </Grid>
                <Grid container spacing={2} sx={{p: 2}}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h6">My Classes</Typography>
                        <Box sx={{pt: 2, pb:2, width: '100%'}}>
                            {classes?.slice(0,5).map((c, index) => (
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

export const ClassCard = ({c})=> {

    return (
        <CardActionArea component={Link} to={`/faculty-classes/${c._id}`} sx={{marginY: 2}}>
            <Card elevation={5} sx={{borderRadius: 2}}>
                <CardContent>
                    <Typography variant="h6">
                        {c.className}
                    </Typography>
                    <Typography variant="body2">
                         Grade {c.grade_level} - {c.section}
                    </Typography>
                    <Typography variant="caption" color="GrayText">
                        {c.start_time} - {c.end_time}
                    </Typography>
                </CardContent>
            </Card>
        </CardActionArea>
    )
}

export const AnnouncementCard = ({item}) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [links, setLinks] = useState([])
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
        <Grid item xs={12} sm={3} style={{cursor: 'pointer'}} onClick={() => openImageViewer(0)}>
            <Box style={{background: '#eee', width:'200', height: 200, borderRadius: 10}}>
                <img src={links[0]} alt={links[0]} style={{borderRadius: 10, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left'}} />
            </Box>
            <Typography variant="body2" style={{fontSize: 14, paddingTop: 10, paddingLeft: 3}}>{item.title}</Typography>
            <Typography variant="caption" color="textSecondary" style={{fontSize: 12, paddingLeft: 3}}>
                {formatDistanceToNowStrict(new Date(item.date_created), { addSuffix: true })}
            </Typography>
        </Grid>
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
export default Dashboard
