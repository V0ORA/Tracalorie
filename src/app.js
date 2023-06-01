import { Modal, Collapse } from "bootstrap";
import CalorieTracker from "./Tracker";
import { Meal, Workout } from "./Item";
import { alertMessageTimeout, addEvent } from "./Utils";

import "./css/bootstrap.css";
import "./css/style.css";
import "./css/fontawesome.css";

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._tracker.loadItems();

    addEvent("meal-form", "submit", this._newItem.bind(this, "meal"));
    addEvent("workout-form", "submit", this._newItem.bind(this, "workout"));
    addEvent("meal-items", "click", this._removeItem.bind(this, "meal"));
    addEvent("workout-items", "click", this._removeItem.bind(this, "workout"));
    addEvent("filter-meals", "keyup", this._filterItems.bind(this, "meal"));
    addEvent("filter-workouts", "keyup", this._filterItems.bind(this, "workout"));
    addEvent("reset", "click", this._reset.bind(this));
    addEvent("limit-form", "submit", this._setLimit.bind(this));
  }

  // Adding meal or workout
  _newItem(type, e) {
    e.preventDefault();
    let name = document.getElementById(`${type}-name`);
    let calories = document.getElementById(`${type}-calories`);

    // Alert if form values are empty
    if (name.value === "" || calories.value === "") {
      alertMessageTimeout();
    }

    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new Collapse(collapseItem, {
      toggle: true,
    });
  }

  // Remove item
  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete" || e.target.classList.contains("fa-xmark"))
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").dataset.id;
        type === "meal"
          ? this._tracker.removeItemById(id, "meal")
          : this._tracker.removeItemById(id, "workout");

        e.target.closest(".card").remove();
      }
    }
  }

  // Filter item
  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .mx-1`).forEach((item) => {
      const name = item.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.closest(".card").style.display = "block";
      } else {
        item.closest(".card").style.display = "none";
      }
    });
  }

  // Reset day
  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }

  // Set limit calories

  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById("limit");

    if (limit.value === "") {
      alertMessageTimeout();
    }

    this._tracker.setLimit(+limit.value);
    limit.value = this._tracker._calorieLimit;

    // Close bootstrap modal
    const modalEl = document.getElementById("limit-modal");
    const modal = Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
