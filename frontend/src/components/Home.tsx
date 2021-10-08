import { FC, useState } from 'react'

// Components
import Navbar from './Navbar'

interface Props {
    csrf: string
    logout: Function
}

const Home:FC<Props> = ({ csrf, logout }) => {
    // State
    const [balanceSheets, setBalanceSheets] = useState<string[]>([])

    return (
        <>
            <Navbar initSettings={['units', 'buidlings', 'population']} csrf={csrf} logout={() => {logout()}} />
        </>
    )
}

export default Home
