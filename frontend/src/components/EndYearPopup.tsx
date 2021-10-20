import { FC } from 'react'

interface Props {
  changeYear: Function
  closePopup: Function
}

const EndYearPopup: FC<Props> = ({ changeYear, closePopup }) => (
  <div id="popup-box">
    <div id="popup" className="bg-blue-light">
      <h1 className="my-3 text-lg">Are you sure you want to progress to the next year?</h1>
      <div className="mt-6 flex flex-row justify-between">
        <button onClick={e => { changeYear(e) }} className="px-6 py-3 border border-green-700 text-green-700 rounded hover:border-green-900 hover:text-green-900">Yes</button>
        <button onClick={e => { closePopup(e) }} className="px-6 py-3 border border-red-600 text-red-600 rounded hover:border-red-800 hover:text-red-800">No</button>
      </div>
    </div>
  </div>
)

export default EndYearPopup
