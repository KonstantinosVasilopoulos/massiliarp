import { FC } from 'react'

interface Props {
  changeYear: Function
  closePopup: Function
}

const EndYearPopup: FC<Props> = ({ changeYear, closePopup }) => (
  <div id="popup-box">
    <div id="popup" className="bg-blue">
      <h1>Are you sure you want to progress to the next year?</h1>
      <div className="flex-flex-row">
        <button onClick={e => { changeYear(e) }}>Yes</button>
        <button onClick={e => { closePopup(e) }}>No</button>
      </div>
    </div>
  </div>
)

export default EndYearPopup
