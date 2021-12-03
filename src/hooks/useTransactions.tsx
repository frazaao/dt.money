import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { api } from "../services/api";

interface Transaction{
    id: number,
    title: string,    
    amount: number,
    type: string,
    category: string,
    createdAt: string,   
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionProviderProps{
    children: ReactNode;
}

interface TransactionContextData{
    transactions: Transaction[],
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextData>(
    {} as TransactionContextData // To force typescript to recognize transactionContextData as a initial void object
);

export function TransactionProvider({children}: TransactionProviderProps){
    const [ transactions, setTransations ] = useState<Transaction[]>([]);    

    useEffect(() =>{
        api.get("/transactions")
        .then(response => setTransations(response.data.transactions))
    },[])

    async function createTransaction(transactionInput: TransactionInput){
        const response = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date(),
        })
        const { transaction } = response.data;

        setTransations([...transactions,transaction]);
    }

    return (
        <TransactionContext.Provider value={{transactions, createTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}

export function useTransactions(){
    const context = useContext(TransactionContext)

    return context;
}