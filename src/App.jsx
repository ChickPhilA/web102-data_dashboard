import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'
import BeerData from './components/BeerData.jsx'

function App() {
  const [breweryData, setBreweryData] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [breweryType, setBreweryType] = useState('') /* use for setting country when choosing pub */

  const URL = "https://api.openbrewerydb.org/v1/breweries"

  /* Statistic variables */
  let totalBreweries = 0  /* stats that will be displayed */
  const breweryDict = new Map()
  const uniqueCities = new Set()

  /* also make data variables for most common brewery type, and unique cities or countries */


  /* this covers fetching the data */
  useEffect(() => {
    console.log("fetching!")
    const request = async () => {
      console.log("im going to get the data now")
      try {
        const response = await axios.get(URL)
        setBreweryData(response.data)
        console.log("Here is your data:")
        console.table(response.data)

        } catch (error) {
        console.error("Something went wrong:", error)
      }
    }
    request()
  }, [])

  totalBreweries = breweryData.length

  /* A function to help us get the frequency of brewery types in our API */
  function breweryTypeFrequency() {
    /* A check to see if our brewery API data is available */
    if(!breweryData) {
      console.error("No data found yet; brewery data not available.")
    }
    else {
      for(let i = 0; i < totalBreweries; i++) {
        if(!breweryDict.has(breweryData[i].brewery_type)) {
          breweryDict.set(breweryData[i].brewery_type, 1)
        }
        else {
          breweryDict.set([breweryData[i].brewery_type], breweryData[i].brewery_type++)
        }
      }
    }
  }

  function countUniqueCities() {
    if(!breweryData) {
      console.error("No data found; brewery data not available.")
    }
    else {
      for(let i = 0; i < totalBreweries; i++) {
        if(!uniqueCities.has(breweryData[i].city)) {
          uniqueCities.add(breweryData[i].city)
        }
      }
    }
  }

  breweryTypeFrequency()
  countUniqueCities()

  return (
    <>
     <h1> Beertopia 🍺 </h1>
     <h2> Find information about local and global pubs around you!</h2>
     <BeerData data={breweryData}
        brewCount={totalBreweries}
        brewFreq={breweryDict}
        cities={uniqueCities}
      />
    </>
  )
}

export default App
