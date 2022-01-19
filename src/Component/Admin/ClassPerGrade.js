import { Add } from '@mui/icons-material'
import { Button, Card, CardActionArea, CardMedia, CssBaseline, Dialog, DialogActions, DialogContent, Grid, TextField, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import axiosInstance from '../../library/axios'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer'

export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  
function ClassPerGrade() {
    let query = useQuery();
    const grade = query.get('level')
    const [sections, setSections] = useState([])
    const [newSection, setNewSection] = useState(false)
    const getSection = React.useCallback(
        async () => {
            const {data} = await axiosInstance.get(`/sections/${grade}`)
            console.log(data)
            setSections(data.sections)
        },
        [grade],
    )

    useEffect(() => {
        getSection()
    }, [getSection])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {newSection && (
                    <NewSectionDialog grade={grade} open={newSection} onClose={() => setNewSection(false)} onChange={getSection} />
                )}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h6" gutterBottom>Manage Grade {query.get('level')} Sections</Typography>
                    <Button variant="contained" size="small" color="primary" startIcon={<Add />} onClick={() => setNewSection(true)}>Add a Section</Button>
                </div>
                    <Grid container spacing={2}>
                        {sections.length < 1 && (
                            <Grid item xs={12}>
                                <Typography variant="body2">There are no sections here. Try adding one.</Typography>
                            </Grid>
                        )}
                        {sections?.map((section, index) => (
                            <SectionCard section={section} key={index} />
                        ))}
                    </Grid>
            </Box>
            <CustomBottomBar menu={adminMenu} />
        </Box>
    )
}

const SectionCard = ({section}) => {

    return (
        <Grid item xs={12} sm={6} md={4}>
            <CardActionArea sx={{borderRadius: 2}} component={Link} to={`/admin/section?grade=${section.grade_level}&name=${section.section}`}>
                <Card elevation={16} sx={{ display: 'flex', borderRadius: 2}}>
                    <Typography variant="h6" sx={{width: '80%', padding: 2}}>Section {section.section}</Typography>
                    <CardMedia
                        component="img"
                        width="10"
                        height="150"
                        image="/Images/class.png"
                        alt={section.section}
                    />
                </Card>
            </CardActionArea>
        </Grid>
    )
}
const NewSectionDialog = ({grade, open, onClose, onChange}) => {

    const [sectionName, setSectionName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (sectionName === '') return
        const body = {
            grade_level: grade, 
            section: sectionName
        }
        const {data} = await axiosInstance.post(`/sections`, body)
        console.log(data)
        onChange()
        onClose()
    }
    return (
        <Dialog maxWidth="sm" component="form" onSubmit={handleSubmit} fullWidth open={open} onClose={onClose}>
            <DialogContent>
                <Typography variant="body2" gutterBottom sx={{p: 1}}>Create a new section in Grade {grade}</Typography>
                <TextField label="Section Name" size="small" fullWidth value={sectionName} onChange={({target}) => setSectionName(target.value)} />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>Cancel</Button>
                <Button variant="contained" type="submit">Save</Button>
            </DialogActions>
        </Dialog>
    )
}
export default ClassPerGrade
 