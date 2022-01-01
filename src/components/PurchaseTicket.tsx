import { useContractCall, useContractFunction, useEthers} from "@usedapp/core"
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers"
import CharityRaffle from "../chain-info/contracts/CharityRaffle.json";
import Stack from '@mui/material/Stack';
import { Button, TextField, Alert } from "@mui/material";
import { useState } from "react";


export interface PurchaseTicketProps {
    id: number;
    CharityRaffleAddress: string;
}

export const PurchaseTicket = ({id, CharityRaffleAddress}: PurchaseTicketProps) => {
    const { account } = useEthers()
    const { abi } = CharityRaffle;
    const RaffleInterface = new utils.Interface( abi )
    const [,rawStartTime,rawEndTime,, ticketPrice] = useContractCall(
        {
            abi: RaffleInterface,
            address: CharityRaffleAddress,
            method: "GetRaffleTicketInfo",
            args: [id]
        }
        ) ?? []
    const [,, winner,,] = useContractCall(
            {
                abi: RaffleInterface,
                address: CharityRaffleAddress,
                method: "GetRaffleInfo",
                args: [id]
            }
            ) ?? []
    const [expirationPeriod] = useContractCall(
            {
                abi: RaffleInterface,
                address: CharityRaffleAddress,
                method: "expirationPeriod",
                args: []
            }
            ) ?? []
    const [rawTicketBalance] = useContractCall(
                {
                    abi: RaffleInterface,
                    address: CharityRaffleAddress,
                    method: "GetRaffleBalance",
                    args: [id, account]
                }
                ) ?? []
    const ticketPriceEth = Number(ticketPrice) ? Number(ticketPrice) * 10**-18 : 0
    const [purchaseTicketCount, setPurchaseTicketCount] = useState<number>(0)
    const handleTCInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {setPurchaseTicketCount(event.target.value === "" ? 0 : Number(event.target.value))};
    const startTime = Number(rawStartTime) * 1000
    const endTime = Number(rawEndTime) * 1000
    const expirationDate = new Date((Number(rawEndTime) + Number(expirationPeriod)) * 1000)
    const ticketBalance = Number(rawTicketBalance) ?? 0

    const RaffleContract = new Contract(CharityRaffleAddress, abi)
    const { state: purchaseState , send: purchaseSend } = useContractFunction(RaffleContract, "BuyTickets", {transactionName: "Purchase Tickets"})
    const { state: refundState , send: refundSend } = useContractFunction(RaffleContract, "TicketRefund", {transactionName: "Ticket Refund"})
    
    const sendValue = Math.ceil((purchaseTicketCount * Number(ticketPriceEth) * 10**18))
    // Ticket purchase logic
    const PurchaseTickets = () => {
        purchaseSend(id, BigInt(purchaseTicketCount), {value: BigInt(sendValue)})
    }

    const ClaimRefund = () => {
        refundSend(id)
    }

    return (
        <div>
            {Number(startTime) < Date.now() && Number(endTime) > Date.now() - 10 ? 
            (
                <div>
                    <Alert severity="success">Raffle is OPEN!</Alert> <br></br>
                    <Stack spacing={2} direction="row">
                        <TextField id="purchase-ticket-count" label="Ticket Purchase" type="number" onChange={handleTCInputChange} InputLabelProps={{ shrink: true,}}/>
                        <p className="center-text">The price of {purchaseTicketCount} tickets is {Number(String(sendValue*10**-18).substring(0,4))} ETH.</p>
                        <Button color="primary" variant="contained" disabled={purchaseTicketCount<= 0} onClick={PurchaseTickets}>Purchase {purchaseTicketCount} tickets!</Button>
                        {purchaseState.status === "Mining" ? <Alert severity="info">Purchase in progress...</Alert> : null}
                        {purchaseState.status === "Success" ? <Alert severity="success">Purchase successful!</Alert> : null}
                        {purchaseState.status === "Fail" ? <Alert severity="error">Purchase failed!</Alert> : null}
                        {purchaseState.status === "Exception" ? <Alert severity="error">{purchaseState.errorMessage}</Alert> : null}
                    </Stack>
                </div>
            ) : (
                <Alert severity="error">Raffle is not open for ticket buying.</Alert>
                
            )}
            {Number(expirationDate) < Date.now() && ticketBalance > 0 && winner === "0x0000000000000000000000000000000000000000"? (
                <Stack spacing={2} direction="row">
                    <Alert severity="info">Eligible for ticket refund on expired raffle!</Alert>
                    <Button color="primary" variant="contained" onClick={ClaimRefund}>Refund tickets!</Button>
                    {refundState.status === "Mining" ? <Alert severity="info">Refund in progress...</Alert> : null}
                    {refundState.status === "Success" ? <Alert severity="success">Refund successful!</Alert> : null}
                    {refundState.status === "Fail" ? <Alert severity="error">Refund failed!</Alert> : null}
                </Stack>
            ) : null}
        </div>
    )
}
