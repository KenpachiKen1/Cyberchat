import * as React from 'react'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LoadingBar({progress, loading}){
    if(!loading && progress === 0 ){
        return null;
    }

    return (
        <Box sx={{width: '100%', marginTop: 2}}>
            <LinearProgress variant='determinate' value={progress} />
        </Box>
    )
}