const drinksListURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic"; //list of names and images
const drinkdetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="; //Lookup full drink details by id
const searchBtn = document.getElementById('searchBtn');
let drinkSelect = document.getElementById('mocktailSelect');
let resultCard = document.getElementById('resultCard');

window.addEventListener("load", printDrinksList);

async function getDrinksList() {
  try {
    const response = await fetch(drinksListURL);   
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
async function printDrinksList(){
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
searchBtn.addEventListener("click", function () {
  //adding selected id in drinkURL  
  let drinkURL = drinkdetailsURL + drinkSelect.value;
  getDrinkDetails(drinkURL);
  return drinkURL;
});
async function getDrinkDetails(drinkURL) {
  try {
    const response = await fetch(drinkURL);   
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();   
    let drinkDetailsResponse = await data.drinks;
    let drinkDetails = drinkDetailsResponse[0];
    // getting ingredients
    let ingredients = getIngredientsList(drinkDetails);
    // Print ingredients
    printIngredients(ingredients);
  } catch (error) {
    console.error('Failed to fetch non-alcoholic drinks:', error);
  }
}
function getIngredientsList(drinkDetails) {
  let ingredients = [];
  for (let i = 1; i <= 15; i++) {
    let ingredient = drinkDetails[`strIngredient${i}`];
    let measure = drinkDetails[`strMeasure${i}`];
    //discarding ingredients with empty value. 
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        ingredient,
        measure: measure ? measure.trim() : "N/A", //discarding empty measures with ternary operator
      });
    }      
  }
  return ingredients;
}
function printIngredients(ingredients) {
  resultCard.innerHTML = "Ingredients:<br>";
  ingredients.forEach(ing => {
    resultCard.innerHTML += `- ${ing.ingredient} (${ing.measure})<br>`;
  });
}

