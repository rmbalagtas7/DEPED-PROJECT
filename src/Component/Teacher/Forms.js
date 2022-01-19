import { Add, CloudDownload, Delete, FilePresent, Save } from '@mui/icons-material'
import { Autocomplete, Avatar, Button, CircularProgress, CssBaseline, FormControl, Grid, IconButton, InputLabel, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, SwipeableDrawer, TextField, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { facultyMenu } from '../layout/CustomDrawer'
import { schoolForms } from '../utils/constants'
import { formatBytes, isForStudent } from '../utils/functions'

function Forms() {
    const [newFormModal, setNewFormModal] = useState(false)
    const [forms, setForms] = useState([])
    const [pageSize, setPageSize] = React.useState(10);
    const getForms = useCallback( async() => {
        const user = fetchFromStorage('user')
        const {data} = await axiosInstance(`/forms/user/${user._id}`)
        console.log(data)
        setForms(data.forms)
    }, [])

    useEffect(() => {
        getForms()
    }, [getForms])
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
                        <Typography variant="h6">School Forms</Typography>
                        <Typography variant="caption" color="GrayText">Easily manage your school forms here</Typography>
                    </div>
                    <Button size="small" startIcon={<Add />} variant="contained" color="primary" onClick={() => setNewFormModal(true)}>
                        Add Form
                    </Button>
                </div>
                {newFormModal && (
                    <FormDrawer open={newFormModal} onClose={() => setNewFormModal(false)} onChange={getForms} />
                )}
                {forms && (
                    <DataGrid rows={forms} 
                        autoHeight 
                        rowHeight={35}
                        getRowId={(row) => row._id}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        columns={[
                            { 
                                field: 'type', 
                                headerName: 'Form Type',
                                minWidth: 250,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{cell.value}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'original_name', 
                                headerName: 'File',
                                minWidth: 250,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{cell.value}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'title', 
                                headerName: 'Title',
                                minWidth: 200,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{cell.value}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'size', 
                                headerName: 'Size',
                                minWidth: 50,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{formatBytes(cell.value)}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'file', 
                                headerName: 'Action',
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
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    />
                )}
            </Box>
            <CustomBottomBar menu={facultyMenu} />
        </Box>
    )
}

const FormDrawer = ({open, onClose, onChange}) => {

    const [formType, setFormType] = useState(0)
    const [file, setFile] = useState(null)
    const [fileError, setFileError] = useState(null)
    const [title, setTitle] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [students, setStudents] = useState([])
    const [openField, setOpenField] = React.useState(false);
    const [selectedStudent, setSelectedStudent] = useState('')
    const user = fetchFromStorage('user')
    const {getRootProps, getInputProps} = useDropzone({
        maxFiles: 1,
        accept: '.pdf,.doc,.docx,.pptx,.ppt,.xlsx,.xls',
        onDrop: (acceptedFiles, rejectedFiles) => {
            if(rejectedFiles.length > 0) {
                return setFileError(true)
            }
            setFile(acceptedFiles[0])
            console.log('accepted => ',acceptedFiles)
            console.log('rejected =>', rejectedFiles)
        }
    });
    const handleSubmit = async (e) =>{
        e.preventDefault()
        setIsSubmitting(true)
        if (!title) return
        if (!file) return
        const access_allowed = ['admin', user._id]
        const form = new FormData()
        form.append('file', file)
        form.append('type', schoolForms[formType]['name'])
        form.append('title', title)
        form.append('owner', user._id)
        form.append('access_allowed', access_allowed)
        if (isForStudent(formType)){
            form.append('student',selectedStudent)
        }

        const {data} = await axiosInstance.post(`/forms`, form)
        console.log(data)
        onChange()
        onClose()
    }

    const getUsers = React.useCallback(
        async () => {
            const res = await axiosInstance.get(`/users?&school=${user.school}&access_level=3`)
            console.log(res.data)
            setStudents(res.data.users)
        },
    [user.school])

    React.useEffect(() => {
        if (!openField) {
            setStudents([]);
        }else{
            getUsers()
        }
      }, [openField, getUsers]);
    return (
        <SwipeableDrawer open={open} onClose={onClose} anchor="right" onOpen={() => console.log(1)}>
            <Toolbar/>
            <Box sx={{maxWidth: 500, width: 500, padding: 2}}>
                Upload a new School Form
                <Grid container spacing={2} component="form" sx={{mt: 2}} onSubmit={handleSubmit}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel shrink={true}>Form Type</InputLabel>
                            <Select
                                size="small"
                                value={formType}
                                onChange={({target}) => setFormType(target.value)}
                                name="form_type"
                                label="Form Type"
                            >
                                {schoolForms.map((el, index) => (
                                    <MenuItem value={el.value} key={index}>{el.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {isForStudent(formType) && (
                        <Grid item xs={12}>
                            <Autocomplete
                                id="asynchronous-demo"
                                fullWidth
                                size="small"
                                open={openField}
                                onOpen={() => {
                                    setOpenField(true);
                                }}
                                onClose={() => {
                                    setOpenField(false);
                                }}
                                getOptionLabel={(option) => option.firstName + " " + option.lastName}
                                options={students}
                                loading={students.length < 1}
                                onChange={(e, newValue) =>setSelectedStudent(newValue._id)}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="Student"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                        <React.Fragment>
                                            {/* {students.length < 1 ? <CircularProgress color="inherit" size={20} /> : null} */}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                        ),
                                    }}
                                    />
                                )}
                                />
                        </Grid>
                    )}
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
                                        <em>(Only .doc, .docx, .pdf, .pptx, .ppt, .xlsx, .xls files will be accepted)</em>
                                    </Typography>
                                    <CloudDownload style={{fontSize: 50, color: '#8aa1b1'}} />          
                                    {fileError && (
                                        <Typography variant="subtitle2" color="red">
                                            Please upload only 1 file.
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
                        <Button size="small" color="primary" variant="contained" type="submit" startIcon={<Save />}>
                            Save File
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </SwipeableDrawer>
    )
}
export default Forms
