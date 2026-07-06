import '../App.css'
const BeerData = ({data, brewCount, brewFreq, cities}) => {
    return(
        <>
            <div className="container">
                <div id="totalBrew" className="stat-box">
                    {brewCount}
                </div>
                <div id="mostCommonBrew" className="stat-box">

                </div>
                <div id="uniqueCities" className="stat-box">

                </div>

                {/* We'll place our data in here, using a map. */}
                <div>

                </div>
            </div>
        </>
    )
}

export default BeerData