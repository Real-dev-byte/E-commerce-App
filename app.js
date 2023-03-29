import data from "./shoes.json" assert { type: "json" };

/***
 * gradients add background colors (light gray -> grey)/ beautification  , radius border
 * grid of shoes three columns
 * card should be overlay 1/4th image size
on pressing checkout button show items purchased.
continue shopping.
maintain inventory.
 */

const cartItems = {};

/**
 * No filters applied by default
 */
getFilteredProducts(null, null, null);

const form = document.getElementById("filter");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const selectedCategory = formData.get("category");
  const selectedGender = formData.get("gender");
  const selectedBrand = formData.get("brand");
  console.log(
    `Selected Values: ${selectedCategory}  ${selectedGender}  ${selectedBrand}`
  );

  getFilteredProducts(selectedCategory, selectedGender, selectedBrand);
});

function assignCouponEvents(product) {
  document.getElementById(`coupon${product["id"]}`).onclick = function () {
    couponHandler(product, removeCoupon, applyCoupon);
  };
}
function assignCartEvents(product) {
  document.getElementById(`reduce${product["id"]}`).onclick = function () {
    const id = `${product["id"]}`;
    const ele = document.getElementById(id);
    const qty =
      parseInt(ele.textContent) === 0
        ? parseInt(ele.textContent)
        : parseInt(ele.textContent) - 1;
    ele.innerHTML = qty;

    updateCartItems(id, { qty: qty });

    if (qty === 0) {
      //Show Add to Cart button and hide Qty counter
      const hiddenQtyCounter = document.getElementById("product" + id);
      hiddenQtyCounter.classList.add("hide");
      document.getElementById("add0" + id).classList.remove("hide");

      //remove coupon icon
      document.getElementById(`coupon${id}`).classList.add("hide");
      const ele = document.getElementById("price" + id);
      removeCoupon(ele, "np" + id);
    }
  };

  document.getElementById(`add${product["id"]}`).onclick = function () {
    const id = `${product["id"]}`;
    console.log("Increase qty for productId: ", id);
    const ele = document.getElementById(id);
    const currQty = parseInt(ele.textContent);
    if (currQty < product["items_left"]) {
      ele.innerHTML = currQty + 1;
      updateCartItems(id, { qty: currQty + 1 });
    }
  };

  document.getElementById(`add0${product["id"]}`).onclick = function () {
    const id = `${product["id"]}`;

    const ele = document.getElementById(id);
    const currQty = parseInt(ele.textContent);
    if (currQty < product["items_left"]) {
      const hiddenQtyCounter = document.getElementById("product" + id);
      hiddenQtyCounter.classList.remove("hide");
      document.getElementById("add0" + id).classList.add("hide");
      ele.innerHTML = currQty + 1;
      updateCartItems(id, { qty: currQty + 1 });

      //add coupon icon
      document.getElementById(`coupon${id}`).classList.remove("hide");
    }
  };
}
function removeCoupon(ele, npid) {
  ele.style.textDecoration = "none";
  const offerPrice = document.getElementById(npid);
  offerPrice.innerHTML = "";
  offerPrice.style.visibility = "hidden";
  offerPrice.style.display = "block";
}

function applyCoupon(ele, npid) {
  const price = parseInt(ele.textContent.replace(/[\s$]/g, ""));
  ele.style.textDecoration = "line-through";
  console.log(npid);
  const offerPrice = document.getElementById(npid);
  offerPrice.style.visibility = "visible";
  offerPrice.style.display = "block";
  offerPrice.innerHTML = "$" + 0.9 * price;
}
function couponHandler(product, removeCoupon, applyCoupon) {
  const id = `${product["id"]}`;
  const pid = "price" + id;
  const npid = "np" + id;
  const ele = document.getElementById(pid);
  if (ele.style.textDecoration === "line-through") {
    removeCoupon(ele, npid);
    updateCartItems(id, { couponApplied: false });
  } else {
    applyCoupon(ele, npid);
    updateCartItems(id, { couponApplied: true });
  }
}

