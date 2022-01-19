
export const carouselImages = [
    './Images/slide3.jpg',
    './Images/slide2.jpg',
    './Images/slide1.jpg',
  ]

  const tableOptions = {
    filter: true, sort: true
  }
export const userTableColumns = [
  {
    name: "firstName + lastName",
    label: "Name", 
    options: tableOptions
  }
]

export const accountsAvailable = [
  {
      text: 'Faculty', 
      value: 2
  },
  {
      text: 'Administrator', 
      value: 2048
  },
  {
      text: 'Super Administrator', 
      value: 4096
  },
]

export const accountsAvailablePublic = [
  {
      text: 'Student', 
      value: 3
  },
  {
      text: 'Faculty', 
      value: 2
  },
  {
      text: 'Administrator', 
      value: 2048
  },
  {
      text: 'Super Administrator', 
      value: 4096
  },
]

export const schoolForms = [
  {
    name: 'School Form',
    value: 0
  },
  {
    name: 'Admin Forms',
    value: 1
  },
  {
    name: 'Others',
    value: 2
  },
]