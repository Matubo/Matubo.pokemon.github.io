document.addEventListener("DOMContentLoaded", test());

function test() {
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
    document.getElementById("input_about").innerHTML =
      "Номер от 1, элемент вне диапазона вернет ошибку.";
  }
  if (option.type == "second_option") {
    document.getElementById("id").removeAttribute("disabled");
    document.getElementById("count").removeAttribute("disabled");
    document.getElementById("name").setAttribute("disabled", "disabled");
    document.getElementById("input_about").innerHTML =
      "Номер от 1 и диапазон, элемент вне диапазона вернет ошибку.";
  }
  if (option.type == "third_option") {
    document.getElementById("id").setAttribute("disabled", "disabled");
    document.getElementById("count").setAttribute("disabled", "disabled");
    document.getElementById("name").removeAttribute("disabled");
    document.getElementById("input_about").innerHTML =
      "Имя по английски в любом регистре, элемент вне диапазона вернет ошибку.";
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
    let result = await fetch_request({
      request: "GETONEID",
      id: id,
      count: count,
    });
    createDOM(result);
  }

  if (option == "option2") {
    let results = await fetch_request({
      request: "GETSOMEID",
      id: id,
      count: count,
    });
    results = results["results"];
    let i = 0;
    while (i < results.length) {
      let result = await fetch_request({
        request: "GETBYURL",
        url: results[i]["url"],
      });
      createDOM(result);
      i++;
    }
  }

  if (option == "option3") {
    let result = await fetch_request({
      request: "GETBYNAME",
      name: name,
    });
    createDOM(result);
  }
}

async function fetch_request(obj) {
  switch (obj.request) {
    case "GETONEID": {
      let result = await fetch(`https://pokeapi.co/api/v2/pokemon/${obj.id}`)
        .then((response) => response.json())
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
        .then((data) => {
          return data;
        });
      return result;
    }
    case "GETBYURL": {
      let result = await fetch(obj.url)
        .then((response) => response.json())
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

  let id, name_div, image, elem;

  elem = document.createElement("div");
  elem.className = "card";

  id = document.createElement("div");
  id.className = "card_id";
  id.innerHTML = `id: ${data["id"]}`;

  name_div = document.createElement("div");
  name_div.className = "card_name";
  name_div.innerHTML = `name: ${data["species"]["name"]}`;

  image = document.createElement("img");
  image.className = "card_image";
  image.src = data["sprites"]["front_default"];

  elem.append(image, id, name_div);

  result_div.append(elem);
}
