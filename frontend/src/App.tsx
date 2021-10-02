import { FC, ReactNode } from 'react'

export const BACKEND_URL = 'http://localhost:8000'

type Props = {
  children: ReactNode
}

const App: FC<Props> = ({ children }) => {
  return (
    <>
      {children}
    </>
  )
}

export default App
