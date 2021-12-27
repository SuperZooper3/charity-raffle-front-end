import { Connect } from './Connect';
import { Stack } from '@mui/material';

export const Header = () => {
    return (
        <div className="header">
            <Stack spacing={2} direction="row-reverse">
                <Connect />
            </Stack>
        </div>
    );
};
