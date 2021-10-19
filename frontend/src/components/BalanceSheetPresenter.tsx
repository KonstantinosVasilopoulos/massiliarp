import { FC, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie/es6'
import { BalanceSheet } from './Home'
import { BACKEND_URL } from '../App'

interface Props {
  sheet: BalanceSheet
  cookies: Cookies
}

interface UniqueEvent {
  name: string
  event_type: string
  talents: number
  year: number
  expired: boolean
  balance_sheet?: number
}

interface NetDifferenceResponse {
  isProfit: boolean
  netDiff: number
}

const BalanceSheetPresenter: FC<Props> = ({ sheet, cookies }) => {
  // State
  const [incomeEvents, setIncomeEvents] = useState<UniqueEvent[]>([])
  const [expensesEvents, setExpensesEvents] = useState<UniqueEvent[]>([])
  const [difference, setDifference] = useState(0)
  const [isProfit, setIsProfit] = useState(true)
  const [net, setNet] = useState(0)

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': cookies.get('csrftoken'),
    },
    withCredentials: true,
  }

  useEffect(() => {
    // Get all the relevant events for this year
    axios.get<UniqueEvent[]>(BACKEND_URL + '/api/years-events/' + sheet.year + '/', axiosConfig)
    .then(response => {
      const events: UniqueEvent[] = response.data
      setIncomeEvents(events.filter(e => (e.event_type === 'I')))
      setExpensesEvents(events.filter(e => (e.event_type === 'E')))
      setDifference((sheet.total_income === undefined ? 0 : sheet.total_income) - (sheet.total_expenses === undefined ? 0 : sheet.total_expenses))
    })

    // Get the net difference of the balance sheet
    axios.get<NetDifferenceResponse>(BACKEND_URL + '/api/net-diff/' + sheet.year + '/', axiosConfig)
    .then(response => {
      const data: NetDifferenceResponse = response.data
      setIsProfit(data.isProfit)
      setNet(data.netDiff)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <div className="flex flex-col p-3">
      <div className="w-full bg-blue">
        {sheet.year} B.C.E.
      </div>
      <div className="flex flex-row flex-wrap">
        <div className="flex flex-col bg-blue">
          <h2 className="text-salmon-dark">Income</h2>
          <ul className="list-disc">
            <li><span>Taxation</span><span>+ {sheet.taxation}</span></li>
            <li><span>Trade</span><span>+ {sheet.trade}</span></li>
            <li><span>Polis Tribute</span><span>+ {sheet.polis_tributes}</span></li>
            {sheet.miscellaneous !== undefined && 
            <li><span>Misc.</span><span>+ {sheet.miscellaneous}</span></li>}
            {incomeEvents.map(income => (
              <li><span>{income.name}</span><span>+ {income.talents}</span></li>
            ))}
            <li><span>Total</span><span>+ {sheet.total_income === undefined ? 0 : sheet.total_income}</span></li>
          </ul>
        </div>
        <div className="flex flex-col bg-blue">
          <h2 className="text-salmon-dark">Expenses</h2>
          <ul className="list-disc">
            <li><span>Army Upkeep</span><span>- {sheet.army_upkeep === undefined ? 0 : sheet.army_upkeep}</span></li>
            <li><span>Navy Upkeep</span><span>- {sheet.navy_upkeep === undefined ? 0 : sheet.navy_upkeep}</span></li>
            <li><span>Garrison Upkeep</span><span>- {sheet.garrison_upkeep}</span></li>
            <li><span>Infrastructure</span><span>- {sheet.infrastructure_maintenance === undefined ? 0 : sheet.infrastructure_maintenance}</span></li>
            {expensesEvents.map(expense => (
              <li><span>{expense.name}</span><span>- {expense.talents}</span></li>
            ))}
            <li><span>Total</span><span>- {sheet.total_expenses ===  undefined ? 0 : sheet.total_expenses}</span></li>
          </ul>
        </div>
      </div>
      {sheet.new_balance !== undefined &&
      <ul className="list-none bg-blue">
        <li><span>New Balance</span><span>{sheet.new_balance >= 0 ? '+' : '-'} {sheet.new_balance}</span></li>
        <li><span>{difference >= 0 ? 'Profit' : 'Deficit'}</span><span>{difference >= 0 ? '+' : '-'} {Math.abs(difference)}</span></li>
        <li><span>{isProfit ? 'Net Profit' : 'Net Deficit'}</span><span>{net}</span></li>
      </ul>}
    </div>
  )
}

export default BalanceSheetPresenter
