import { FC, useState } from 'react'

// Components
import Navbar from './Navbar'

interface Props {
    csrf: string
}

const Home:FC<Props> = ({ csrf }) => {
    // State
    const [balanceSheets, setBalanceSheets] = useState<string[]>([])

    return (
        <>
            <Navbar initSettings={['units', 'buidlings', 'population']} csrf={csrf} />
        </>
    )
}

export default Home
