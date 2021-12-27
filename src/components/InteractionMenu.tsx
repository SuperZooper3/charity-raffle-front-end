import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { constants } from 'ethers';
import { useEthers } from '@usedapp/core';
import networkMapping from "../chain-info/deployments/map.json"
import Button from '@mui/material/Button';
import { RaffleBasicInfo, RaffleTicketInfo } from './RaffleInfo';
import { PurchaseTicket } from './PurchaseTicket';
import { PureDateInput } from '@mui/lab/internal/pickers/PureDateInput';
import { CreateRaffle } from './CreateRaffle';
import { CollectRaffle } from './CollectRaffle';


export const InteractionMenu = () => {
    const {account, chainId, error} = useEthers();
    const CharityRaffleAddress: string = chainId ? networkMapping[String(chainId)]["CharityRaffle"][0] : constants.AddressZero

    const [tabValue, setTabValue] = React.useState('1');
    const handleTabChange = (event, newValue) => {setTabValue(newValue);};
    const [raffleId, setRaffleId] = useState<number | string | Array<number | string>>(0)
    const handleIdInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {setRaffleId(event.target.value === "" ? "" : Number(event.target.value))};
    return (
        <div className="interaction-menu">
            <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleTabChange} aria-label="Interaction Tab List" centered>
                    <Tab label="Buy Tickets" value="1" />
                    <Tab label="Create Raffle" value="2" />
                    <Tab label="Collect Raffle" value="3" />
                </TabList>
                </Box>
                <TabPanel value="1">
                    <h2>Raffle Info</h2>
                    <TextField id="raffle-id" label="Raffle ID" type="number" value={raffleId} onChange={handleIdInputChange} InputLabelProps={{ shrink: true,}}/>
                    <RaffleBasicInfo id={Number(raffleId)} CharityRaffleAddress={CharityRaffleAddress} />
                    <RaffleTicketInfo id={Number(raffleId)} CharityRaffleAddress={CharityRaffleAddress} />
                    <PurchaseTicket id={Number(raffleId)} CharityRaffleAddress={CharityRaffleAddress} />
                </TabPanel>
                <TabPanel value="2">
                    <h2>Create a Raffle</h2>
                    <CreateRaffle CharityRaffleAddress={CharityRaffleAddress} />
                </TabPanel>
                <TabPanel value="3">
                    <h2>Collect a Raffle</h2>  
                    <TextField id="raffle-id" label="Raffle ID" type="number" value={raffleId} onChange={handleIdInputChange} InputLabelProps={{ shrink: true,}}/>
                    <RaffleBasicInfo id={Number(raffleId)} CharityRaffleAddress={CharityRaffleAddress} />
                    <RaffleTicketInfo id={Number(raffleId)} CharityRaffleAddress={CharityRaffleAddress} />
                    <CollectRaffle id={Number(raffleId)} CharityRaffleAddress={CharityRaffleAddress} />
                </TabPanel>
            </TabContext>
            </Box>
        </div>

    )
}