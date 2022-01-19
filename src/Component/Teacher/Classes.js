import { Add, Close, CloudDownload, Delete, FilePresent } from '@mui/icons-material'
import { Avatar, Button, Card, CardActionArea, CardContent, CssBaseline, Grid, IconButton, ListItem, ListItemAvatar, ListItemText, SwipeableDrawer, TextField, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useHistory, useParams } from 'react-router'
import axiosInstance from '../../library/axios'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { facultyMenu } from '../layout/CustomDrawer'
import { formatBytes, getFullName, getStudentFullName } from '../utils/functions'

function Classes() {
    const {id} = useParams()
    const {push} = useHistory()
    const [currentClass, setCurrentClass] = useState(null)
    const [students, setStudents] = useState(null)
    const [newModule, setNewModule] = useState(false)
    const [modules, setModules] = useState([])
    const [studentPageSize, studentSetPageSize] = React.useState(10);
    const getCurrentClass = useCallback(async () => {
        const {data} = await axiosInstance.get(`/classes/${id}`)
        setCurrentClass(data.class)
        const students = await axiosInstance.get(`/studentrecords?grade_level=${data.class.grade_level}&section=${data.class.section}&school_year=${data.class.school_year}`)
        setStudents(students.data.students)
        const {data: raw_modules} = await axiosInstance.get(`/modules?class=${id}`)
        setModules(raw_modules.modules)
    }, [id])
    useEffect(() => {
        getCurrentClass()
    }, [getCurrentClass])

    const handleDownload = async (path) => {
        const {data} = await axiosInstance.get(`/modules/download?path=${path}`)
        console.log(data.link)
        window.open(data.link, '_blank')
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <Typography variant="h6">{currentClass?.className}</Typography>
                        <Typography variant="caption" color="GrayText">
                            Grade {currentClass?.grade_level} - {currentClass?.section} / {currentClass?.start_time} - {currentClass?.end_time} 
                        </Typography>
                    </div>
                    <Button 
                        disabled={Boolean(!currentClass)}
                        size="small" 
                        color="primary" 
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setNewModule(true)}
                    >
                        Add Module
                    </Button>
                    {newModule && (
                        <NewModuleDrawer 
                            open={newModule} 
                            onClose={() => setNewModule(false)} 
                            currentclass={currentClass}
                            onChange={getCurrentClass}
                        />
                    )}
                </div>
                <Grid container spacing={2} sx={{mt: 2}}>
                    <Grid item xs={12} container spacing={1}>
                        <Grid item xs={12}>
                        <Typography variant="h6">Students</Typography>
                        </Grid>
                        {students && (
                            <DataGrid rows={students} 
                                autoHeight 
                                rowHeight={35}
                                getRowId={(row) => row._id}
                                components={{
                                    Toolbar: GridToolbar,
                                }}
                                columns={[
                                    { 
                                        field: 'user.firstName', 
                                        headerName: 'Student',
                                        flex: 1,
                                        minWidth: 250,
                                        renderCell: cell => {
                                            return (
                                                <Typography variant="body2" color="black" >{cell.row.user.firstName} {cell.row.user.lastName}</Typography>
                                            )
                                        }
                                    },
                                ]}
                                rowsPerPageOptions={[5, 10, 20]}
                                pagination
                                pageSize={studentPageSize}
                                onPageSizeChange={(newPageSize) => studentSetPageSize(newPageSize)}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} container spacing={1}>
                        <Typography variant="h6">Modules</Typography>
                        {modules.length < 1 && (
                            <Grid item xs={12}>
                                <Typography variant="body2"> There are no modules here.</Typography>
                                <Typography variant="caption"> Add one by clicking on Add Module.</Typography>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            {modules && (
                                <DataGrid rows={modules} 
                                    autoHeight 
                                    rowHeight={35}
                                    disableSelectionOnClick
                                    getRowId={(row) => row._id}
                                    components={{
                                        Toolbar: GridToolbar,
                                    }}
                                    columns={[
                                        { 
                                            field: 'title', 
                                            headerName: 'Title',
                                            flex: 1,
                                            minWidth: 250,
                                            renderCell: cell => {
                                                return (
                                                    <Typography variant="body2" color="black" >{cell.value}</Typography>
                                                )
                                            }
                                        },
                                        { 
                                            field: 'originalname', 
                                            headerName: 'File Name',
                                            flex: 1,
                                            minWidth: 250,
                                            renderCell: cell => {
                                                return (
                                                    <Typography variant="body2" color="black" >{cell.value}</Typography>
                                                )
                                            }
                                        },
                                        { 
                                            field: 'size', 
                                            headerName: 'Size',
                                            width: 100,
                                            renderCell: cell => {
                                                return (
                                                    <Typography variant="body2" color="black" >{formatBytes(cell.value)}</Typography>
                                                )
                                            }
                                        },
                                        { 
                                            field: 'location', 
                                            headerName: 'Action',
                                            flex: 1,
                                            minWidth: 250,
                                            renderCell: cell => {
                                                return (
                                                    <Button size="small" variant="contained" onClick={() => handleDownload(cell.value)}>Download</Button>
                                                )
                                            }
                                        },
                                    ]}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    pagination
                                    pageSize={studentPageSize}
                                    onPageSizeChange={(newPageSize) => studentSetPageSize(newPageSize)}
                                />
                            )}
                        </Grid>

                    </Grid>
                </Grid>
            </Box>
            <CustomBottomBar menu={facultyMenu} />
        </Box>
    )
}

const ModuleCard = ({module}) => {
    return (
        <Grid item xs={12}>
            <Card elevation={5} sx={{borderRadius: 2}}>
                <CardContent>
                    <Typography variant="h6">{module.title}</Typography>
                    <Typography variant="caption">{module?.originalname}</Typography><br />
                    <Typography variant="caption">{module?.size}</Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

const StudentCard = ({student}) => {
    return (
        <CardActionArea>
            <Card elevation={5} sx={{borderRadius: 2}}>
                <CardContent>
                    <Typography variant="body1">
                        {student.user.firstName} {student.user.lastName}
                    </Typography>
                </CardContent>
            </Card>
        </CardActionArea>
    )
}

const NewModuleDrawer = ({open, onClose, onChange, currentclass}) => {
    const maxFiles = 1
    const [title, setTitle] = useState('')
    const [file, setFile] = useState(null)
    const [fileError, setFileError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {getRootProps, getInputProps} = useDropzone({
        maxFiles,
        accept: 'image/*,.pdf,.doc,.docx,.pptx,.ppt',
        onDrop: (acceptedFiles, rejectedFiles) => {
            if(rejectedFiles.length > 0) {
                return setFileError(true)
            }
            setFile(acceptedFiles[0])
            console.log('accepted => ',acceptedFiles)
            console.log('rejected =>', rejectedFiles)
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        if (!title) return 
        if (!file) return 
        const form = new FormData()
        form.append('module', file)
        form.append('class', currentclass._id)
        form.append('title', title)
        const {data} = await axiosInstance.post(`/modules`, form)
        console.log(data)
        onChange()
        onClose()
    }
    return (
        <SwipeableDrawer open={open} onClose={onClose} anchor="right" onOpen={() => console.log(1)}>
            <Toolbar />
            <Box sx={{maxWidth: 500, width: 500, padding: 2}}>
                Add Module for {currentclass.className}
                <Grid container spacing={2} component="form" sx={{mt: 2}} onSubmit={handleSubmit}>
                    <Grid item xs={12}>
                        <TextField 
                            autoFocus
                            required
                            fullWidth 
                            size="small" 
                            label="Title" 
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {!file ? (
                            <section style={{minHeight: 120, 
                                    border: fileError ? 'dashed 1px red' : 'dashed 1px #8aa1b1', padding: 10, textAlign: 'center'}}>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <input {...getInputProps()} />
                                    <Typography variant="body2" color="GrayText">
                                        Drag 'n' drop some files here, or click to select files <br />
                                        <em>(Only images, .doc, .docx, .pdf, .pptx, .ppt files will be accepted)</em>
                                    </Typography>
                                    <CloudDownload style={{fontSize: 50, color: '#8aa1b1'}} />          
                                    {fileError && (
                                        <Typography variant="subtitle2" color="red">
                                            Please upload only {maxFiles} file/s.
                                        </Typography>
                                    )}                      
                                </div>
                            </section>
                            ): (
                                <ListItem 
                                    secondaryAction={
                                        <IconButton size="small" onClick={() => setFile(null)}>
                                            <Delete fontSize="small"/>
                                        </IconButton>
                                    }>
                                    <ListItemAvatar>
                                        <Avatar style={{height: 30, width: 30}}>
                                            <FilePresent fontSize="small" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={file.name} />
                                </ListItem>
                            )}
                    </Grid>
                    <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Button size="small" color="primary" variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button size="small" color="primary" variant="contained" disabled={!file || isSubmitting } type="submit">
                            Save Module
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </SwipeableDrawer>
    )
}
export default Classes
