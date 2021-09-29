import { useState } from 'react'

// Components
import Navbar from './Navbar'

const Home = () => {
    // State
    const [balanceSheets, setBalanceSheets] = useState<string[]>([])

    return (
        <>
            <Navbar initSettings={['units', 'population']} />
        </>
    )
}

export default Home