function getFilteredProducts(selectedCategory, selectedGender, selectedBrand) {
  let productList = document.getElementById("products");
  document.getElementById("products").innerHTML = "";
  for (const prop in data) {
    if(data[prop]["items_left"] === 0){
      continue;
    }
    const isCategory =
      selectedCategory === null || data[prop]["category"] === selectedCategory;
    const isBrand =
      selectedBrand === null || data[prop]["brand"] === selectedBrand;
    const isGender =
      selectedGender === null || data[prop]["gender"] === selectedGender;

    if (isCategory === true && isBrand === true && isGender === true) {
      let li = document.createElement("li");
      var props = "";
      props += "<div>";
      props += `<img class="imagebox" src="${data[prop]["imageURL"]}"/>`;
      props += `<p>${data[prop]["name"]}</p>`;
      const discount =
        data[prop]["id"] in cartItems
          ? cartItems[data[prop]["id"]].discount
          : false;
      const qty =
        data[prop]["id"] in cartItems ? cartItems[data[prop]["id"]].qty : 0;

      if (discount && qty > 0) {
        console.log("Discount applied earlier before filtering to be retained");
        props += `<span><p class="price" id="price${data[prop]["id"]}" style="text-decoration: line-through;">$${data[prop]["price"]}</p> &nbsp;<i id="coupon${data[prop]["id"]}" class="fa fa-gift" aria-hidden="true"></i> </span>`;
        props +=
          `<p id="np${data[prop]["id"]}">$` +
          0.9 * data[prop]["price"] +
          `</p>`;
      } else if (!discount && qty > 0) {
        props += `<span><p class="price" id="price${data[prop]["id"]}">$${data[prop]["price"]}</p>&nbsp; <i id="coupon${data[prop]["id"]}" class="fa fa-gift" aria-hidden="true"></i> </span>`;
        props += `<p id="np${data[prop]["id"]}"></p>`;
      } else if (qty === 0) {
        props += `<span ><p class="price" id="price${data[prop]["id"]}">$${data[prop]["price"]}</p> &nbsp;<i id="coupon${data[prop]["id"]}" class="hide fa fa-gift" aria-hidden="true"></i> </span>`;
        props += `<p id="np${data[prop]["id"]}"></p>`;
      }

      if (qty === 0) {
        props += `<button class="add_to_cart" id = "add0${data[prop]["id"]}"> Add to Cart</button>`;
        props +=
          `<div class="hide" id = "product${data[prop]["id"]}"><button class="updatecart" id = "reduce${data[prop]["id"]}"><i class="fa-solid fa-minus fa-2xs"></i></button> <span id = "${data[prop]["id"]}"> ` +
          qty +
          ` </span> <button class="updatecart" id = "add${data[prop]["id"]}"><i class="fa-solid fa-plus fa-2xs"></i></button></div>`;
      } else {
        props += `<button class="add_to_cart hide" id = "add0${data[prop]["id"]}"> Add to Cart</button>`;
        props +=
          `<div class="" id = "product${data[prop]["id"]}"><button class="updatecart" id = "reduce${data[prop]["id"]}"><i class="fa-solid fa-minus fa-2xs"></i></button> <span id = "${data[prop]["id"]}"> ` +
          qty +
          ` </span> <button class="updatecart" id = "add${data[prop]["id"]}"><i class="fa-solid fa-plus fa-2xs"></i></button></div>`;
      }
      props += "</div>";

      li.innerHTML = props;
      productList.appendChild(li);
      assignCartEvents(data[prop]);

      assignCouponEvents(data[prop]);
    }
  }
}

function updateCartItems(productId, productObj) {
  if ("couponApplied" in productObj) {
    cartItems[productId].discount = productObj.couponApplied;
  } else if (productId in cartItems) { 
    if (productObj.qty === 0) {
      delete cartItems[productId];
    } else {
      cartItems[productId].qty = productObj.qty;
    }
  } else {
    cartItems[productId] = { qty: productObj.qty, discount: false };
  }
}

document.getElementById("cart").onclick = function (event) {
  console.log("Items in the cart are: ", cartItems);

  let productList = document.getElementById("buy");
  document.getElementById("buy").innerHTML = "";

  var totalPrice = 0, itemCount = 0;
  for (let itemId in cartItems) {
    console.log(itemId, cartItems[itemId]);

    let li = document.createElement("li");
    var props = "";
    props += `<div style="display: block;">`;
    props += `<img class="buyimagebox" src="${data[itemId-1]["imageURL"]}"/>`;
    props += `<div style="display: flex; flex-direction: column; float: left;">`;
    props += `<p  style=" float: left; margin-left: 10px;">${data[itemId-1]["name"]}</p>`;
    props += `<p  style=" text-align: left; margin-left: 10px;">Qty: ${cartItems[itemId].qty}</p>`;
    itemCount += cartItems[itemId].qty;
    if(cartItems[itemId].discount){
      totalPrice += parseInt(cartItems[itemId].qty*0.9*data[itemId-1]["price"]);
      props += `<p  style=" text-align: left; margin-left: 10px;">Price: $${0.9*data[itemId-1]["price"]}</p>`;
    }else{
      totalPrice += parseInt(cartItems[itemId].qty*data[itemId-1]["price"]);
      props += `<p  style=" text-align: left; margin-left: 10px;">Price: $${data[itemId-1]["price"]}</p>`;
    }

    props += `</div>`;
    props += "</div>";

    li.innerHTML = props;
    productList.appendChild(li);
  }


  if(Object.keys(cartItems).length){
    let total = document.getElementById("total");
    total.innerHTML = "Subtotal ("+ itemCount +" items):   $" + totalPrice;
  }
    
  


  document.getElementById("overlay").style.display = "block";
};


document.getElementById("overlay").onclick = function (event) {
  document.getElementById("overlay").style.display = "none";
};


document.getElementById("buynow").onclick = function (event) {
  console.log('Items Ordered', cartItems)
  
  //update inventory
  for(let key in cartItems){
    data[key-1]["items_left"] -= cartItems[key].qty;
  }

  Object.keys(cartItems).forEach(key => delete cartItems[key]);
  getFilteredProducts(null, null, null);
};
