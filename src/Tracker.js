import Storage from "./Storage";

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getData("meals");
    this._workout = Storage.getData("workouts");

    this._displayTotalCalories();
    this._displayCaloriesLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }

  // Public methods //
  addMeal(meal) {
    if (meal.name && meal.calories) {
      this._meals.push(meal);
      this._totalCalories += meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.saveData(meal, "meals");
      this._displayNewItem(meal, "meal");
      this._render();
    }
  }

  addWorkout(workout) {
    if (workout.name && workout.calories) {
      this._workout.push(workout);
      this._totalCalories -= workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.saveData(workout, "workouts");
      this._displayNewItem(workout, "workout");
      this._render();
    }
  }

  removeItemById(id, type) {
    const items = type === "meal" ? this._meals : this._workout;
    const index = items.findIndex((item) => item.id === id);

    if (index !== -1) {
      const item = items[index];
      if (type === "meal") {
        this._totalCalories -= item.calories;
      } else {
        this._totalCalories += item.calories;
      }
      Storage.updateTotalCalories(this._totalCalories);
      items.splice(index, 1);
      Storage.removeDataById(item.id, type + "s");
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workout = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewItem(meal, "meal"));
    this._workout.forEach((workout) => this._displayNewItem(workout, "workout"));
  }

  //Private Methods //
  _displayTotalCalories() {
    const totalCaloriesEL = document.getElementById("calories-total");
    totalCaloriesEL.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const limitCaloriesEl = document.getElementById("calories-limit");
    limitCaloriesEl.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById("calories-consumed");
    const consumed = this._meals.reduce((acc, curr) => acc + curr.calories, 0);
    caloriesConsumedEl.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("calories-burned");
    const burned = this._workout.reduce((acc, curr) => acc + curr.calories, 0);
    caloriesBurnedEl.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const progressEl = document.getElementById("calorie-progress");
    const caloriesRemainingEl = document.getElementById("calories-remaining");

    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = remaining;

    if (remaining <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove("bg-light");
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-danger");

      progressEl.classList.remove("bg-success");
      progressEl.classList.add("bg-danger");
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove("bg-danger");
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");

      progressEl.classList.remove("bg-danger");
      progressEl.classList.add("bg-success");
    }
  }

  _displayCaloriesProgress() {
    const progressEl = document.getElementById("calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;

    progressEl.style.width = `${percentage}%`;
  }

  _displayNewItem(item, type) {
    const itemsEl = document.getElementById(`${type}-items`);
    const itemEl = document.createElement("div");
    itemEl.classList.add("card", "my-2");
    itemEl.setAttribute("data-id", item.id);
    itemEl.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${item.name}</h4>
          <div class="fs-1 ${
            type === "meal" ? "bg-primary" : "bg-secondary"
          } text-white text-center rounded-2 px-2 px-sm-5">
            ${item.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `;

    itemsEl.appendChild(itemEl);
  }

  _render() {
    this._displayTotalCalories();
    this._displayCaloriesLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

export default CalorieTracker;
