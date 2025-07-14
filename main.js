const allDrinksURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic"; //list of names and images
const drinkDetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="; //Lookup full drink details by id
const searchBtn = document.getElementById('searchBtn');
const drinkSelect = document.getElementById('mocktailSelect');
const card = document.getElementById('card');
const resultContent = document.getElementById('resultContent');
const resultCard = document.getElementById('resultCard');
const goBackBtn = document.getElementById('goBackBtn');

window.addEventListener("load", printDrinksList);

async function getDrinksList() {
  try {
    const response = await fetch(allDrinksURL);   
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // The drinks array is under the "drinks" key   
    const drinksArray = await data.drinks;
    return drinksArray;
  } catch (error) {
    console.error('Failed to fetch non-alcoholic drinks:', error);
  }
}
async function printDrinksList() {
  try {
    const drinksListArray = await getDrinksList();
    drinksListArray.forEach(drink => {
      drinkSelect.innerHTML += 
      `<option value='${drink.idDrink}'>${drink.strDrink}</option>`;
      })
  } catch (error) {
      console.error("Error:", error);
    }
} 
async function getDrinkDetails(drinkURL) {
  try {
    const response = await fetch(drinkURL);   
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();   
    let drinkDetailsRes = await data.drinks;
    let drinkDetails = drinkDetailsRes[0];
    let name = drinkDetails.strDrink; 
    let glass = drinkDetails.strGlass;
    let photoURL = drinkDetails.strDrinkThumb;
    let ingredients = formatIngredients(drinkDetails);
    let instructions = drinkDetails.strInstructions;
    //Formating instructions
    instructions = instructions.split("-");
    for (let i = 0; i < instructions.length; i++) {
       instructions[i] = "<p>" + instructions[i] + "</p>";
    }
    instructions = instructions.join("");
    printDetails(name, instructions, glass, photoURL, ingredients);
  } catch (error) {
    console.error('Failed to fetch drink URL:', error);
  }
}
function formatIngredients(drinkDetails) {
  let ingredientsList = [];
  let ingAndMeasures = [];
  for (let i = 1; i <= 15; i++) {
    let ingredient = drinkDetails[`strIngredient${i}`];
    let measure = drinkDetails[`strMeasure${i}`]; 
    if (ingredient && ingredient.trim() !== "") {  //discarding ingredients with empty value.
      ingredientsList.push({
        ingredient,
        measure: (measure && measure.trim().toLowerCase() !== "n/a") ? measure.trim() : "", //discarding empty measures with ternary operator
      });
    }      
  }
  ingredientsList.forEach(ing => {
    ingAndMeasures += [`<li>${ing.ingredient} (${ing.measure})</li>`];
  });
  return ingAndMeasures;
}
function printDetails(name, instructions, glass, photoURL, ingredients) {
  resultContent.innerHTML = '';
  resultContent.innerHTML += 
  `<div id='textResult'>
      <h2>${name}</h2>
      <p><b>Ingredients:</b></p><ul>${ingredients}</ul>
      <p class='instructions'><b>Instructions:</b></p><p>${instructions}</p>
      <p class='glass'>Serve: ${glass}</p></div>
   <div class="picture"><img src='${photoURL}'></div>`
}
searchBtn.addEventListener("click", () => {
  //adding selected id in drinkURL  
  let drinkURL = drinkDetailsURL + drinkSelect.value;
  getDrinkDetails(drinkURL);
  //display only results
  card.classList.add("hide");
  resultCard.classList.remove("hide");
  return drinkURL;
});
goBackBtn.addEventListener("click", () => {
  resultCard.classList.add("hide");
  card.classList.remove("hide");
});

