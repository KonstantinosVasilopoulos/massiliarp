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

interface Unit {
    name: string
    recruitment_cost: number
    upkeep_cost: number
    units_recruited: number
    settings: number
}

interface ArmyUnit extends Unit {
    raised: boolean
}

interface NavyUnit extends Unit {

}

const Units: FC<Props> = ({ cookies, setIsAuthenticated }) => {
    // State
    const [army, setArmy] = useState<ArmyUnit[]>([])
    const [navy, setNavy] = useState<NavyUnit[]>([])

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
        },
        withCredentials: true,
    }

    // Get the army units
    useEffect(() => {
        axios.get<ArmyUnit[]>(BACKEND_URL + '/api/army-unit', axiosConfig)
        .then(response => {
            setArmy(response.data)
        })
    }, [])


    // Get the navy's ships
    useEffect(() => {
        axios.get<NavyUnit[]>(BACKEND_URL + '/api/navy-unit', axiosConfig)
        .then(response => {
            setNavy(response.data)
        })
    }, [])

    const isResponseOk = (response: any) => {
        if (response.status < 200 && response.status > 299) {
            throw Error(response.statusText)
        }
        return true
    }

    const handleRaisedChange = (event: React.MouseEvent<HTMLInputElement>, unit: ArmyUnit) => {
        unit.raised = !unit.raised

        // Make a shallow copy of the army list
        let armyCopy = [...army]

        // Find the relevant unit
        let unitCopy = armyCopy.find(u => u.name === unit.name)
        if (unitCopy !== undefined) {
            // Alter the unit
            const index = armyCopy.indexOf(unitCopy)
            unitCopy.raised = unit.raised
            armyCopy[index] = unitCopy
            setArmy(armyCopy)
        }
        
        // Put data to backend server
        axios.put(BACKEND_URL + '/api/army-unit/' + unit.name + '/', unit, axiosConfig)
        .then(resp => isResponseOk(resp))
    }

    const onArmyUnitBtnClick = (event: React.MouseEvent<HTMLImageElement>, unit: ArmyUnit, isAddition: boolean) => {
        event.preventDefault()

        // Make a shallow copy of the army list
        let armyCopy = [...army]

        // Find the relevant unit
        let unitCopy = armyCopy.find(u => u.name === unit.name)
        if (unitCopy !== undefined) {
            // Alter the unit
            const index = armyCopy.indexOf(unitCopy)
            unitCopy.units_recruited += isAddition ? 1 : -1
            armyCopy[index] = unitCopy
            setArmy(armyCopy)
        }

        // Inform the backend server about the changes
        axios.put(BACKEND_URL + '/api/army-unit/' + unit.name + '/', unit, axiosConfig)
        .then(resp => isResponseOk(resp))
    }

    const onNavyUnitBtnClick = (event: React.MouseEvent<HTMLImageElement>, unit: NavyUnit, isAddition: boolean) => {
        event.preventDefault()

        // Same process as the for the army
        // Check the function above
        let navyCopy = [...navy]
        let unitCopy = navyCopy.find(u => u.name === unit.name)
        if (unitCopy !== undefined) {
            const index = navyCopy.indexOf(unitCopy)
            unitCopy.units_recruited += isAddition ? 1 : -1
            navyCopy[index] = unitCopy
            setNavy(navyCopy)
        }

        axios.put(BACKEND_URL + '/api/navy-unit/' + unit.name + '/', unit, axiosConfig)
        .then(resp => isResponseOk(resp))
    }

    const onArmyUnitNumberChange = (event: React.ChangeEvent<HTMLInputElement>, unit: ArmyUnit) => {
        event.preventDefault()

        // Make sure the given value can be safely parsed to number
        const newValue = event.target.value
        if (typeof newValue === 'string' && !isNaN(Number(newValue)) && newValue !== '') {
            unit.units_recruited = parseInt(newValue)

            // Shallow copy
            let armyCopy = [...army]

            // Find the unit in question
            let unitCopy = armyCopy.find(u => u.name === unit.name)
            if (unitCopy !== undefined) {
                const index = armyCopy.indexOf(unitCopy)
                unitCopy.units_recruited = unit.units_recruited
                armyCopy[index] = unitCopy
                setArmy(armyCopy)

                axios.put(BACKEND_URL + '/api/army-unit/' + unitCopy.name + '/', unitCopy, axiosConfig)
                .then(resp => isResponseOk(resp))
            }
        }
    }

    const onNavyUnitNumberChange = (event: React.ChangeEvent<HTMLInputElement>, unit: NavyUnit) => {
        event.preventDefault()

        // Make sure the given value can be safely parsed to number
        const newValue = event.target.value
        if (typeof newValue === 'string' && !isNaN(Number(newValue)) && newValue !== '') {
            unit.units_recruited = parseInt(newValue)

            // Shallow copy
            let navyCopy = [...navy]

            // Find the unit in question
            let unitCopy = navyCopy.find(u => u.name === unit.name)
            if (unitCopy !== undefined) {
                const index = navyCopy.indexOf(unitCopy)
                unitCopy.units_recruited = unit.units_recruited
                navyCopy[index] = unitCopy
                setNavy(navyCopy)

                axios.put(BACKEND_URL + '/api/navy-unit/' + unitCopy.name + '/', unitCopy, axiosConfig)
                .then(resp => isResponseOk(resp))
            }
        }
    }

    return (
        <>
            <Navbar initSettings={['home', 'buildings', 'population']} cookies={cookies} setIsAuthenticated={setIsAuthenticated} />
            <div className="flex flex-wrap justify-around">
                {/* Army units */}
                <div className="flex flex-col">
                    <h1><u>Army</u></h1>
                    {army.map((unit: ArmyUnit) => (
                        <div key={unit.name} className="flex flex-wrap">
                            <input type="checkbox" className="cursor-pointer" defaultChecked={unit.raised} onClick={e => {handleRaisedChange(e, unit)}} />
                            <h2>{unit.name}</h2>
                            <div>
                                price: {Math.ceil(unit.recruitment_cost * unit.units_recruited)} <br />
                                upkeep: {unit.raised ? Math.ceil(unit.upkeep_cost * unit.units_recruited) : 0}
                            </div>
                            <img src={process.env.PUBLIC_URL + '/static/minus.ico'} alt="minus icon" onClick={e => { onArmyUnitBtnClick(e, unit, false) }} className="cursor-pointer unit-number-icon" />
                            <input type="text" value={unit.units_recruited} placeholder={unit.units_recruited.toString()} onChange={e => {onArmyUnitNumberChange(e, unit)}} />
                            <img src={process.env.PUBLIC_URL + '/static/plus.ico'} alt="plus icon" onClick={e => { onArmyUnitBtnClick(e, unit, true)} } className="cursor-pointer unit-number-icon" />
                        </div>
                    ))}
                </div>
                {/* Navy units */}
                <div className="flex flex-col">
                    <h1>Navy</h1>
                    {navy.map((unit: NavyUnit) => (
                        <div key={unit.name} className="flex flex-wrap">
                            <h2>{unit.name}</h2>
                            <div>
                                price: {Math.ceil(unit.recruitment_cost * unit.units_recruited)} <br />
                                upkeep: {Math.ceil(unit.upkeep_cost * unit.units_recruited)}
                            </div>
                            <img src={process.env.PUBLIC_URL + '/static/minus.ico'} alt="minus icon" onClick={e => { onNavyUnitBtnClick(e, unit, false) }} className="cursor-pointer unit-number-icon" />
                            <input type="text" value={unit.units_recruited} placeholder={unit.units_recruited.toString()} onChange={e => { onNavyUnitNumberChange(e, unit) }} />
                            <img src={process.env.PUBLIC_URL + '/static/plus.ico'} alt="plus icon" onClick={e => { onNavyUnitBtnClick(e, unit, true) }} className="cursor-pointer unit-number-icon" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Units
