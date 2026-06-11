import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1/calc',
  headers: { 'Content-Type': 'application/json' },
})

export const calcCompoundInterest = (data) => http.post('/compound-interest', data)
export const calcHomeLoan          = (data) => http.post('/home-loan', data)
export const calcCarLoan           = (data) => http.post('/car-loan', data)
export const calcSalary            = (data) => http.post('/salary', data)
