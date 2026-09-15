import { useState, useEffect } from 'react'
import { 
  LuSun, LuMoon, LuCloudSun, LuCloudMoon, 
  LuCloud, LuCloudRain, LuCloudLightning, 
  LuSnowflake, LuHaze 
} from 'react-icons/lu'

function App() {
  // Replaced local default cities with general metropolitan default cities
  const [cities, setCities] = useState(["Rome", "London", "Tokyo"])
  const [weatherData, setWeatherData] = useState({})
  const [newCity, setNewCity] = useState("")
  const [selectedCity, setSelectedCity] = useState(null)
  const [error, setError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const fetchCityData = async (cityName) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/weather?city=${cityName}`)
      if (!response.ok) throw new Error(`Could not fetch data for ${cityName}`)
      const data = await response.json()
      setWeatherData(prev => ({ ...prev, [cityName]: data }))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    cities.forEach(city => {
      if (!weatherData[city]) fetchCityData(city)
    })
  }, [cities])

  const handleAddCity = (e) => {
    e.preventDefault()
    if (newCity.trim() && !cities.includes(newCity.trim())) {
      setCities([...cities, newCity.trim()])
      setNewCity("")
      setError(null)
    }
  }

  const handleRemoveCity = (e, cityToRemove) => {
    e.stopPropagation()
    setCities(cities.filter(city => city !== cityToRemove))
  }

  const formatTime = (unix_timestamp) => {
    return new Date(unix_timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    return directions[Math.round(deg / 45) % 8]
  }

  const getAQI = (aqiCode) => {
    const aqiMap = { 1: 'Good 🟢', 2: 'Fair 🟡', 3: 'Moderate 🟠', 4: 'Poor 🔴', 5: 'Very Poor 🟤' }
    return aqiMap[aqiCode] || 'Unknown'
  }

  const theme = isDarkMode ? {
    globalBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    text: '#cbd5e1',
    header: '#f8fafc',
    cardBg: 'rgba(30, 41, 59, 0.6)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    modalBg: '#0f172a',
    inputBg: '#334155',
    iconColor: '#f8fafc',
    btnBg: '#f8fafc',
    btnText: '#111'
  } : {
    globalBg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    text: '#555',
    header: '#111',
    cardBg: 'rgba(255, 255, 255, 0.8)',
    cardBorder: 'rgba(255, 255, 255, 0.5)',
    modalBg: 'linear-gradient(to bottom, #ffffff, #f0f2f5)',
    inputBg: 'white',
    iconColor: '#111',
    btnBg: '#111',
    btnText: 'white'
  }

  const getWeatherIcon = (code, size = 50, extraStyles = {}) => {
    const props = { size, color: theme.iconColor, style: extraStyles }
    switch (code) {
      case '01d': return <LuSun {...props} />
      case '01n': return <LuMoon {...props} />
      case '02d': return <LuCloudSun {...props} />
      case '02n': return <LuCloudMoon {...props} />
      case '03d': case '03n': 
      case '04d': case '04n': return <LuCloud {...props} />
      case '09d': case '09n': 
      case '10d': case '10n': return <LuCloudRain {...props} />
      case '11d': case '11n': return <LuCloudLightning {...props} />
      case '13d': case '13n': return <LuSnowflake {...props} />
      case '50d': case '50n': return <LuHaze {...props} />
      default: return <LuSun {...props} />
    }
  }

  const getCardStyle = (segment) => {
    const hour = new Date(segment.dt * 1000).getHours()
    const temp = segment.main.temp
    const weatherId = segment.weather[0].id
    const isRain = weatherId >= 200 && weatherId < 600
    const isSnow = weatherId >= 600 && weatherId < 700

    let bg, border, textColor;

    if (isDarkMode) {
      textColor = '#f8fafc';
      if (temp > 30) { bg = '#be123c'; border = '#f43f5e' } 
      else if (temp > 25) { bg = '#c2410c'; border = '#f97316' } 
      else if (isSnow) { bg = '#0e7490'; border = '#06b6d4' } 
      else if (isRain) { bg = '#475569'; border = '#94a3b8' } 
      else if (hour >= 5 && hour < 8) { bg = '#be185d'; border = '#f472b6' } 
      else if (hour >= 8 && hour < 12) { bg = '#b45309'; border = '#fbbf24' } 
      else if (hour >= 12 && hour < 17) { bg = '#0369a1'; border = '#38bdf8' } 
      else if (hour >= 17 && hour < 20) { bg = '#7e22ce'; border = '#c084fc' } 
      else { bg = '#4338ca'; border = '#818cf8' } 
    } else {
      textColor = '#111';
      if (temp > 30) { bg = '#fecaca'; border = '#fca5a5' }
      else if (temp > 25) { bg = '#fed7aa'; border = '#fdba74' }
      else if (isSnow) { bg = '#cffafe'; border = '#a5f3fc' }
      else if (isRain) { bg = '#e2e8f0'; border = '#cbd5e1' }
      else if (hour >= 5 && hour < 8) { bg = '#fde4cf'; border = '#fbc49f' }
      else if (hour >= 8 && hour < 12) { bg = '#fef3c7'; border = '#fde68a' }
      else if (hour >= 12 && hour < 17) { bg = '#e0f2fe'; border = '#bae6fd' }
      else if (hour >= 17 && hour < 20) { bg = '#f3e8ff'; border = '#d8b4fe' }
      else { bg = '#dbeafe'; border = '#bfdbfe' }
    }

    return { backgroundColor: bg, borderColor: border, borderWidth: '2px', borderStyle: 'solid', color: textColor }
  }

  const getGroupedForecast = (forecastList) => {
    return forecastList.reduce((acc, segment) => {
      const dateStr = new Date(segment.dt * 1000).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
      if (!acc[dateStr]) acc[dateStr] = []
      acc[dateStr].push(segment)
      return acc
    }, {})
  }

  return (
    <div style={{ padding: '40px 20px', fontFamily: '"Poppins", sans-serif', minHeight: '100vh', background: theme.globalBg, color: theme.text, transition: 'background 0.3s ease' }}>
      
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100vh;
          background: ${isDarkMode ? '#0f172a' : '#f5f7fa'};
        }
        
        @keyframes smoothFadeUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-modal {
          animation: smoothFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .smooth-scroll {
          scroll-behavior: smooth;
        }
        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
        }
      `}</style>

      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{ position: 'absolute', top: '20px', right: '20px', background: theme.btnBg, color: theme.btnText, border: 'none', borderRadius: '50px', padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
      >
        {isDarkMode ? <><LuSun size={18}/> Light Mode</> : <><LuMoon size={18}/> Dark Mode</>}
      </button>

      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)' }}>
        
        <div style={{ flex: '1' }}>
          <h1 style={{ textAlign: 'center', fontWeight: '700', color: theme.header, fontSize: '2.5rem', marginBottom: '30px' }}>🌍 Weather Dashboard</h1>
          
          <form onSubmit={handleAddCity} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
            <input 
              type="text" 
              placeholder="Add a city..." 
              value={newCity} 
              onChange={(e) => setNewCity(e.target.value)} 
              style={{ padding: '12px 20px', width: '280px', borderRadius: '30px', border: 'none', background: theme.inputBg, color: theme.header, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'inherit', fontSize: '1rem' }}
            />
            <button type="submit" style={{ padding: '12px 25px', backgroundColor: theme.btnBg, color: theme.btnText, border: 'none', borderRadius: '30px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.1s' }}>Add City</button>
          </form>
          
          {error && <p style={{ color: '#ff4757', textAlign: 'center', fontWeight: '600' }}>{error}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            {cities.map(city => {
              const data = weatherData[city]
              if (!data) return <div key={city} style={{ padding: '30px', background: theme.cardBg, borderRadius: '16px', textAlign: 'center', color: theme.text }}>Loading {city}...</div>

              return (
                <div 
                  key={city} 
                  onClick={() => setSelectedCity(city)}
                  className="card-hover"
                  style={{ padding: '30px', background: theme.cardBg, backdropFilter: 'blur(10px)', border: `1px solid ${theme.cardBorder}`, borderRadius: '20px', cursor: 'pointer', position: 'relative', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                >
                  <button 
                    onClick={(e) => handleRemoveCity(e, city)} 
                    style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff4757', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                  >✕</button>
                  
                  <h2 style={{ margin: '0 0 15px 0', color: theme.header, fontWeight: '700', fontSize: '1.8rem' }}>{data.current.name}</h2>
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {getWeatherIcon(data.current.weather[0].icon, 70, { marginRight: '20px' })}
                    <h1 style={{ margin: 0, fontSize: '3.5rem', fontWeight: '700', color: theme.header, letterSpacing: '-2px' }}>{Math.round(data.current.main.temp)}°C</h1>
                  </div>
                  
                  <div style={{ marginTop: '20px', padding: '15px', background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)', borderRadius: '12px' }}>
                    <p style={{ margin: '5px 0', fontWeight: '600', color: theme.header }}>AQI: <span style={{ fontWeight: '400', color: theme.text }}>{getAQI(data.aqi?.list[0].main.aqi)}</span></p>
                    <p style={{ margin: '5px 0', fontWeight: '600', color: theme.header }}>Wind: <span style={{ fontWeight: '400', color: theme.text }}>{data.current.wind.speed} m/s {getWindDirection(data.current.wind.deg)}</span></p>
                  </div>
                  
                  <p style={{ margin: '20px 0 0 0', fontSize: '0.95rem', fontWeight: '600', textAlign: 'center', color: theme.text }}>🌅 {formatTime(data.current.sys.sunrise)} &nbsp; | &nbsp; 🌇 {formatTime(data.current.sys.sunset)}</p>
                </div>
              )
            })}
          </div>
        </div>

        <footer style={{ textAlign: 'center', marginTop: '60px', paddingBottom: '20px', color: theme.text, fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} Mario. All rights reserved. | Built with React & FastAPI <br/>
          <a 
            href="https://github.com/mariomonkey" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: theme.header, textDecoration: 'none', fontWeight: '600', marginTop: '10px', display: 'inline-block' }}
          >
            View on GitHub
          </a>
        </footer>

      </div>

      {selectedCity && weatherData[selectedCity] && (
        <div className="smooth-scroll" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: theme.modalBg, zIndex: 1000, overflowY: 'auto', padding: '60px 40px', boxSizing: 'border-box' }}>
          
          <div className="animate-modal" style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
            
            <button 
              onClick={() => setSelectedCity(null)} 
              style={{ position: 'absolute', top: '0px', right: '0px', padding: '12px 25px', backgroundColor: theme.btnBg, color: theme.btnText, border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit', fontWeight: '600', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            >Close View</button>
            
            <h1 style={{ fontSize: '4rem', margin: '0 0 30px 0', color: theme.header, fontWeight: '800', letterSpacing: '-2px' }}>{selectedCity}</h1>
            <p style={{ fontSize: '1.3rem', color: theme.text, fontWeight: '500' }}>Current Humidity: <strong style={{ color: theme.header }}>{weatherData[selectedCity].current.main.humidity}%</strong> &nbsp; | &nbsp; Current Temp: <strong style={{ color: theme.header }}>{Math.round(weatherData[selectedCity].current.main.temp)}°C</strong></p>
            
            <hr style={{ margin: '50px 0', border: 'none', borderTop: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` }}/>
            
            {Object.entries(getGroupedForecast(weatherData[selectedCity].forecast.list)).map(([dateStr, segments]) => (
              <div key={dateStr} style={{ marginBottom: '50px' }}>
                <h2 style={{ color: theme.header, fontWeight: '700', marginBottom: '20px', borderBottom: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, paddingBottom: '10px' }}>{dateStr}</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
                  {segments.map((segment, index) => {
                    const cardStyle = getCardStyle(segment)
                    return (
                      <div key={index} className="card-hover" style={{ 
                        backgroundColor: cardStyle.backgroundColor, borderColor: cardStyle.borderColor, borderWidth: cardStyle.borderWidth, borderStyle: cardStyle.borderStyle, color: cardStyle.color,
                        borderRadius: '16px', padding: '20px', textAlign: 'center'
                      }}>
                        <p style={{ margin: '0 0 15px 0', fontWeight: '700', fontSize: '1.1rem' }}>{new Date(segment.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
                          <span style={{ color: cardStyle.color }}>
                            {getWeatherIcon(segment.weather[0].icon, 50, { color: 'inherit' })}
                          </span>
                        </div>
                        
                        <p style={{ margin: '10px 0 5px 0', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px' }}>{Math.round(segment.main.temp)}°C</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8, fontWeight: '600' }}>Hum: {segment.main.humidity}%</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
