import { FC, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie/es6'
import { BACKEND_URL } from '../App'

// Components
import Navbar from './Navbar'
import BalanceSheetPresenter from './BalanceSheetPresenter'

interface Props {
    cookies: Cookies
    setIsAuthenticated: Function
}

export interface BalanceSheet {
    year: number
    taxation: number
    trade: number
    polis_tributes: number
    miscellaneous?: number
    army_upkeep?: number
    navy_upkeep?: number
    garrison_upkeep: number
    infrastructure_maintenance?: number
    total_income?: number
    total_expenses?: number
    new_balance?: number
    archived: boolean
    settings?: number
}

const Home:FC<Props> = ({ cookies, setIsAuthenticated }) => {
    // State
    const [latest, setLatest] = useState<BalanceSheet>()

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
        },
        withCredentials: true,
    }

    useEffect(() => {
        // Get the latest balance sheet
        axios.get(BACKEND_URL + '/api/latest-balance-sheet/', axiosConfig)
        .then(response => {
            setLatest(response.data)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <>
            <Navbar exclude={'home'} cookies={cookies} setIsAuthenticated={setIsAuthenticated} />
            {latest !== undefined &&
            <BalanceSheetPresenter sheet={latest} cookies={cookies} />}
        </>
    )
}

export default Home
