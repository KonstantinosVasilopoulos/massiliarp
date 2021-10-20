import React, { FC, useState, useEffect } from 'react'
import Cookies from 'universal-cookie/es6'
import axios from 'axios'
import { BACKEND_URL } from '../App'

// Components
import Navbar from './Navbar'

interface Props {
    cookies: Cookies
    setIsAuthenticated: Function
}

type UniqueEvent = {
    name: string
    event_type: string
    talents: number
    year: number
    expired: boolean
    balance_sheet: number
}

const Events: FC<Props> =  ({ cookies, setIsAuthenticated }) => {
    // State
    const [events, setEvents] = useState<UniqueEvent[]>([])
    const [displayYear, setDisplayYear] = useState(0)
    const [name, setName] = useState('')
    const [talents, setTalents] = useState<number>()
    const [isIncome, setIsIncome] = useState(true)  // False value indicates an expense
    const [year, setYear] = useState<number>()

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
        },
        withCredentails: true,
    }

    useEffect(() => {
        // Download the events from the backend API
        axios.get<UniqueEvent[]>(BACKEND_URL + '/api/unique-event/', axiosConfig)
        .then(response => {
            setEvents(response.data)

            // Display the latest turn's events
            const years = response.data.map(e => e.year)
            setDisplayYear(Math.max(...years))
        })
    }, [])

    const handleNewEventSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (name !== '' && talents !== undefined && year !== undefined) {
            // Create a new unique event
            const newEvent: UniqueEvent = {
                name: name,
                event_type: isIncome ? 'I' : 'E',
                talents: talents as number,
                year: year as number,
                expired: false,
                balance_sheet: year as number,
            }

            // Find whether the item already exists
            const names = events.map(i => i.name)
            const years = events.map(i => i.balance_sheet)
            // TODO: Find a error-proof way of checking for existing events
            if (names.includes(name) && years.includes(year)) {
                // Put HTTP request
                const index = names.indexOf(name) + 1
                axios.put(BACKEND_URL + '/api/unique-event/' + index + '/', newEvent, axiosConfig)

                // Alter the event already present in the events array
                const eventsCopy = [...events]
                eventsCopy.splice(index - 1, 1, newEvent)
                setEvents(eventsCopy)

            } else {
                axios.post(BACKEND_URL + '/api/unique-event/', newEvent, axiosConfig)
                setEvents([...events, newEvent])
            }

            // Reset input fields
            setName('')
            setTalents(undefined)
            setIsIncome(true)
            setYear(undefined)
        }
    }

    const onTalentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setTalents(Math.abs(parseInt(event.target.value, 10)))
    }

    const onYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()

        // A valid year must be inputted
        const givenYear = parseInt(event.target.value, 10)

        // Get all the years from the balance sheets
        axios.get(BACKEND_URL + '/api/balance-sheet/', axiosConfig)
        .then(response => {
            let years: number[] = []
            response.data.forEach((element: any) => {
                years.push(element.year)
            })

            return years
        })
        .then (years => {
            // Make sure a balance sheet exists for the given year
            if (years.includes(givenYear)) {
                setYear(givenYear)
            }
        })
    }

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsIncome(event.target.value === 'Income')
    }

    return (
        <>
            <Navbar exclude={'events'} cookies={cookies} setIsAuthenticated={setIsAuthenticated} />
            <div className="my-12 w-full h-full flex flex-row flex-wrap-reverse justify-center items-end">
                <div className="mx-6 p-6 flex flex-col justify-between bg-salmon-dark rounded-sm">
                    <h1 className="text-xl text-blue-dark"><u>Events - Turn {displayYear}</u></h1>
                    {events.map(uniqueEvent => {
                        if (uniqueEvent.year === displayYear) {
                            return (
                                <div className="my-2 flex flex-row flex wrap justify-between">
                                    <h2 className="mr-3">{uniqueEvent.name}</h2>
                                    <span>{uniqueEvent.event_type === 'I' ? '+' : '-'}{uniqueEvent.talents}</span>
                                </div>
                            )
                        }
                    })}
                </div>
                <form className="mx-6 mb-6 p-4 flex flex-col justify-between bg-salmon-dark rounded-sm" onSubmit={e => { handleNewEventSubmit(e) }}>
                    <h1 className="text-xl text-blue-dark"><u>New Event</u></h1>
                    <div className="my-2 flex flex-row flex-wrap justify-between">
                        <label className="mr-3" htmlFor="name">Name:</label>
                        <input type="text" id="name" value={name} onChange={e => {
                            e.preventDefault()
                            setName(e.target.value)
                        }} 
                        className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                    </div>
                    <div className="my-2 flex flex-row flex-wrap justify-between">
                        <label className="mr-3" htmlFor="talents">Talents:</label>
                        <input type="number" id="talents" value={talents} onChange={e => { onTalentsChange(e) }} className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                    </div>
                    <div className="my-2 flex flex-row flex-wrap justify-between">
                        <label className="mr-3" htmlFor="year">Year:</label>
                        <input type="number" id="year" value={year} onChange={e => { onYearChange(e) }} className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                    </div>
                    <div className="my-2 flex flex-col align-end">
                        <label className="self-start" htmlFor="type">Type:</label>
                        <div className="flex flex-row justify-between">
                            <label className="ml-8" htmlFor="income">Income</label>
                            <input type="radio" id="income" value="Income" checked={isIncome} onChange={e => handleTypeChange(e)} className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                        </div>
                        <div className="flex flex-row justify-between">
                            <label className="ml-8" htmlFor="expense">Expense</label>
                            <input type="radio" id="expense" value="Expense" checked={!isIncome} onChange={e => handleTypeChange(e)} className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                        </div>
                    </div>
                    <input type="submit" value="Create" className="my-2 px-5 py-2 text-salmon-dark text-2xl rounded bg-blue cursor-pointer hover:opacity-80" />
                </form>
            </div>
        </>
    )
}

export default Events
