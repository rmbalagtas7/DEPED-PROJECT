import { Button, Grid, Paper, TextField, Typography } from '@mui/material'
import React, {useState} from 'react'
import { fetchFromStorage } from '../library/utilities/Storage'
import {Link, useHistory, useLocation} from 'react-router-dom'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import jwt from "jsonwebtoken";

import axios from '../library/axios'
function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function ChangePassword() {
    const {push} = useHistory()
    let query = useQuery();
    const [expired, setExpired] = useState(false)
    const [success, setSuccess] = useState(false)
    const token = query.get('token')
    var decoded = ""
    jwt.verify(token, '@g@p@y7uG0n', function(err, d) {
        // err
        // decoded undefined
        decoded = d
    });
    // const user = fetchFromStorage('user')
    // if (!user) {
    //     push('/')
    // }

    const {values, handleSubmit, handleChange, handleBlur, errors} = useFormik({
        initialValues: {
            old : '',
            new : '',
            confirm: ''
        },
        validationSchema: Yup.object({
            new: Yup.string()
              .required('Please Enter your password')
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
              ),
            confirm: Yup
              .string()
              .required('Passwords must match')
              .oneOf([Yup.ref("new"), null], "Passwords must match")
          }), 
          onSubmit : async (values, {setErrors}) => {
                const {data} = await axios.post(`/users/reset-password/${decoded?.id}`, {
                    new: values.new,                     
                })
                console.log(data)
                if (data.success) {
                    setSuccess(true)
                }
          }
    })
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <Paper>
                <Grid container spacing={2}>
                    {decoded ? (
                        <Grid item xs={12}>
                            {!success ? (
                                <Box component="form" onSubmit={handleSubmit} noValidate sx = {{ mt: 1, padding: 2, width: 500 }}>
                                    <Typography variant="h6">Create a new Password</Typography>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        required fullWidth
                                        label="New Password"
                                        name="new"
                                        type="password"
                                        value={values.new}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.new)}
                                        helperText={errors.new}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        required fullWidth
                                        label="Confirm Password"
                                        name="confirm"
                                        type="password"
                                        value={values.confirm}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.confirm)}
                                        helperText={errors.confirm}
                                    />
                                    <Button type="submit" fullWidth variant="contained" sx= {{mt: 3, mb: 2}}>
                                        Save Password
                                    </Button>
                                </Box>
                            ) : (
                                <Box sx = {{ mt: 1, padding: 2, width: 500 }}>
                                    <Typography variant="h6">Password Changed.</Typography>
                                    <Typography variant="subtitle2" color="GrayText">Please sign in with your newly created password.</Typography>
                                    <Typography variant='body2' component={Link} to="/">Click here to sign in.</Typography>
                                </Box>
                            )}
                        
                    </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <Box  sx = {{ mt: 1, padding: 2, width: 500 }}>
                                <Typography variant="h6">Reset Link Expired</Typography>
                                <Typography variant="caption" color="GrayText">
                                    Your reset password link has expired, because you haven't used it. Reset Password link expires in 30 minutes. If you need another link, click on Reset Password.
                                </Typography>
                                <Button fullWidth variant="contained" color="primary" sx={{mt: 5}} component={Link} to="/forgot-password">
                                    Reset Password
                                </Button>
                            </Box>
                        </Grid>
                    )}
                    
                </Grid>
            </Paper>
        </div>
    )
}

export default ChangePassword
