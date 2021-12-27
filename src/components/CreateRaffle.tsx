import { useContractCall, useContractFunction, useEthers, useTokenBalance, useNotifications} from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Contract } from "@ethersproject/contracts";
import { utils, constants} from "ethers"
import CharityRaffle from "../chain-info/contracts/CharityRaffle.json";
import Stack from '@mui/material/Stack';
import { Button, TextField, Alert, LinearProgress} from "@mui/material";
import { useEffect, useState } from "react";


export interface CreateRaffleProps {
    CharityRaffleAddress: string;
}

export const CreateRaffle = ({CharityRaffleAddress}: CreateRaffleProps) => {
    const [raffleName, setRaffleName] = useState<string>("")
    const handleRaffleName = (event: React.ChangeEvent<HTMLInputElement>) => {setRaffleName(event.target.value === "" ? "" : String(event.target.value))};
    const [ticketPrice, setTicketPrice] = useState<number>(0)
    const handleTicketPrice = (event: React.ChangeEvent<HTMLInputElement>) => {setTicketPrice(event.target.value === "" ? 0 : Number(event.target.value))};
    const [raffleLenght, setRaffleLenght] = useState<number>(0)
    const handleRaffleLenght = (event: React.ChangeEvent<HTMLInputElement>) => {setRaffleLenght(event.target.value === "" ? 0 : Number(event.target.value))};
    console.log(raffleName, ticketPrice, raffleLenght)

    const { abi } = CharityRaffle;
    const RaffleContract = new Contract(CharityRaffleAddress, abi)
    const { state: createState , send: createSend } = useContractFunction(RaffleContract, "CreateRaffle", {transactionName: "Create Raffle"})

    const useCreateRaffle = () => {
        const ticketPriceWei = BigInt(ticketPrice* 10**18) 
        console.log("Send", createSend(raffleName, ticketPriceWei, BigInt(raffleLenght) ))
    }
    console.log(createState)

    const isMining = createState.status === "Mining" ?? false

    return (
        <Stack spacing={3}>
            <TextField id="raffle-name" label="Raffle Name" type="text" onChange={handleRaffleName} InputLabelProps={{ shrink: true,}}/>
            <TextField id="ticket-price" label="Ticket Price (ETH)" type="number" onChange={handleTicketPrice} InputLabelProps={{ shrink: true,}}/>
            <TextField id="raffle-length" label="Raffle Length (seconds)" type="number" onChange={handleRaffleLenght} InputLabelProps={{ shrink: true,}}/>
            {isMining? (<LinearProgress/>):
            <Button color="primary" variant="contained" disabled={raffleName == "" || ticketPrice == 0 || raffleLenght == 0 } onClick={useCreateRaffle} >Create Raffle!</Button>}
            {isMining ? (<Alert severity="info">Mining...</Alert>) : null}
            </Stack>
    )
}