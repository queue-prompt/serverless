
const BASE_URL = "https://hqfq6pwuqf.execute-api.ap-southeast-1.amazonaws.com"

const mockTimeslotCreate = {
  entityId: "0000",
  dateList: ["0001-01-01", "0001-01-02"],
  timeslots: {
    "0000-0100": 10,
    "0100-0000": 10
  }
}

const mockPeople = {
  userId: '0000',
  idCardNumber: '0000',
  name: 'abc',
}

const mockRegister = {
  debug: true,
  date: "0001-01-01",
  time: "0000-0100",
  entityId: "0000",
  userId: '0000',
  //   idCardNumber: '0000',

  //reserveToken : "0000"
}


module.exports = {
  mockTimeslotCreate : mockTimeslotCreate,
  mockRegister,
  mockPeople,
  BASE_URL,
  token: 'eyJraWQiOiIwZjdhYzBmOGEyMmUxMzFiNWZlNzVhOWNlMTY5OWFjYTE1MGY3ZjZjMGVkNzVlMjgyYjNiZjdmYjA5N2E3NjNlIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2FjY2Vzcy5saW5lLm1lIiwic3ViIjoiVTI3OTU3ZTEzNjIxOTQwYjcyYzcwMTg1NWIzZmRlNmE1IiwiYXVkIjoiMTY1NjI1NzM0NyIsImV4cCI6MTYyNzYyMTI5NywiaWF0IjoxNjI3NjE3Njk3LCJhbXIiOlsibGluZXNzbyJdLCJuYW1lIjoidXRwIiwicGljdHVyZSI6Imh0dHBzOi8vcHJvZmlsZS5saW5lLXNjZG4ubmV0LzBoT3pIdGJISmxFRlYxRFRua041ZHZBa2xJSGpnQ0l4WWREV3hZTjFFS0cyRlFQUWNFSFR4ZU93QUZHMlJRYlZkVVREZ01ZUU1GUm13SSJ9.XOo2zEeSflwJH06gHN9a7_bJnpx3vr1IeP5HF_55-dWoB-EDm_jXMgl5X1_k4VLEPIEPBYOCzpJ_UEGMyBozDg'
}

