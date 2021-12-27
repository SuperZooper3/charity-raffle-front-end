import { useContractFunction } from "@usedapp/core"
import { Contract } from "@ethersproject/contracts";
import CharityRaffle from "../chain-info/contracts/CharityRaffle.json";
import Stack from '@mui/material/Stack';
import { Button, TextField, Alert, LinearProgress} from "@mui/material";
import { useState } from "react";


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

    const { abi } = CharityRaffle;
    const RaffleContract = new Contract(CharityRaffleAddress, abi)
    const { state: createState , send: createSend, events: createEvents} = useContractFunction(RaffleContract, "CreateRaffle", {transactionName: "Create Raffle"})

    const useCreateRaffle = () => {
        const ticketPriceWei = BigInt(ticketPrice* 10**18) 
        createSend(raffleName, ticketPriceWei, raffleLenght)
    }
    const rawCreatedId = createEvents?.filter(event => event.name === "RaffleCreated")[0].args["raffleId"] ?? undefined
    const createdId = Number(rawCreatedId)
    return (
        <Stack spacing={3}>
            <TextField id="raffle-name" label="Raffle Name" type="text" onChange={handleRaffleName} InputLabelProps={{ shrink: true,}}/>
            <TextField id="ticket-price" label="Ticket Price (ETH)" type="number" onChange={handleTicketPrice} InputLabelProps={{ shrink: true,}}/>
            <TextField id="raffle-length" label="Raffle Length (seconds)" type="number" onChange={handleRaffleLenght} InputLabelProps={{ shrink: true,}}/>
            {createState.status === "Mining" ? (<LinearProgress/>):
            <Button color="primary" variant="contained" disabled={raffleName === "" || ticketPrice === 0 || raffleLenght === 0 } onClick={useCreateRaffle} >Create Raffle!</Button>}
            {createState.status === "Mining" ? (<Alert severity="info">Mining...</Alert>) : null}
            {createState.status === "Success" ? (<Alert severity="success">Raffle Created! ID: {createdId}</Alert>) : null}
            {createState.status === "Fail" ? (<Alert severity="error">{createState.errorMessage}</Alert>) : null}
            </Stack>
    )
}