import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const http = axios.create({
  baseURL: `${API_BASE}/api/v1/calc`,
  headers: { 'Content-Type': 'application/json' },
})

export const calcCompoundInterest = (data) => http.post('/compound-interest', data)
export const calcHomeLoan          = (data) => http.post('/home-loan', data)
export const calcCarLoan           = (data) => http.post('/car-loan', data)
export const calcSalary            = (data) => http.post('/salary', data)
