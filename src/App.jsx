import { useState } from 'react'
import React from 'react'
import NavBar from './components/nav_bar.jsx'
import Manager from './components/manager.jsx'
import Footer from './components/FOOTER.jsx'


function App() {


  return (
    <div>
      <NavBar />
      <main className="min-h-[87vh]">
        <Manager />
      </main>

      <Footer />

    </div>
  )
}

export default App


{/* <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon> --copy the password to clipboard */}


{/* <lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{"width":"25px", "height":"25px"}}>
                                            </lord-icon> --delete */}


{/* <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{"width":"25px", "height":"25px"}}>
                                            </lord-icon> -- pen */}