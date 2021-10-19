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
    const [width, setWidth] = useState('33%')
    const [cursor, setCursor] = useState('pointer')
    const [color, setColor] = useState('#65739a')  // Blue default
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
        setWidth('100%')  // Full width
        setCursor('default')
        setColor('#e5dec2')
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
        <div className="mt-12 mb-3 rounded-sm transition-all duration-1000 ease-in-out" style={{ 'width': width, 'cursor': cursor, 'backgroundColor': color }} onClick={e => { displayHistory(e) }}>
            <h1 className="w-1/4 ml-5 md:ml-1.5 p-2 text-salmon-dark text-2xl text-center font-bold bg-blue rounded-sm">History</h1>
            {display &&
            <>
                {displaySheets.length === 0 &&
                <div className="text-xl text-salmon-dark font-bold bg-blue rounded-sm">
                    No sheets present
                </div>}
                {displaySheets.map(sheet => (
                    <div className="my-4">
                        <BalanceSheetPresenter sheet={sheet} cookies={cookies} />
                    </div>
                ))}
                <div className="flex flex-row justify-between w-full">
                    <button className="mx-3 px-3 py-2 text-salmon-dark text-lg bg-blue rounded hover:opacity-80" onClick={e => { handlePreviousClick(e) }}>&lsaquo; Previous</button>
                    <button className="mx-3 px-3 py-2 text-salmon-dark text-lg bg-blue rounded hover:opacity-80" onClick={e => { handleNextClick(e) }}>Next &rsaquo;</button>
                </div>
            </>}
        </div>
    )
}

export default History
