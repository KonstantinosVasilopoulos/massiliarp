import React, { FC, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie/es6'
import { BACKEND_URL } from '../App'

// Components
import Navbar from './Navbar'

interface Props {
    cookies: Cookies
    setIsAuthenticated: Function
}

interface Building {
    name: string
    construction_cost: number
    number_built: number
    settings?: number
}

interface ProfitableBuilding extends Building {
    building_income: number
}

interface MaintainableBuilding extends Building {
    building_maintenance: number
}

const Buildings: FC<Props> = ({ cookies, setIsAuthenticated }) => {
    // State
    const [buildings, setBuildings] = useState<Building[]>([])
    const [name, setName] = useState('')
    const [cost, setCost] = useState<number>()
    const [isProfitable, setIsProfitable] = useState(true)  // false => new Building is maintainable
    const [talents, setTalents] = useState<number>()

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
        },
        withCredentials: true,
    }

    useEffect(() => {
        downloadBuildings()
    }, [])

    const instanceOfProfitable = (object:any): object is Building => ('building_income' in object)
    
    const downloadBuildings = () => {
        // Download the existing buildings
        // Profitable buildings first
        axios.get<ProfitableBuilding[]>(BACKEND_URL + '/api/profitable-building/', axiosConfig)
        .then(response => response.data)
        .then((data: ProfitableBuilding[]) => {
            // Maintainanble buildings
            axios.get<MaintainableBuilding[]>(BACKEND_URL + '/api/maintainable-building/', axiosConfig)
            .then(response => {
                setBuildings([...data, ...response.data])
            })
        })
    }

    // Type: true => profitable building, false => maintainnable building
    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>, buildingName: string, type: boolean) => {
        event.preventDefault()

        const value = parseInt(event.target.value, 10)
        if (value >= 0) {
            // Change the item's value
            const buildingsCopy = [...buildings]  // Shallow copy
            let building = buildings.find(b => buildingName === b.name)
            if (building !== undefined) {
                building.number_built = Math.abs(parseInt(event.target.value, 10))
                setBuildings(buildingsCopy)

                // Send new data to the backend server
                // Profitable building
                if (type) {
                    axios.put(BACKEND_URL + '/api/profitable-building/' + buildingName + '/', building as ProfitableBuilding, axiosConfig)
                } else {  // Maintainnanble building
                    axios.put(BACKEND_URL + '/api/maintainable-building/' + buildingName + '/', building as MaintainableBuilding, axiosConfig)
                }
            }
        }
    }

    const handleNewBuildingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // Check input validity
        if (name !== '' && cost !== undefined && talents !== undefined) {
            // Check whether the build exists already
            const names =  buildings.map(b => b.name)
            const exists = names.includes(name)

            // Create appropriate building
            if (isProfitable) {
                const newBuilding: ProfitableBuilding = {
                    name: name,
                    construction_cost: cost,
                    number_built: 0,
                    building_income: talents,
                    settings: 1
                }

                if (exists) {
                    axios.put(BACKEND_URL + '/api/profitable-building/' + name + '/', newBuilding, axiosConfig)

                    // Replace the building already present in the buildings array with its newer version
                    const index = names.indexOf(name)
                    const buildingsCopy = [...buildings]
                    buildingsCopy.splice(index, 1, newBuilding)
                    setBuildings(buildingsCopy)
                    
                } else {
                    axios.post(BACKEND_URL + '/api/profitable-building/', newBuilding, axiosConfig)
                    setBuildings([...buildings, newBuilding])
                }
            } else {
                const newBuilding: MaintainableBuilding = {
                    name: name,
                    construction_cost: cost,
                    number_built: 0,
                    building_maintenance: talents,
                    settings: 1
                }

                if (exists) {
                    axios.put(BACKEND_URL + '/api/maintainable-building/' + name + '/', newBuilding, axiosConfig)

                    // Same as the above 'exists' section
                    const index = names.indexOf(name)
                    const buildingsCopy = [...buildings]
                    buildingsCopy.splice(index, 1, newBuilding)
                    setBuildings(buildingsCopy)

                } else {
                    axios.post(BACKEND_URL + '/api/maintainable-building/', newBuilding, axiosConfig)
                    setBuildings([...buildings, newBuilding])
                }
            }

            // Reset input values
            setName('')
            setCost(undefined)
            setIsProfitable(true)
            setTalents(undefined)
        }
    }

    const handleProfitableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsProfitable(event.target.value === 'profitable')
    }

    const handleTalentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
            setTalents(Math.abs(parseFloat(value)))
        }
    }

    return (
        <>
            <Navbar exclude='buildings' cookies={cookies} setIsAuthenticated={setIsAuthenticated} />
            <div className="my-12 w-full h-full flex flex-row flex-wrap-reverse justify-center items-end">
                <div className="mx-6 p-4 flex flex-col justify-between bg-salmon-dark rounded-sm">
                    <h2 className="text-xl text-blue-dark"><u>Buildings</u></h2>
                    {buildings.map(building => (
                        <div className="my-2 flex flex-row flex-wrap justify-between">
                            <h3 className="text-blue-dark">{building.name}</h3>
                            <div className="mx-3 flex flex-col justify-between items-start">
                                <span className="text-md text-gray">Construction cost: {building.construction_cost}</span>
                                {instanceOfProfitable(building) &&
                                    <span className="text-md text-gray">Income: {(building as ProfitableBuilding).building_income} talents</span>
                                }
                                {!instanceOfProfitable(building) &&
                                    <span className="text-md text-gray">Maintenance: {(building as MaintainableBuilding).building_maintenance} talents</span>
                                }
                            </div>
                            <input type="number" value={building.number_built} onChange={e => { handleNumberChange(e, building.name, instanceOfProfitable(building)) }} className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                        </div>
                    ))}
                </div>
                <form className="mx-6 mb-6 p-4 flex flex-col justify-between bg-salmon-dark rounded-sm" onSubmit={e => { handleNewBuildingSubmit(e) }}>
                    <div className="my-2 flex flex-row justify-between">
                        <label className="mr-4" htmlFor="name">Name:</label>
                        <input type="text" id="name" value={name} onChange={e => { setName(e.target.value) }} className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                    </div>
                    <div className="my-2 flex flex-row justify-between">
                        <label className="mr-4" htmlFor="cost">Cost:</label>
                        <input type="number" id="cost" value={cost} onChange={e => { setCost(Math.abs(parseInt(e.target.value, 10))) }} className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                    </div>
                    <div className="my-2 flex flex-row justify-between">
                        <label className="mr-4" htmlFor="profitable">Profit</label>
                        <input type="radio" id="profitable" value="profitable" checked={isProfitable} onChange={e => { handleProfitableChange(e) }} className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                    </div>
                    <div className="my-2 flex flex-row justify-between">
                        <label className="mr-4" htmlFor="maintainable">Maintenance</label>
                        <input type="radio" id="maintainable" value="maintainable" checked={!isProfitable} onChange={e => { handleProfitableChange(e) }} className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                    </div>
                    <div className="my-2 flex flex-row justify-between">
                        <label className="mr-4" htmlFor="talents">Talents:</label>
                        <input type="number" id="talents" value={talents} onChange={e => { handleTalentsChange(e) }} className="p-2 text-right text-blue-dark rounded bg-salmon-light" />
                    </div>
                    <input type="submit" value="Create" className="my-2 px-5 py-2 text-salmon-dark text-2xl rounded bg-blue cursor-pointer hover:opacity-80" />
                </form>
            </div>
        </>
    )
}

export default Buildings
