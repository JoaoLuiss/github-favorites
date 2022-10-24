import { GithubAPI } from './GithubAPI.js'

// ========================================================
// this class is to manipulate the data
// ========================================================
class Favorites {
  constructor(app) {
    this.app = document.querySelector(app)
    this.favorites = []
    this.loadLocalStorage()
  }

  loadLocalStorage() {
    this.favorites = JSON.parse(localStorage.getItem('gitfavorites')) || []
  }

  saveLocalStorage() {
    localStorage.setItem('gitfavorites', JSON.stringify(this.favorites))
  }

  async addFavorite(userlogin) {
    try {
      const userExists = this.favorites.find(
        (user) => user.login.toLowerCase() === userlogin.toLowerCase()
      )
      if (userExists) {
        throw new Error('Este usuário já está favoritado.')
      }

      const newUser = await GithubAPI.search(userlogin)
      if (newUser.login === undefined)
        throw new Error('Usuário não encontrado!')
      this.favorites = [newUser, ...this.favorites]
      this.saveLocalStorage()
      // this.updateTable()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const favoritesMinusUser = this.favorites.filter(
      (favorite) => favorite.login !== user.login
    )
    this.favorites = favoritesMinusUser
    this.saveLocalStorage()
    // this.updateTable()
  }
}

// ========================================================
// this class is to manipulate the view and interaction
// ========================================================
export class FavoritesView extends Favorites {
  constructor(app) {
    super(app)
    this.tbody = this.app.querySelector('table tbody')
    this.updateTable()
    this.setListener()
  }

  setListener() {
    const searchButton = this.app.querySelector('.search__button')
    searchButton.addEventListener('click', () => {
      const searchInput = this.app.querySelector('.search__input')
      super.addFavorite(searchInput.value).then(() => {
        this.updateTable()
      })
    })
  }

  updateTable() {
    this.removeAllRows()

    this.favorites.forEach((user) => {
      const row = this.createRow()

      row.querySelector(
        '.td-user__link'
      ).href = `https://github.com/${user.login}`
      row.querySelector('.td-user__image').src = user.avatar_url
      row.querySelector('.td-user__nick').textContent = user.name
      row.querySelector('.td-user__login').textContent = user.login
      row.querySelector('.td-repositorieitories').textContent =
        user.public_repos
      row.querySelector('.td-followers').textContent = user.followers
      row.querySelector('.btn-remove').onclick = () => {
        if (this.confirmDelete(user.name)) {
          super.delete(user)
          this.updateTable()
        }
      }

      this.tbody.appendChild(row)
    })
  }

  removeAllRows() {
    this.tbody.querySelectorAll('tr').forEach((row) => {
      row.remove()
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
        <td class="td-user">
          <a class="td-user__link" href="#">
            <img class="td-user__image" src="#" alt="Mock Up" />
            <div class="td-user__name-wrapper">
              <p class="td-user__nick">Nick</p>
              <span class="td-user__login">/login</span>
            </div>
          </a>
        </td>
        <td class="td-repositorieitories">123</td>
        <td class="td-followers">1234</td>
        <td class="td-action"><button class="btn-remove" title="Remover">Remover</button></td>
      `

    return tr
  }

  confirmDelete(username) {
    return confirm(`Confirma que quer deletar ${username} dos seus favoritos?`)
  }
}
