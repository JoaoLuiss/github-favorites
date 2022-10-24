export class GithubAPI {
  static search(userlogin) {
    const endpoint = `https://api.github.com/users/${userlogin}`
    return fetch(endpoint)
      .then((data) => data.json())
      .then(({ login, name, public_repos, followers, avatar_url}) => ({
        login,
        name,
        public_repos,
        followers,
        avatar_url
      }))
  }
}
