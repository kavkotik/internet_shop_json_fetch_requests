let main = document.querySelector(".main");
let categoriesBlock = document.querySelector(".categories-block");
const basketBtn = document.querySelector(".basket-btn");
let productsInBasket = document.querySelector(".products-in-basket");
let basketList = document.querySelector(".basket-list");
const basketCounter = document.querySelector(".basket-counter");
const emptyBasketInfo = document.querySelector(".empty-basket-info");
const root = document.querySelector(".root");
let hash = window.location.hash;


render(hash);

async function getCategory() {
  let response = await fetch("http://localhost:3000/category");
  let data = await response.json();
  let json = await data;

  let item = document.querySelectorAll(".product-item");

  categoriesBlock.innerHTML = "";

  json.forEach((el) => {
    categoriesBlock.innerHTML += `
    <button class="category-btn" id="${el.id}">${el.name}</button>
    `;
  });

  let categoryBtn = document.querySelectorAll(".category-btn");

  categoryBtn.forEach((el) => {
    el.onclick = () => {
      item.forEach((prod) => {
        if (el.id != prod.id) {
          prod.classList.add("none");
        }
        if (el.id == prod.id) {
          prod.classList.remove("none");
        } else if (el.id == 0) {
          prod.classList.remove("none");
        }
      });
    };
  });

  json.forEach((el) => {
    item.forEach((prod) => {
      if (el.id == prod.id) {
        prod.innerHTML += `
    <div class="category" id="${el.id}">
        ${el.name}
    </div>
        `;
      }
    });
  });

  let category = document.querySelectorAll(".category");

  category.forEach((el) => {
    el.onclick = () => {
      item.forEach((prod) => {
        if (el.id != prod.id) {
          prod.classList.add("none");
        }
      });
    };
  });

  let buyBtn = document.querySelectorAll(".buy-btn");
  let price = document.querySelectorAll(".price");
  let name = document.querySelectorAll(".name");

  buyBtn.forEach((el) => {
    el.onclick = () => {
      price.forEach((priceEl) => {
        name.forEach((nameEl) => {
          if (el.id == priceEl.id && el.id == nameEl.id) {
            emptyBasketInfo.classList.add("none");

            postData({
              name: `${nameEl.innerText}`,
              price: `${priceEl.innerText}`,
            });
            basketList.innerHTML += `
    <li class="basket-item">
    <p>${nameEl.innerText}</p>
    <p>${priceEl.innerText}</p>
</li>`;
            basketCounter.innerText = basketList.childElementCount;
          }
        });
      });
    };
  });
}

async function getProduct() {
  let response = await fetch("http://localhost:3000/products");
  let data = await response.json();
  let json = await data;
  let hash = window.location.hash;

  main.innerHTML = "";
  root.classList.remove("cart-class");

  json.forEach((el) => {
    main.innerHTML += `
<div class="product-item" data-id="${el.id}" id="${el.category}">
<a href="#${el.id}">
<div class="img product-img" data-id="${el.id}" >
    <img src="img/${el.img}" alt="" data-id="${el.id}" >
</div>
<div class="name" id="${el.id}" data-id="${el.id}">${el.title}</div>
</a>
<div class="details">
    <div class="price" id="${el.id}">${el.price} грн</div>
    <button class="buy-btn" id="${el.id}">buy</button>
</div>
</div>
`;
  });

  const items = document.querySelectorAll(".product-item");
  const menuBtns = document.querySelectorAll(".menu-btn");

  items.forEach((item) => {
    item.onclick = (e) => {
      json.forEach((el) => {
        if (e.target.dataset.id == el.id) {
          categoriesBlock.innerHTML = "";
          menuBtns.forEach((btn) => {
            btn.classList.remove("active");
          });

          root.innerHTML = "";
          root.innerHTML = `    <div class="item-details-block">
    <div >
      <img src="img/${el.img}" alt="" class="details-img">
  </div>
  <div class="details-info">
    <div class="details-name" id="${el.id}">${el.title}</div>
<div class="description">Description: ${el.description}</div>
<div class="color">color: ${el.color}</div>
<div class="guarantee">Guarantee: ${el.guarantee}</div>
<div class="camera">Camera: ${el.camera}</div>
<div class="memory">Memory: ${el.memory}</div>
<div class="price" id="${el.id}">Price: ${el.price} UAH</div>
<button class="buy-btn details-btn" id="${el.id}">buy</button>
  </div>
  </div>`;
        }
      });
    };
  });

  json.forEach((el) => {
    if (hash == "#" + el.id) {
      categoriesBlock.innerHTML = "";

      root.innerHTML = "";

      root.innerHTML = `    <div class="item-details-block">
    <div >
      <img src="img/${el.img}" alt="" class="details-img">
  </div>
  <div class="details-info">
    <div class="details-name" id="${el.id}">${el.title}</div>
<div class="description">Description: ${el.description}</div>
<div class="color">color: ${el.color}</div>
<div class="guarantee">Guarantee: ${el.guarantee}</div>
<div class="camera">Camera: ${el.camera}</div>
<div class="memory">Memory: ${el.memory}</div>
<div class="price" id="${el.id}">Price: ${el.price} UAH</div>
<button class="buy-btn details-btn" id="${el.id}">buy</button>
  </div>
  </div>`;
    }
  });
}

