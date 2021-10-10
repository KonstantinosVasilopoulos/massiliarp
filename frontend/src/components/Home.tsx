import { FC, useState } from 'react'
import Cookies from 'universal-cookie/es6'

// Components
import Navbar from './Navbar'

interface Props {
    cookies: Cookies
    setIsAuthenticated: Function
}

const Home:FC<Props> = ({ cookies, setIsAuthenticated }) => {
    // State
    const [balanceSheets, setBalanceSheets] = useState<string[]>([])

    return (
        <>
            <Navbar initSettings={['units', 'buidlings', 'population']} cookies={cookies} setIsAuthenticated={setIsAuthenticated} />
        </>
    )
}

export default Home
