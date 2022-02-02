const wrapperDiv = document.querySelector('.wrapper')
const errorMessage = document.querySelector('.error--message')
const elFiltros = document.querySelectorAll('.sidebar--menu li a')

const removeLoading = (isLoading) => {
  const spinner = document.querySelector('.loader--container');
  if (isLoading) {
    spinner.classList.add('ativo');

  } else {
    spinner.classList.remove('ativo');
  }
}


async function getResponseAll() {
  removeLoading(true)
  try {
    const response = await fetch(`https://gamerpower.p.rapidapi.com/api/filter?type=game&platform=epic-games-store.gog.origin.steam`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "gamerpower.p.rapidapi.com",
        "x-rapidapi-key": "59df7faf5emsh2cb45c52d4b33e3p18956fjsn99432fdbfb5d"
      }
    })
    const data = await response.json()
    console.log(data)
    generateContent(data)
    removeLoading(false)
  } catch (err) {

  }
}

getResponseAll();


async function getResponseFiltered(platform) {
  removeLoading(true)
  try {
    const response = await fetch(`https://gamerpower.p.rapidapi.com/api/filter?type=game&platform=${platform}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "gamerpower.p.rapidapi.com",
        "x-rapidapi-key": "59df7faf5emsh2cb45c52d4b33e3p18956fjsn99432fdbfb5d"
      }
    })
    const data = await response.json()
    console.log(data)
    if (data.status === 0) {
      wrapperDiv.innerHTML = ''
      errorMessage.classList.add('temErro')
      errorMessage.innerHTML = 'Nenhum jogo grátis foi encontrado :(';
      removeLoading(false)
      return
    }

    errorMessage.classList.remove('temErro')
    generateContent(data)
    removeLoading(false)
    errorMessage.innerHTML = '';

  } catch (err) {

  }

}




const generateContent = (data) => {
  const mapData = data.map(({
    id,
    image,
    open_giveaway_url,
    published_date,
    title,
    type,
    description,
    worth,
    platforms
  }) => {
    return `
    
        <div class="item">
        <span class="plataforma">${platforms}</span>
          <div class="imagem--jogo">
            <img src="${image}">
          </div>
          <div class="informacoes--jogo">
            <h3 class="titulo">${title}</h3>
            <div class="preco-nav">
              <p class="preco">FREE <span>${worth}</span></p>
              <span class="tipo">${type}</span>
            </div>
            <p class="descricao">${description}</p>
          </div>
          <div class="btn--container">
            <a href="${open_giveaway_url}" target="_blank" class="btn--pegar">
            Get Free</a>
          </div>
        </div>
      `
  }).join('')
  wrapperDiv.innerHTML = mapData;

}


elFiltros.forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    wrapperDiv.innerHTML = '';
    removeLoading()
    getResponseFiltered(el.dataset.plataforma)

  })
})