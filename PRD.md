# Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** Trip Fuel Split Calculator
**Tagline:** Split fuel costs fairly, instantly.

The Trip Fuel Split Calculator is a lightweight web application that helps groups (friends, students, coworkers, travelers) fairly split fuel costs for shared trips. Users enter trip and vehicle details, and the product instantly calculates total fuel cost and an equal per-person split. A copyable, WhatsApp-friendly summary makes it easy to share costs transparently.

---

## 2. Problem Statement

When people travel together, calculating fuel expenses manually often leads to:

* Confusion around mileage, distance, and fuel price
* Disputes about fairness (especially regarding vehicle owners)
* Inconvenience in sharing a clear breakdown in group chats

Existing expense apps are often overkill for simple, one-off trips.

---

## 3. Goals & Success Metrics

### Goals

* Enable quick, accurate fuel cost splitting
* Provide a transparent breakdown everyone understands
* Make results easily shareable on WhatsApp

### Success Metrics

* Time to calculate split: < 30 seconds
* % of users copying the summary text
* Repeat usage for multiple trips

---

## 4. Target Users

### Primary Users

* Friends going on road trips
* College students sharing rides
* Coworkers carpooling

### Secondary Users

* Small travel groups
* Rideshare drivers splitting fuel informally

---

## 5. User Stories

* *As a traveler*, I want to enter distance, mileage, fuel price, and people so I can know how much each person should pay.
* *As a vehicle owner*, I want to choose whether I’m included in the split.
* *As a group member*, I want a clear breakdown I can trust and verify.
* *As a user*, I want to copy the result and send it on WhatsApp easily.

---

## 6. Functional Requirements

### Inputs

* Distance (km)
* Vehicle mileage (km/l)
* Fuel price (₹/l)

  * Presets: Petrol, Diesel
  * Custom input option
* Number of people in the vehicle
* Include / exclude vehicle owner (toggle)
* Rounding preference (e.g., round to ₹1)

### Calculations

* Fuel consumed = Distance / Mileage
* Total fuel cost = Fuel consumed × Fuel price
* Cost per person = Total cost / Number of paying people

### Outputs

* Total fuel cost
* Per-person payable amount
* Detailed breakdown card
* Copyable text summary in WhatsApp-friendly format:

```
TRIP COST SPLIT
----------------------
Total Cost: ₹322.2
Distance: 120 km
Mileage: 40 km/l
Fuel Price: ₹107.4/l
People: 3

SPLIT:
Each person pays: ₹107
(3 people paying including owner)
```

---

## 7. Non-Functional Requirements

* Fully client-side (no login required)
* Fast load time (< 1s)
* Mobile-first and responsive
* Accessible form inputs (labels, contrast)

---

## 8. UI / UX Requirements

### Visual Style

* Minimal, calm aesthetic
* Neutral background (#f4efea)
* Dark text (#383838)
* Inter font family
* Subtle grain/noise overlay
* Large primary CTA button ("Calculate Split")

### Layout

* Left: product title and "How it works" steps
* Right: calculator card with inputs and results
* Clear separation between input, configuration, and output

---

## 9. Key Screens

1. **Calculator Screen**

   * Input fields
   * Fuel type selector
   * Include owner checkbox
   * Calculate + Reset buttons

2. **Results Section**

   * Total cost
   * Per-person cost (highlighted)
   * Breakdown card
   * Copy summary button

---

## 10. Edge Cases & Validation

* Prevent division by zero
* Validate positive numeric inputs
* Handle decimal rounding cleanly
* Show friendly error states

---

## 11. Future Enhancements (Out of Scope for v1)

* Multiple vehicles
* Split by distance per person
* Saved trips / history
* Currency selector
* Share via deep link

---

## 12. Technical Assumptions

* Built using HTML, Tailwind CSS, and vanilla JavaScript or React
* No backend required for MVP
* Deployed as a static site

---

## 13. Risks & Mitigations

* **Risk:** Users misunderstand mileage units
  **Mitigation:** Clear unit labels (km, km/l)

* **Risk:** Disputes over fairness
  **Mitigation:** Transparent calculation breakdown

---

## 14. MVP Definition

The MVP is complete when:

* Users can enter all trip inputs
* App calculates total and per-person cost accurately
* WhatsApp-ready summary can be copied
* UI matches the reference minimal style
