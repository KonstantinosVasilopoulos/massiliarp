import React, { FC, useState, useEffect } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../App'

// Components
import Navbar from './Navbar'

interface Props {
    csrf: string
    logout: Function
}

interface Unit {
    name: string
    recruitment_cost: number
    upkeep_cost: number
    units_recruited: number
    settings?: number
}

interface ArmyUnit extends Unit {
    raised: boolean
}

interface NavyUnit extends Unit {

}

const Units: FC<Props> = ({ csrf, logout }) => {
    // State
    const [army, setArmy] = useState<ArmyUnit[]>([])
    const [navy, setNavy] = useState<NavyUnit[]>([])

    // Get the army units
    useEffect(() => {
        axios.get<ArmyUnit[]>(BACKEND_URL + '/api/army-unit')
            .then(response => {
                setArmy(response.data)
            })
    }, [])


    // Get the navy's ships
    useEffect(() => {
        axios.get<NavyUnit[]>(BACKEND_URL + '/api/navy-unit')
            .then(response => {
                setNavy(response.data)
            })
    }, [])

    const handleRaisedChange = (event: React.MouseEvent<HTMLInputElement>, unit: ArmyUnit) => {
        unit.raised = !unit.raised
        
        // Post data to backend server
    }

    return (
        <>
            <Navbar initSettings={['home', 'buildings', 'population']} csrf={csrf} logout={() => {logout()}} />
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
                            <img src={process.env.PUBLIC_URL + '/images/minus.ico'} alt="minus icon" className="cursor-pointer unit-number-icon" />
                            <input type="text" value={unit.units_recruited} placeholder={unit.units_recruited + ''} />
                            <img src={process.env.PUBLIC_URL + '/images/plus.ico'} alt="plus icon" className="cursor-pointer unit-number-icon" />
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
                            <img src={process.env.PUBLIC_URL + '/images/minus.ico'} alt="minus icon" className="cursor-pointer unit-number-icon" />
                            <input type="text" value={unit.units_recruited} placeholder={unit.units_recruited + ''} />
                            <img src={process.env.PUBLIC_URL + '/images/plus.ico'} alt="plus icon" className="cursor-pointer unit-number-icon" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Units
