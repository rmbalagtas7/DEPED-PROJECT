import { Add, CloudDownload } from '@mui/icons-material'
import { Button, Card, CardActionArea, CardContent, CardMedia, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../library/axios'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer'
import * as Yup from 'yup';
import { fetchFromStorage } from '../../library/utilities/Storage'
import { useFormik } from 'formik'
import { formatDistanceToNowStrict } from 'date-fns'
import {useDropzone} from 'react-dropzone'
import { makeStyles } from '@mui/styles'
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { capitalize } from 'lodash-es'
import { Link } from 'react-router-dom'
import { AnnouncementCard } from './Dashboard'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };
  
function Announcements() {
    const user = fetchFromStorage('user')
    const [announcements, setAnnouncements] = useState([])
    const [newAnnouncement, setNewAnnouncement] = useState(false)

    const getAnnouncements = useCallback(async() => {
        const {data} = await axiosInstance.get(`/announcements?school=${user.school}`)
        setAnnouncements(data.announcements)
    }, [])

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
                {newAnnouncement && (
                    <AnnouncementDialog 
                        open={newAnnouncement} 
                        onClose={() => setNewAnnouncement(false)} 
                        onChange={getAnnouncements}
                    />
                )}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h6" gutterBottom>Manage Announcements</Typography>
                    <Button variant="contained" size="small" color="primary" startIcon={<Add />} onClick={() => setNewAnnouncement(true)}>Add Announcement</Button>
                </div>
                    <Grid container spacing={2} style={{marginTop: 2}}>
                        {announcements.length < 1 && (
                            <Grid item xs={12}>
                                <Typography variant="body2">There are no announcements here. Try adding one.</Typography>
                            </Grid>
                        )}
                        {announcements?.map((ann, index) => (
                            <AnnouncementCard item={ann} key={index}/>
                        ))}
                    </Grid>
            </Box>
            <CustomBottomBar menu={adminMenu} />
        </Box>
    )
}


// export const AnnouncementCard = ({announcement}) => {
//     const [links, setLinks] = useState([])

//     const getLinks = useCallback( async () => {
//         const mediaLinks = await Promise.all(
//             announcement.media.map(async (a) => {
//                 const {data} = await axiosInstance.get(`/announcements/image?path=${a}`)
//                 return data.link
//             }
//         ));
//         setLinks(mediaLinks)
//     }, [announcement.media])

//     useEffect(() => {
//         getLinks()
//     }, [getLinks])
//     const [activeStep, setActiveStep] = React.useState(0);
//     const handleStepChange = (step) => {
//         setActiveStep(step);
//     };
//     return (
//         <CardActionArea>
//             <Card elevation={5} sx={{borderRadius: 2}}>
//                 {links.length > 0 && (
//                     <CardMedia>
//                         <AutoPlaySwipeableViews
//                             axis="x"
//                             index={activeStep}
//                             onChangeIndex={handleStepChange}
//                             enableMouseEvents
//                         >
//                             {links.map((l,index) => (
//                                 <img src={l} alt={index} style={{width: '100%', height: 'auto'}} />
//                             ))}
//                         </AutoPlaySwipeableViews>
//                     </CardMedia>
//                 )}
//                 <CardContent>
//                     <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//                         {capitalize(announcement.audience)} Announcement
//                     </Typography>
//                     <Typography variant="h5" component="div">
//                         {announcement.title}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                         {formatDistanceToNowStrict(new Date(announcement.date_created), { addSuffix: true })}
//                     </Typography>
//                     <Typography sx={{marginTop: 2}} variant="body2">
//                         {announcement.description}
//                     </Typography>
//                 </CardContent>
//             </Card>
//         </CardActionArea>
//     )
// }

const AnnouncementDialog = ({open, onClose, onChange}) => {
    const user = fetchFromStorage('user')
    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
        maxFiles: 3,
        accept: 'image/*',
        onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
        }
    });
    const {errors, handleChange, values, handleBlur, handleSubmit, isSubmitting} = useFormik({
        initialValues: {
            school: user.school,
            title: '', 
            description: '',
            author: user._id,
            audience: 'student'
        }, 
        validationSchema: Yup.object({
            title: Yup.string()
                .required('What is the announcement about?'),
            description: Yup.string()
                .required('Tell us something about the announcement')
        }), 
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            setSubmitting(true)
            const {data} =  await axiosInstance.post(`/announcements`, values)
            console.log(`og_announcement`, data.announcement)
            const announcement_id = data.announcement._id
            const form = new FormData()
            form.append('media', files[0])
            form.append('media', files[1])
            form.append('media', files[2])
            const response = await axiosInstance.post(`/announcements/${announcement_id}`, form)
            console.log(`updated_announcement`, response.data.announcement)
            setSubmitting(false)
            onChange()
            onClose()
        }
    })
    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
          <div style={thumbInner}>
            <img
                alt={file.lastModified}
                src={file.preview}
                style={img}
            />
          </div>
        </div>
      ));
    return(
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth component="form" onSubmit={handleSubmit}>
            <DialogTitle>New Announcement</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <TextField 
                            style={{marginTop: 10}}
                            required
                            fullWidth 
                            label="Title" 
                            size="small" 
                            InputLabelProps={{shrink: true}}
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(errors.title)}
                            helperText={errors.title}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <div style={{minHeight: 120, border: 'dashed 1px #8aa1b1', padding: 10, textAlign: 'center'}}>
                            <section >
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Typography variant="body2" color="GrayText">
                                        Drag 'n' drop some files here, or click to select files
                                    </Typography>
                                    <CloudDownload style={{fontSize: 50, color: '#8aa1b1'}} />
                                </div>
                            </section>
                            <aside style={thumbsContainer}>
                                {thumbs}
                            </aside>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            required
                            multiline
                            rows={5}
                            fullWidth 
                            label="Description" 
                            size="small" 
                            InputLabelProps={{shrink: true}}
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(errors.description)}
                            helperText={errors.description}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel shrink={true}>Audience</InputLabel>
                            <Select
                                size="small"
                                value={values.audience}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="audience"
                                label="Audience"
                                error={Boolean(errors.audience)}
                            >
                                <MenuItem value={'teacher'}>For Teacher</MenuItem>
                                <MenuItem value={'student'}>For Students</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" size="small" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <Button variant="contained" color="primary" size="small" type="submit" disabled={isSubmitting}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Announcements
