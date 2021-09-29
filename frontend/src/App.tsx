import { FC, ReactNode } from 'react'

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
