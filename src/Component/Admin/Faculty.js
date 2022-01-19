import React from 'react'
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage'
import {  Button, CssBaseline,  Switch,  Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { getFullName, returnAccessLevelString } from '../utils/functions'
import { NewUserModal, ProvisionDialog } from '../SuperAdmin/Users'
import CustomBottomBar from '../layout/CustomBottomBar'
import { Add } from '@mui/icons-material'

function Faculty() {
    const user = fetchFromStorage('user')
    const [users, setUsers] = React.useState([])
    const [pageSize, setPageSize] = React.useState(10);
    const [selectedRecord, setSelectedRecord] = React.useState(null)
    const [newFaculty, setNewFaculty] = React.useState(false)
    const [school, setSchool] = React.useState(null)
    const getUsers = React.useCallback(
        async () => {
            const res = await axiosInstance.get(`/users?access_level=2&school=${user.school}`)
            setUsers(res.data.users)
            const {data} = await axiosInstance.get(`/schools/${user.school}`)
            setSchool(data.school)
        },
    [user.school])

    React.useEffect(() => {
        getUsers()
    }, [getUsers])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6" gutterBottom>{`Manage Faculty`}</Typography>
                {
                    selectedRecord && (
                        <ProvisionDialog 
                            id={selectedRecord.id} 
                            user={selectedRecord.row} 
                            open={Boolean(selectedRecord)}
                            onClose={() => setSelectedRecord(null)}
                            onChange={getUsers}
                        />
                    )
                }
                {
                    newFaculty && (
                        <NewUserModal open={newFaculty} onClose={() => setNewFaculty(false)} refreshList={getUsers} schools={[school]} restricted={true}/>
                    )
                }
                <Button size="small" color="primary" startIcon={<Add />} onClick={() => setNewFaculty(true)}>Add Faculty</Button>
                {users && (
                    <DataGrid rows={users.filter(a => a.school === user.school)} 
                            autoHeight 
                            rowHeight={35}
                            getRowId={(row) => row._id}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            columns={[
                                { 
                                    field: 'fullName', 
                                    headerName: 'Full Name',
                                    flex: 1,
                                    minWidth: 250,
                                    valueGetter: getFullName,
                                    sortable: false,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" color="black" sx={{textDecoration: 'none'}}>{cell.value}</Typography>
                                        )
                                    }
                                },
                                { 
                                    field: 'email', 
                                    headerName: 'Email',
                                    flex: 1,
                                    minWidth: 350, 
                                },
                                { 
                                    field: 'provisioned', 
                                    headerName: 'Access Allowed',
                                    width: 150, 
                                    renderCell: (cellValues) => {
                                        return (
                                            <Switch readOnly checked={cellValues.value} onChange={() => setSelectedRecord(cellValues)}/>
                                        )
                                    }
                                },
                                { 
                                    field: 'access_level', 
                                    headerName: 'Access Level',
                                    flex: 1,
                                    minWidth: 250, 
                                    valueGetter: (params) => {
                                        return returnAccessLevelString(params.value)
                                    },
                                },
                            ]}
                            rowsPerPageOptions={[5, 10, 20]}
                            pagination
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        />
                )}
            </Box>
            <CustomBottomBar menu={adminMenu} />

        </Box>
    )
}



export default Faculty
