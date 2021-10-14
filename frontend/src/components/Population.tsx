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

type CityPopulation = {
    name: string
    population: number
}

const sortFunction = (a: CityPopulation, b: CityPopulation) => {
    if (a.name < b.name)
        return -1
    else if (a.name > b.name)
        return 1
    return 0
}

const Population: FC<Props> = ({ cookies, setIsAuthenticated }) => {
    // State
    const [cityPops, setCityPops] = useState<CityPopulation[]>([])
    const [name, setName] = useState('')
    const [population, setPopulation] = useState<number>()

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
        },
        withCredentials: true,
    }

    useEffect(() => {
        // Get the cities' populations from the backend API
        axios.get<CityPopulation[]>(BACKEND_URL + '/api/city-population/', axiosConfig)
        .then(response => {
            setCityPops(response.data.sort(sortFunction))
        })
    }, [])

    const onPopulationChange = (event: React.ChangeEvent<HTMLInputElement>, cityName: string) => {
        event.preventDefault()

        // Check the validity of the new given input
        const newValue = event.target.value
        if (typeof newValue === 'string' && !isNaN(Number(newValue)) && newValue !== '') {
            // Make a shallow copy of the city pops array
            let popsCopy = [...cityPops]

            // Change the value of the pop in question
            let cityCopy = popsCopy.find(c => c.name === cityName)
            if (cityCopy !== undefined) {
                const index = popsCopy.indexOf(cityCopy)
                cityCopy.population = parseInt(newValue, 10)
                popsCopy[index] = cityCopy
                setCityPops(popsCopy)

                // Let the backend know about the change
                axios.put(BACKEND_URL + '/api/city-population/' + cityName + '/', cityCopy, axiosConfig)
            }
        }
    }

    const onNewCitySubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // Create new CityPopulation object
        const newCity: CityPopulation = {
            name: name,
            population: population !== undefined ? population : 0
        }

        // Send the new data to the server
        const searchCity = cityPops.find(c => c.name === name)
        if (searchCity !== undefined) {
            axios.put(BACKEND_URL + '/api/city-population/' + name + '/', newCity, axiosConfig)
            searchCity.population = population as number
            setCityPops(cityPops)

        } else {
            axios.post(BACKEND_URL + '/api/city-population/', newCity, axiosConfig)
            setCityPops([...cityPops, newCity].sort(sortFunction))
        }

        // Clear the fields
        setName('')
        setPopulation(undefined)
    }

    const onPopChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()

        // Make sure a number was inputted
        const newPop = event.target.value
        if (typeof newPop === 'string' && !isNaN(Number(newPop)) && newPop !== '') {
            setPopulation(parseInt(newPop, 10))
        }
    }

    return (
        <>
            <Navbar exclude={'population'} cookies={cookies} setIsAuthenticated={setIsAuthenticated} />
            <div className="flex flex-row flex-wrap-reverse">
                <div className="flex flex-col">
                    <h1><u>City Population</u></h1>
                    {cityPops.map((city: CityPopulation) => (
                        <div key={city.name} className="flex flex-wrap">
                            <h2>{city.name}</h2>
                            <input type="text" value={city.population} onChange={e => { onPopulationChange(e, city.name) }} />
                        </div>
                    ))}
                </div>
                <form className="flex flex-col" onSubmit={e => onNewCitySubmit(e)}>
                    <h1><u>New City</u></h1>
                    <div className="felx flex-row flex-wrap">
                        <label htmlFor="name">Name:</label>
                        <input type="text" value={name} id="name" onChange={e => { e.preventDefault(); setName(e.target.value) }} />
                    </div>
                    <div className="felx flex-row flex-wrap">
                        <label htmlFor="population">Population:</label>
                        <input type="number" value={population} id="population" onChange={e => { onPopChange(e) }} />
                    </div>
                    <input type="submit" value="Create" className="cursor-pointer" />
                </form>
            </div>
        </>
    )
}

export default Population
