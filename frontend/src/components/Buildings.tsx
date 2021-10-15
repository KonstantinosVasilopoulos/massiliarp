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
            <div className="flex flex-wrap-reverse">
                <div className="flex flex-col">
                    <h2><u>Buildings</u></h2>
                    {buildings.map(building => (
                        <div className="flex flex-row flex-wrap">
                            <h3>{building.name}</h3>
                            <span>Construction cost: {building.construction_cost}</span>
                            { instanceOfProfitable(building) &&
                                <span>Income: {(building as ProfitableBuilding).building_income} talents</span>
                            }
                            { !instanceOfProfitable(building) &&
                                <span>Maintenance: {(building as MaintainableBuilding).building_maintenance} talents</span>
                            }
                            <input type="number" value={building.number_built} onChange={e => { handleNumberChange(e, building.name, instanceOfProfitable(building)) }} />
                        </div>
                    ))}
                </div>
                <form className="flex flex-col" onSubmit={e => { handleNewBuildingSubmit(e) }}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={name} onChange={e => { setName(e.target.value) }} />
                    </div>
                    <div>
                        <label htmlFor="cost">Cost:</label>
                        <input type="number" id="cost" value={cost} onChange={e => { setCost(Math.abs(parseInt(e.target.value, 10))) }} />
                    </div>
                    <div>
                        <label htmlFor="profitable">Profit</label>
                        <input type="radio" id="profitable" value="profitable" checked={isProfitable} onChange={e => { handleProfitableChange(e) }} />
                    </div>
                    <div>
                        <label htmlFor="maintainable">Maintainable</label>
                        <input type="radio" id="maintainable" value="maintainable" checked={!isProfitable} onChange={e => { handleProfitableChange(e) }} />
                    </div>
                    <div>
                        <label htmlFor="talents">Talents:</label>
                        <input type="number" id="talents" value={talents} onChange={e => { handleTalentsChange(e) }} />
                    </div>
                    <input type="submit" value="Create" className="cursor-pointer" />
                </form>
            </div>
        </>
    )
}

export default Buildings