async function postData(data = {}) {
  let response = await fetch("http://localhost:3000/basket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let inf = await response.json();
  let json = await inf;
}

basketBtn.onclick = () => {
  if (basketList.childElementCount > 0) {
    emptyBasketInfo.classList.add("none");
  }
  productsInBasket.classList.toggle("none");
  getData();
};

async function getData() {
  let response = await fetch("http://localhost:3000/basket");
  let data = await response.json();
  let json = await data;

  categoriesBlock.innerHTML = "";

  root.innerHTML = "";
  root.classList.add("cart-class");
  json.forEach((el) => {
    root.innerHTML += `
    <div class="basket-item">
    <p>${el.name}</p>
    <p>${el.price}</p>
</div>
`;
  });

  basketCounter.innerText = json.length;
}

pageToggle();

function pageToggle() {
  const menuBtns = document.querySelectorAll(".menu-btn");
  menuBtns.forEach((btn) => {
    btn.onclick = (e) => {
      const page = btn.hash;
      render(page);
      menuBtns.forEach((el) => {
        el.classList.remove("active");
      });

      btn.classList.add("active");
    };
  });
}

function render(page) {
  let hash = window.location.hash;

  const menuBtns = document.querySelectorAll(".menu-btn");
  menuBtns.forEach((btn) => {
    if (hash == btn.hash) {
      btn.classList.add("active");
    }
  });

  switch (page) {
    case "":

      getProduct();
      getCategory();


      break;
    case "#cart":
      getData();

      break;
    case "#admin":
      adminPage();
      break;

    default:
      getProduct();
  }
}

function adminPage() {
  root.classList.remove("cart-class");

  categoriesBlock.innerHTML = "";
  root.innerHTML = "";

  root.innerHTML = `
 <div class="admin-block">
 <div class="inputs-block">
        <form name="prodsForm" action="#" class="form">
          <h4>add new product</h4>
          <div class="id-block input-block">
            <p class="input-p">id:</p>
            <input type="text" name="id" class="id input" disabled />
          </div>
          <div class="title-block input-block">
            <p class="input-p">title:</p>
            <input type="text" name="title" class="title input" />
          </div>
          <div class="price-block input-block">
            <p class="input-p">price:</p>
            <input type="text" name="price" class="price input" />
          </div>
          <div class="img-block input-block">
          <p class="input-p">img url:</p>
          <input type="text" name="img" class="img-inp input" />
        </div>
          <div class="description-block input-block">
          <p class="input-p">description:</p>
          <input type="text" name="description" class="description input" />
        </div>
        <div class="guarantee-block input-block">
          <p class="input-p">guarantee:</p>
          <input type="text" name="description" class="guarantee input" />
        </div>
        <div class="color-block input-block">
          <p class="input-p">color:</p>
          <input type="text" name="color" class="color input" />
        </div>
        <div class="memory-block input-block">
          <p class="input-p">memory:</p>
          <input type="text" name="memory" class="memory input" />
        </div>
        <div class="camera-block input-block">
          <p class="input-p">camera:</p>
          <input type="text" name="camera" class="camera input" />
        </div>
        <div class="category-block input-block">
        <p class="input-p">category (1 if laptop, 2 if smartphone):</p>
        <input type="text" name="category" class="category-inp input" />
      </div>
          <button type="submit" name="btnSubmit" class="submit-btn">
            done
          </button>
          <p>
            <input type="checkbox" name="" id="" class="delete-checkbox" />
            DELETE
          </p>
        </form>
      </div>
      <div class="selector-block">
        <h4>edit/delete the product</h4>
        <select name="" id="" class="selector">
          <option value="9999">select the product</option>
        </select>
      </div>
      </div>
     
 `;

  const btnSubmit = document.querySelector(".submit-btn");
  const form = document.querySelector(".form");
  const fieldsData = form.fieldsData;
  let titleInp = document.querySelector(".title");
  let priceInp = document.querySelector(".price");
  let idInp = document.querySelector(".id");
  let descriptionInp = document.querySelector(".description");
  let imgInp = document.querySelector(".img-inp");
  let memoryInp = document.querySelector(".memory");
  let cameraInp = document.querySelector(".camera");
  let colorInp = document.querySelector(".color");
  let guaranteeInp = document.querySelector(".guarantee");
  let categoryInp = document.querySelector(".category-inp");
  const selector = document.querySelector(".selector");
  const deleteCheckbox = document.querySelector(".delete-checkbox");

  async function postData(data = {}) {
    let response = await fetch("  http://localhost:3000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let inf = await response.json();
    let json = await inf;
  }

  btnSubmit.onclick = (e) => {
    e.preventDefault();

    if (idInp.value != "") {
      if (deleteCheckbox.checked) {
        deleteData(idInp.value);
      } else {
        editData(idInp.value, {
          title: `${titleInp.value}`,
          price: `${priceInp.value}`,
          img: `${imgInp.value}`,
          color: `${colorInp.value}`,
          memory: `${memoryInp.value}`,
          description: `${descriptionInp.value}`,
          memory: `${memoryInp.value}`,
          camera: `${cameraInp.value}`,
          guarantee: `${guaranteeInp.value}`,
          category: `${categoryInp.value}`,
        });
      }
    } else {
      postData({
        title: `${titleInp.value}`,
        price: `${priceInp.value}`,
        img: `${imgInp.value}`,
        color: `${colorInp.value}`,
        memory: `${memoryInp.value}`,
        description: `${descriptionInp.value}`,
        memory: `${memoryInp.value}`,
        camera: `${cameraInp.value}`,
        guarantee: `${guaranteeInp.value}`,
        category: `${categoryInp.value}`,
      });
    }

    selector.value = "9999";
    titleInp.value = "";
    priceInp.value = "";
    idInp.value = "";
    colorInp.value = "";
    cameraInp.value = "";
    memoryInp.value = "";
    guaranteeInp.value = "";
    descriptionInp.value = "";
    imgInp.value = "";
    categoryInp.value = "";
  };

  selector.onclick = () => {
    selector.innerHTML = `<option value="9999">select the product</option>`;
    getData();
  };

  async function getData() {
    let response = await fetch("http://localhost:3000/products");
    let data = await response.json();
    let json = await data;

    json.forEach((el) => {
      selector.innerHTML += `
    <option value="${el.id}">${el.title}</option>
    `;
    });

    selector.onchange = () => {
      idInp.value = selector.value;
      json.forEach((el) => {
        if (el.id == selector.value) {
          titleInp.value = el.title;
          priceInp.value = el.price;
          colorInp.value = el.color;
          cameraInp.value = el.camera;
          memoryInp.value = el.memory;
          guaranteeInp.value = el.guarantee;
          descriptionInp.value = el.description;
          imgInp.value = el.img;
          categoryInp.value = el.category;
        }
      });
    };
  }

  async function deleteData(id) {
    let response = await fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    let json = await data;
  }

  async function editData(id, newData) {
    let response = await fetch(`http://localhost:3000/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    let data = await response.json();
    let json = await data;
  }
}
