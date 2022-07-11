const fs = require('fs')
const toys = require('../data/toy.json')

const PAGE_SIZE = 3

module.exports = {
  query,
  save,
  remove,
  getById,
}

function query({ txt, status, labels }) {
  let filteredToys = toys

  const regex = new RegExp(txt, 'i')
  filteredToys = filteredToys.filter(toy => regex.test(toy.name))

  if (status) {
    filteredToys = filteredToys.filter(
      toy =>
        (toy.inStock && status === 'stock') ||
        (!toy.inStock && status === 'missing')
    )
  }

  if (labels) {
    filteredToys = filteredToys.filter(toy => {
      return labels.every(label => toy.labels.includes(label))
    })
  }

  return Promise.resolve(filteredToys)
}

function save(toy) {
  if (toy._id) {
    const idx = toys.findIndex(currToy => currToy._id === toy._id)
    if (idx === -1) return Promise.reject('No such toy')
    toys[idx] = toy
  } else {
    toy._id = _makeId()
    toys.push(toy)
  }

  return _saveToysToFile().then(() => toy)
}

function getById(toyId) {
  const toy = toys.find(toy => toy._id === toyId)
  return Promise.resolve(toy)
}

function remove(toyId) {
  const idx = toys.findIndex(toy => toy._id === toyId)
  if (idx === -1) return Promise.reject('No such toy')

  toys.splice(idx, 1)
  return _saveToysToFile()
}

function _makeId(length = 5) {
  let txt = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(toys, null, 2)
    fs.writeFile('./data/toy.json', content, err => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve()
    })
  })
}
