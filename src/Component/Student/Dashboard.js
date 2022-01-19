import { ExpandMore } from '@mui/icons-material';
import { Alert, CssBaseline, Toolbar, Typography, Grid, Card, CardMedia, CardContent,  Button, CardActionArea, Accordion, AccordionSummary, AccordionDetails, AccordionActions } from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react'
import { AuthenticatedAppBar } from '../layout/CustomAppBar';
import CustomBottomBar from '../layout/CustomBottomBar';
import CustomDrawer, { studentMenu } from '../layout/CustomDrawer';
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage';
import { Link } from 'react-router-dom';
import { ClassCard } from './Classes';
import ImageViewer from 'react-simple-image-viewer';
import { formatDistanceToNowStrict } from 'date-fns';

function Dashboard() {
    const yearNow = new Date().getFullYear()
    const user = fetchFromStorage('user')
    const student_record = fetchFromStorage('student_record')
    const [announcements, setAnnouncements] = useState([])
    const [classes, setClasses] = useState([])
    const getAnnouncements = useCallback(async() => {
        const {data} = await axiosInstance.get(`/announcements?school=${user.school}&audience=student`)
        setAnnouncements(data.announcements)
        const res = await axiosInstance.get(`/classes?grade_level=${student_record.grade_level}&section=${student_record.section}&school=${user.school}`)
        setClasses(res.data.classes)
    },[user.school])

    useEffect(() =>{
        getAnnouncements()
    }, [getAnnouncements])

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Alert variant="filled" severity="info" action={
                    <Typography>{yearNow} - {yearNow + 1}</Typography>
                }>
                    Current School Year  
                </Alert>
                <Grid container spacing={2} sx={{p: 2}}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h6" gutterBottom>Announcements</Typography>
                        <Grid container spacing={2}>
                            {announcements?.map((item, index) => (
                                <AnnouncementCard item={item} />
                            ))}
                            
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography variant="h6">My Classes</Typography>
                            <Link to="/student/classes" style={{fontSize: 12}}> View All</Link>
                        </div>
                        <Box sx={{p: 2, width: '100%'}}>
                            {classes?.slice(0, 3).map((c, index) => (
                                <div key={index} style={{marginBottom: 20}}>
                                    <ClassCard c={c}  />
                                </div>
                            ))}
                        </Box>
                    </Grid>
                    
                </Grid>
                <CustomBottomBar menu={studentMenu} />
            </Box>
        </Box>
    )
}

const AnnouncementCard = ({item}) => {
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
            <Box style={{background: '#eee', width:'200', height: 200, borderRadius: 10, border: 'solid 1px #e1e1e1'}} sx={{boxShadow: 5}}>
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

const ClassList = ({c}) => {
    return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        {c.className}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2">
                       Mr./Ms. {c.teacher_info.firstName} {c.teacher_info.lastName}
                    </Typography>
                    <Typography variant="caption" color="GrayText">
                    {c.start_time} - {c.end_time}
                    </Typography>
                </AccordionDetails>
            </Accordion>
    )
}

export default Dashboard
