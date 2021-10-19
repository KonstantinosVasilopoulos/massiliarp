import React, { FC, useState, useEffect } from 'react'
    import Cookies from 'universal-cookie/es6'
import { BalanceSheet } from './Home'

// Components
import BalanceSheetPresenter from './BalanceSheetPresenter'

interface Props {
    sheets: BalanceSheet[]
    cookies: Cookies
}

type SheetsDictionary = {
    [section: number]: BalanceSheet[]
}

const History: FC<Props> = ({ sheets, cookies }) => {
    //State
    const [allSheets, setAllSheets] = useState<SheetsDictionary>({})
    const [displaySheets, setDisplaySheets] = useState<BalanceSheet[]>([])
    const [current, setCurrent] = useState(0)
    const [max, setMax] = useState(0)
    const [display, setDisplay] = useState(false)
    const [cursor, setCursor] = useState('pointer')
    const chunk = useState(1)[0]

    useEffect(() => {
        // Initialize the sheets to be displayed
        let sheetsDict: SheetsDictionary = {}
        let section = 0
        if (sheets.length > chunk) {
            for (let i = 0; i < sheets.length; i += chunk) {
                sheetsDict[section++] = sheets.slice(i, i + chunk)
            }
        } else {
            sheetsDict[section++] = [...sheets]
        }

        setAllSheets(sheetsDict)
        setDisplaySheets(sheetsDict[0])
        setMax(section - 1)
    }, [])

    const displayHistory = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        setDisplay(true)
        setCursor('default')
    }

    const handlePreviousClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        if (current > 0) {
            const previousSection = current - 1
            setDisplaySheets(allSheets[previousSection])
            setCurrent(previousSection)
        }
    }

    const handleNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        if (current < max) {
            const nextSection = current + 1
            setDisplaySheets(allSheets[nextSection])
            setCurrent(nextSection)
        }
    }

    return (
        <div className="bg-blue" style={{ 'cursor': cursor }} onClick={e => { displayHistory(e) }}>
            <h1>History</h1>
            {display &&
            <>
                {displaySheets.length === 0 &&
                <div>
                    No sheets present
                </div>}
                {displaySheets.map(sheet => (
                    <div className="my-4">
                        <BalanceSheetPresenter sheet={sheet} cookies={cookies} />
                    </div>
                ))}
                <div className="flex flex-row">
                    <button onClick={e => { handlePreviousClick(e) }}>Previous</button>
                    <button onClick={e => { handleNextClick(e) }}>Next</button>
                </div>
            </>}
        </div>
    )
}

export default History
