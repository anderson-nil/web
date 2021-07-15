import data from "./data.js"

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function criarlistadeitensprodutos(id, name, price, image) {
  const formatedPrice = formatCurrency(price)

  return `
    <li data-id="${id}">
      <a class="list-menu" href="#">
        <div class="list-img">
          <img src="${image}" alt="">
        </div>
        <span class="list-name">${name}</span>
        <span class="list-price">${formatedPrice}</span>
      </a>
    </li>
  `
}

function productsList(categorySelected = '') {
  const cardapio = document.querySelector('.menu-list')

  const listProducts = data.reduce(function (accumulator, { id, name, price, image, category }) {
    if (!categorySelected || categorySelected === 'all') {
      accumulator += criarlistadeitensprodutos(id, name, price, image)
    }
    if (categorySelected === category) {
      accumulator += criarlistadeitensprodutos(id, name, price, image)
    }
    return accumulator
  }, '')

  cardapio.innerHTML = listProducts
}

productsList()


const categories = document.querySelectorAll('.item-menu')

categories.forEach(category => {
  category.onclick = (event) => {
    let i = 0
    while (i < categories.length) {
      categories[i++].classList.remove('active')
    }
    category.classList.add('active')
    const categorySelected = event.currentTarget.dataset.category
    productsList(categorySelected)
    monitorarProdutos()
  }
})



function criarlistadeitensprodutosOrder(id, name, price, image) {
  const formatedPrice = formatCurrency(price)

  return `
    <li class="order-item" data-idorder="${id}">
      <div class="order-img">
        <img src="${image}" alt="">
      </div>
      <div class="order-text">
        <span class="order-name">${name}</span>
        <span class="order-price">${formatedPrice}</span>
      </div>
      <div class="order-quantity">
        <input class="order-qty" type="number" min="1" value="1" data-idproduct="${id}"/>
        <span class="order-total">${formatedPrice}</span>
      </div>
    </li>
  `
}

function orderLoader(order) {
  const orderDOM = document.querySelector('.order-list')
  const listProduct = order.reduce((accumulator, {id, name, price, image}) => accumulator += criarlistadeitensprodutosOrder(id, name, price, image), '')
  orderDOM.innerHTML = listProduct
}

function calculeTotalPrice() {
  const quantidade = document.querySelectorAll('.order-qty')
  const totaldeprecos = document.querySelector('.order_totalPrice')
  let totalPrice = 0

  if(quantidade) {
    for(let i = 0; i < quantidade.length; i++) {
      const idProduct = Number(quantidade[i].dataset.idproduct)
      totalPrice += Number(quantidade[i].value) * data[idProduct - 1].price
    }
  }
  totaldeprecos.innerHTML = formatCurrency(totalPrice)
}

function changeQuantity() {
  const quantidade = document.querySelectorAll('.order-qty')
  const prices = document.querySelectorAll('.order-total')

  if (quantidade) {
    for (let i = 0; i < quantidade.length; i++) {
      quantidade[i].oninput = (event) => {
        const idProduct = Number(quantidade[i].dataset.idproduct)
        const totalPrice = formatCurrency(data[idProduct - 1].price * Number(quantidade[i].value))
        prices[i].innerHTML = totalPrice
        calculeTotalPrice()
      }
    }
  }
}

function cancelarOrdem() {
  const orderDOM = document.querySelector('.order-list')
  localStorage.clear()
  orderDOM.innerHTML = ''
  order=[]
  calculeTotalPrice()
}

function confirmOrder() {
  const message = document.querySelector('.order_messageConfirm')
  message.style.visibility = "visible"
  setTimeout(() => {
    message.style.visibility = "hidden"
  }, 5000)
  cancelarOrdem()
}
let order
function OrderList() {

  order = JSON.parse(localStorage.getItem('order')) || []

  orderLoader(order)
  changeQuantity()
  monitorarProdutos()


  calculeTotalPrice()

  const botaocancelar = document.querySelector('.cancel')
  botaocancelar.addEventListener('click', () => {
    cancelarOrdem()
  })

  const botaoConfirmar = document.querySelector('.confirm')
  botaoConfirmar.addEventListener('click', () => {
    confirmOrder()
  })

}
function monitorarProdutos(){

  const productsDOM = document.querySelectorAll('[data-id]')
    productsDOM.forEach(productIem => {
    productIem.addEventListener('click', function (event) {
      calculeTotalPrice()
      const ID = event.currentTarget.dataset.id

      const productClicked = data.find(({ id }) => Number(ID) === id)

      order.push(productClicked)
      console.log(order)
      localStorage.setItem('order', JSON.stringify(order))
      orderLoader(order)
      changeQuantity()
    })
  })
}
OrderList()
