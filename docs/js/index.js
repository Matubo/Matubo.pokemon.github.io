document.addEventListener("DOMContentLoaded", changeOption());

function setPreloaderStatus(obj) {
  let preloader = document.getElementById("preloader");
  if (obj.option == "REMOVE") {
    preloader.style.cssText = "display: none;";
  }
  if (obj.option == "ADD") {
    preloader.style.cssText = "display: block;";
  }
}

function changeOption() {
  let select_elem = document.getElementById("form_select");
  select_elem.onchange = function () {
    if (select_elem.value == "option1") {
      change_DOM({ type: "first_option" });
    }
    if (select_elem.value == "option2") {
      change_DOM({ type: "second_option" });
    }
    if (select_elem.value == "option3") {
      change_DOM({ type: "third_option" });
    }
  };
}

function change_DOM(option) {
  if (option.type == "first_option") {
    document.getElementById("id").removeAttribute("disabled");
    document.getElementById("count").setAttribute("disabled", "disabled");
    document.getElementById("name").setAttribute("disabled", "disabled");
    document.getElementById("input_about").innerHTML = "Номер от 1.";
  }
  if (option.type == "second_option") {
    document.getElementById("id").removeAttribute("disabled");
    document.getElementById("count").removeAttribute("disabled");
    document.getElementById("name").setAttribute("disabled", "disabled");
    document.getElementById("input_about").innerHTML = "Номер от 1 и диапазон.";
  }
  if (option.type == "third_option") {
    document.getElementById("id").setAttribute("disabled", "disabled");
    document.getElementById("count").setAttribute("disabled", "disabled");
    document.getElementById("name").removeAttribute("disabled");
    document.getElementById("input_about").innerHTML =
      "Имя по английски в любом регистре.";
  }
}

function clear_result_box() {
  let element = document.getElementById("result");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

async function request() {
  clear_result_box();

  let option = document.getElementById("form_select").value;
  let id = document.getElementById("id").value;
  let count = document.getElementById("count").value;
  let name = document.getElementById("name").value.toLowerCase();

  if (option == "option1") {
    setPreloaderStatus({ option: "ADD" });
    let result = await fetch_request({
      request: "GETONEID",
      id: id,
      count: count,
    });
    createDOM(result);
    setPreloaderStatus({ option: "REMOVE" });
  }

  if (option == "option2") {
    setPreloaderStatus({ option: "ADD" });
    let results = await fetch_request({
      request: "GETSOMEID",
      id: id - 1,
      count: count,
    });
    results = results["results"];
    let urls = [];
    for (let i = 0; i < results.length; i++) {
      urls.push(results[i]["url"]);
    }
    let result = await fetch_request({
      request: "GETBYURL",
      urls: urls,
    });
    for (let i = 0; i < result.length; i++) {
      createDOM(result[i]);
    }
    setPreloaderStatus({ option: "REMOVE" });
  }

  if (option == "option3") {
    setPreloaderStatus({ option: "ADD" });
    let result = await fetch_request({
      request: "GETBYNAME",
      name: name,
    });
    createDOM(result);
    setPreloaderStatus({ option: "REMOVE" });
  }
}

function errors_catching(err) {
  console.log(err);
  setPreloaderStatus({ option: "REMOVE" });
}

async function fetch_request(obj) {
  switch (obj.request) {
    case "GETONEID": {
      let result = await fetch(`https://pokeapi.co/api/v2/pokemon/${obj.id}`)
        .then((response) => response.json())
        .catch((error) => errors_catching(error))
        .then((data) => {
          return data;
        });
      return result;
    }
    case "GETSOMEID": {
      let result = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${obj.count}&offset=${obj.id}`
      )
        .then((response) => response.json())
        .catch((error) => errors_catching(error))
        .then((data) => {
          return data;
        });
      return result;
    }

    case "GETBYURL": {
      let requests = obj.urls.map((url) => fetch(url));
      let result = Promise.all(requests)
        .then((responses) => {
          return responses;
        })
        .catch((error) => errors_catching(error))
        .then((responses) => Promise.all(responses.map((r) => r.json())))
        .then((data) => {
          return data;
        });

      return result;
    }

    case "GETBYNAME": {
      let result = await fetch(`https://pokeapi.co/api/v2/pokemon/${obj.name}`)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      return result;
    }
  }
}

function createDOM(data) {
  let result_div = document.getElementById("result");

  let id, name_div, image, elem, height, weight;

  elem = document.createElement("div");
  elem.className = "card";

  id = document.createElement("div");
  id.className = "card_id";
  id.innerHTML = `id: ${data["id"]}`;

  name_div = document.createElement("div");
  name_div.className = "card_name";
  name_div.innerHTML = `name: ${data["species"]["name"]}`;

  height = document.createElement("div");
  height.className = "card_height";
  height.innerHTML = `height: ${data["height"]}`;

  weight = document.createElement("div");
  weight.className = "card_weight";
  weight.innerHTML = `weight: ${data["weight"]}`;

  image = document.createElement("img");
  image.className = "card_image";
  if (data["sprites"]["front_default"]) {
    image.src = data["sprites"]["front_default"];
  } else {
    image.src = "img/noimage.png";
  }
  elem.append(image, id, name_div, height, weight);

  result_div.append(elem);
}
