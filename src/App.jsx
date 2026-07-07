import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'
import SummaryStats from './components/SummaryStats.jsx'

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
          breweryDict.set(breweryData[i].brewery_type, breweryDict.get(breweryData[i].brewery_type) + 1)
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

  const mostCommonBrewery = (dict) => {
    let topType = "N/A"
    let topCount = 0
    for (const [type, count] of dict) {
      if (count > topCount) {
        topCount = count
        topType = type
      }
    }
    return topType
  }

  breweryTypeFrequency()          // fills breweryDict
  countUniqueCities()             // fills uniqueCities
  const topBrewery = mostCommonBrewery(breweryDict)


  const filteredBreweries = breweryData.filter((b) => 
    b.name.toLowerCase().includes(searchInput.toLowerCase()) &&
    (breweryType === "" || b.brewery_type === breweryType)
  )

  return (
    <>
     <h1> Pubtopia 🍺 </h1>
     <h2> Find information about local and global pubs around you!</h2>
     <SummaryStats brewCount={totalBreweries} mostCommon={topBrewery} cities={uniqueCities} />

     <div className="controls">
       <input
        className="search-bar"
        type="text"
        placeholder="🔍  Search brewery by name..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
       />

       <select className="type-filter" value={breweryType} onChange={(e) => setBreweryType(e.target.value)}>
          <option value="">All Types</option>
          {[...breweryDict.keys()].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
          ))}
       </select>
     </div>

     <table className="brewery-table">
       <thead>
         <tr>
           <th>Name</th>
           <th>Type</th>
           <th>City</th>
           <th>State</th>
           <th>Country</th>
         </tr>
       </thead>
       <tbody>
         {filteredBreweries.map((brewery) => (
           <tr key={brewery.id}>
             <td>{brewery.name}</td>
             <td>{brewery.brewery_type}</td>
             <td>{brewery.city}</td>
             <td>{brewery.state}</td>
             <td>{brewery.country}</td>
           </tr>
         ))}
       </tbody>
     </table>
    </>
  )
}

export default App
