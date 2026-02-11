import { useState } from 'react'
import './App.css'

type FuelType = 'petrol' | 'diesel' | 'custom'

type Result = {
  fuelConsumed: number
  totalCost: number
  rawPerPerson: number
  roundedPerPerson: number
  payingPeople: number
}

const FUEL_PRESETS: Record<Exclude<FuelType, 'custom'>, number> = {
  petrol: 107.4,
  diesel: 96.8,
}

const formatNumber = (value: number, maxFractionDigits = 2) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  }).format(value)

const roundToIncrement = (value: number, increment: number) => {
  if (increment <= 0) return value
  return Math.round(value / increment) * increment
}

const DEFAULTS = {
  distance: '120',
  mileage: '40',
  fuelType: 'petrol' as FuelType,
  fuelPrice: String(FUEL_PRESETS.petrol),
  people: '3',
  includeOwner: true,
  rounding: '1',
}

function App() {
  const [distance, setDistance] = useState(DEFAULTS.distance)
  const [mileage, setMileage] = useState(DEFAULTS.mileage)
  const [fuelType, setFuelType] = useState<FuelType>(DEFAULTS.fuelType)
  const [fuelPrice, setFuelPrice] = useState(DEFAULTS.fuelPrice)
  const [people, setPeople] = useState(DEFAULTS.people)
  const [includeOwner, setIncludeOwner] = useState(DEFAULTS.includeOwner)
  const [rounding, setRounding] = useState(DEFAULTS.rounding)
  const [errors, setErrors] = useState<string[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const [copyStatus, setCopyStatus] = useState('')

  const handleFuelTypeChange = (nextType: FuelType) => {
    setFuelType(nextType)
    if (nextType === 'custom') return
    setFuelPrice(String(FUEL_PRESETS[nextType]))
  }

  const resetAll = () => {
    setDistance(DEFAULTS.distance)
    setMileage(DEFAULTS.mileage)
    setFuelType(DEFAULTS.fuelType)
    setFuelPrice(DEFAULTS.fuelPrice)
    setPeople(DEFAULTS.people)
    setIncludeOwner(DEFAULTS.includeOwner)
    setRounding(DEFAULTS.rounding)
    setErrors([])
    setResult(null)
    setCopyStatus('')
  }

  const calculate = () => {
    const distanceNum = Number(distance)
    const mileageNum = Number(mileage)
    const fuelPriceNum = Number(fuelPrice)
    const peopleNum = Number(people)
    const roundingNum = Number(rounding)

    const nextErrors: string[] = []
    if (!Number.isFinite(distanceNum) || distanceNum <= 0) {
      nextErrors.push('Distance must be greater than 0 km.')
    }
    if (!Number.isFinite(mileageNum) || mileageNum <= 0) {
      nextErrors.push('Mileage must be greater than 0 km/l.')
    }
    if (!Number.isFinite(fuelPriceNum) || fuelPriceNum <= 0) {
      nextErrors.push('Fuel price must be greater than 0 per liter.')
    }
    if (!Number.isInteger(peopleNum) || peopleNum <= 0) {
      nextErrors.push('Number of people must be a whole number greater than 0.')
    }

    const payingPeople = includeOwner ? peopleNum : peopleNum - 1
    if (payingPeople <= 0) {
      nextErrors.push('At least 1 person must be paying after owner exclusion.')
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors)
      setResult(null)
      return
    }

    const fuelConsumed = distanceNum / mileageNum
    const totalCost = fuelConsumed * fuelPriceNum
    const rawPerPerson = totalCost / payingPeople
    const roundedPerPerson = roundToIncrement(rawPerPerson, roundingNum)

    setErrors([])
    setCopyStatus('')
    setResult({
      fuelConsumed,
      totalCost,
      rawPerPerson,
      roundedPerPerson,
      payingPeople,
    })
  }

  const summaryText = result
    ? [
        'TRIP COST SPLIT',
        '----------------------',
        `Total Cost: ₹${formatNumber(result.totalCost)}`,
        `Distance: ${formatNumber(Number(distance))} km`,
        `Mileage: ${formatNumber(Number(mileage))} km/l`,
        `Fuel Price: ₹${formatNumber(Number(fuelPrice))}/l`,
        `People in vehicle: ${people}`,
        '',
        'SPLIT:',
        `Each person pays: ₹${formatNumber(result.roundedPerPerson)}`,
        `(${result.payingPeople} people paying ${includeOwner ? 'including' : 'excluding'} owner)`,
      ].join('\n')
    : ''

  const copySummary = async () => {
    if (!summaryText) return
    try {
      await navigator.clipboard.writeText(summaryText)
      setCopyStatus('Summary copied. Paste in WhatsApp.')
    } catch {
      setCopyStatus('Unable to copy automatically. Please copy manually.')
    }
  }

  return (
    <main className="page">
      <div className="grain" aria-hidden="true" />

      <section className="left">
        <p className="kicker">Trip Fuel Split Calculator</p>
        <h1>
          TRIP FUEL
          <br />
          SPLIT CALCULATOR
        </h1>
        <p className="tag">Split fuel fairly</p>
        <div className="divider" />

        <div className="how">
          <p className="how-title">How it works</p>
          <div className="step">
            <span>01</span>
            <div>
              <p>Enter trip details</p>
              <small>Distance, mileage, price &amp; people</small>
            </div>
          </div>
          <div className="step">
            <span>02</span>
            <div>
              <p>Set rules</p>
              <small>Include vehicle owner or split equally</small>
            </div>
          </div>
          <div className="step">
            <span>03</span>
            <div>
              <p>Share cost</p>
              <small>Copy the summary to your group chat</small>
            </div>
          </div>
        </div>
      </section>

      <section className="right" aria-label="Trip split calculator">
        <div className="card">
          <div className="card-head">
            <div>
              <p className="section-label">Trip Details</p>
              <p className="section-sub">Fill in the trip basics</p>
            </div>
            <div className="calc-icon" aria-hidden="true">
              =
            </div>
          </div>

          <div className="input-grid">
            <label className="field">
              <span>Distance (km)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={distance}
                onChange={(event) => setDistance(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Mileage (km/l)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={mileage}
                onChange={(event) => setMileage(event.target.value)}
              />
            </label>
          </div>

          <div className="fuel-row">
            <div>
              <p className="subhead">Fuel Price</p>
              <div className="fuel-buttons">
                <button
                  type="button"
                  className={fuelType === 'petrol' ? 'fuel active' : 'fuel'}
                  onClick={() => handleFuelTypeChange('petrol')}
                >
                  <span>Petrol</span>
                  <small>₹{FUEL_PRESETS.petrol.toFixed(2)}</small>
                </button>
                <button
                  type="button"
                  className={fuelType === 'diesel' ? 'fuel active' : 'fuel'}
                  onClick={() => handleFuelTypeChange('diesel')}
                >
                  <span>Diesel</span>
                  <small>₹{FUEL_PRESETS.diesel.toFixed(2)}</small>
                </button>
                <button
                  type="button"
                  className={fuelType === 'custom' ? 'fuel active' : 'fuel'}
                  onClick={() => handleFuelTypeChange('custom')}
                >
                  <span>Custom</span>
                  <small>Set price</small>
                </button>
              </div>
            </div>

            <label className="field">
              <span>People in vehicle</span>
              <input
                type="number"
                min="1"
                step="1"
                value={people}
                onChange={(event) => setPeople(event.target.value)}
              />
            </label>
          </div>

          {fuelType === 'custom' && (
            <label className="field custom">
              <span>Custom price (₹/l)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={fuelPrice}
                onChange={(event) => setFuelPrice(event.target.value)}
              />
            </label>
          )}

          <p className="location">Using Ernakulam, Kerala · Updated Feb 10, 2026, 9:07 AM</p>

          <div className="config">
            <p className="section-label">Configuration</p>
            <div className="config-row">
              <label className="check">
                <input
                  type="checkbox"
                  checked={includeOwner}
                  onChange={(event) => setIncludeOwner(event.target.checked)}
                />
                Include owner
              </label>
              <select
                value={rounding}
                onChange={(event) => setRounding(event.target.value)}
                aria-label="Rounding preference"
              >
                <option value="0">No rounding</option>
                <option value="0.5">Round to ₹0.5</option>
                <option value="1">Round to ₹1</option>
                <option value="5">Round to ₹5</option>
                <option value="10">Round to ₹10</option>
              </select>
            </div>
          </div>

          <div className="actions">
            <button type="button" className="primary" onClick={calculate}>
              Calculate Split
            </button>
            <button type="button" className="ghost" onClick={resetAll}>
              Reset
            </button>
          </div>

          {errors.length > 0 && (
            <div className="errors" role="alert" aria-live="polite">
              {errors.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}

          {result && (
            <div className="results">
              <div className="result-top">
                <div>
                  <p className="label">Total fuel cost</p>
                  <p className="total">₹{formatNumber(result.totalCost)}</p>
                </div>
                <div className="pay">
                  <p className="label">Each person pays</p>
                  <p className="per">₹{formatNumber(result.roundedPerPerson)}</p>
                </div>
              </div>
              <div className="breakdown">
                <div>
                  <p>Distance: {formatNumber(Number(distance))} km</p>
                  <p>Fuel: ₹{formatNumber(Number(fuelPrice))}/l</p>
                </div>
                <div>
                  <p>Mileage: {formatNumber(Number(mileage))} km/l</p>
                  <p>People: {people}</p>
                </div>
                <p className="foot">
                  {result.payingPeople} people splitting ({includeOwner ? 'owner included' : 'owner excluded'})
                </p>
              </div>
              <button type="button" className="ghost" onClick={copySummary}>
                Copy Summary
              </button>
              {copyStatus && (
                <p className="copy-status" role="status">
                  {copyStatus}
                </p>
              )}
              <details className="summary">
                <summary>Show summary text</summary>
                <textarea readOnly value={summaryText} aria-label="Trip cost split summary" rows={8} />
              </details>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
