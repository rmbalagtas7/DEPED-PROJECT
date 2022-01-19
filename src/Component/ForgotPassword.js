import { Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../library/axios'
import { HeroTitle } from './LandingPage'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const handleChange = ({target}) => {
        setError('')
        setEmail(target.value)
    }
    const handleSubmit = async () => {
        if (!email) return setError('Email cannot be empty')
        const {data} = await axiosInstance.post(`/users/forgotpass`, {email})
        if (!data.success) return setError(data.message)
        setSuccess(true)
    }
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh'}}>
            <div style={{width: 500}}>
                {success ? (
                    <HeroTitle title="Check your email" subtitle="We have sent password recovery instructions to your email." />
                ) : (
                    <HeroTitle title="Forgot your password" subtitle="Enter the email address associated with the account and we'll send you a link to reset your password." />
                )}
                { !success && (
                    <>
                        <TextField 
                            error={Boolean(error)}
                            helperText={error ? error : null}
                            fullWidth variant="outlined" size="small" sx={{mt:2}} label="Email" name="email" value={email} onChange={handleChange} />

                        <Button fullWidth variant="contained" color="primary" sx={{mt: 2, mb:5}} onClick={handleSubmit}>Continue</Button>

                        <Typography component={Link} to="/register" variant="caption" style={{textDecoration: 'none'}}>
                            Don't have an account? Sign Up
                        </Typography>
                    </>
                )}
                
            </div>
        </div>
    )
}

export default ForgotPassword
