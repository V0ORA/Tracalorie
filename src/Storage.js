class Storage {
  // Get and set limit calories
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }

  // Get and set total calories
  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem("totalCalories");
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem("totalCalories", calories);
  }

  // Get and Save and Delete meals and workouts in the DOM and in localStorage:
  static getData(type) {
    let data;
    if (localStorage.getItem(type) === null) {
      data = [];
    } else {
      data = JSON.parse(localStorage.getItem(type));
    }
    return data;
  }

  static saveData(data, type) {
    const storedData = Storage.getData(type);
    storedData.push(data);
    localStorage.setItem(type, JSON.stringify(storedData));
  }

  static removeDataById(id, type) {
    const data = Storage.getData(type);
    data.forEach((item, index) => {
      if (item.id === id) {
        data.splice(index, 1);
      }
    });
    localStorage.setItem(type, JSON.stringify(data));
  }

  // Reset and clear All
  static clearAll() {
    localStorage.removeItem("totalCalories");
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");
  }
}

export default Storage;
