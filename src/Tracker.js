import Storage from './Storage';

class CalorieTracker {
	constructor() {
		this._calorieLimit = Storage.getCalorieLimit();
		this._totalCalories = Storage.getTotalCalories();
		this._meals = Storage.getMeals();
		this._workouts = Storage.getWorkouts();

		this._displayCalorieLimit();
		this._displayCaloriesTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayCaloriesRemiaining();
		this._displayCaloriesProgress();

		document.getElementById('limit').value = this._calorieLimit;
	}

	// Public Methods //
	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;
		Storage.updateTotalCalories(this._totalCalories);
		Storage.saveMeal(meal);
		this._displayNewMeal(meal);
		this._render();
	}

	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;
		Storage.updateTotalCalories(this._totalCalories);
		Storage.saveWorkout(workout);
		this._displayNewWorkout(workout);
		this._render();
	}

	removeMeal(id) {
		const index = this._meals.findIndex((meal) => meal.id === id);
		if (index !== -1) {
			const meal = this._meals[index];
			this._totalCalories -= meal.calories;
			Storage.updateTotalCalories(this._totalCalories);
			this._meals.splice(index, 1);
			Storage.removeMeal(id);
			this._render();
		}
	}

	removeWorkout(id) {
		const index = this._workouts.findIndex((workout) => workout.id === id);
		if (index !== -1) {
			const workout = this._workouts[index];
			this._totalCalories += workout.calories;
			Storage.setTotalCalories(this._totalCalories);
			this._workouts.splice(index, 1);
			Storage.removeWorkout(id);
			this._render();
		}
	}

	reset() {
		this._totalCalories = 0;
		this._meals = [];
		this._workouts = [];
		Storage.clearAll();
		this._render();
	}

	setLimit(calorieLimit) {
		this._calorieLimit = calorieLimit;
		Storage.setCalorieLimit(calorieLimit);
		this._displayCalorieLimit();
		this._render();
	}

	loadItems() {
		this._meals.forEach((meal) => this._displayNewMeal(meal));
		this._workouts.forEach((workout) => this._displayNewWorkout(workout));
	}

	// Private Methods //
	_displayCaloriesTotal() {
		const totalCaloriesEl = document.getElementById('calories-total');
		totalCaloriesEl.innerHTML = this._totalCalories;
	}

	_displayCalorieLimit() {
		const calorieLimitEl = document.getElementById('calories-limit');
		calorieLimitEl.innerHTML = this._calorieLimit;
	}

	_displayCaloriesConsumed() {
		const caloriesConsumedEl = document.getElementById('calories-consumed');
		const consumed = this._meals.reduce(
			(total, meal) => total + meal.calories,
			0
		);
		caloriesConsumedEl.innerHTML = consumed;
	}

	_displayCaloriesBurned() {
		const caloriesBurnedEl = document.getElementById('calories-burned');
		const burned = this._workouts.reduce(
			(total, workout) => total + workout.calories,
			0
		);
		caloriesBurnedEl.innerHTML = burned;
	}

	_displayCaloriesRemiaining() {
		const caloriesRemainingEl = document.getElementById('calories-remaining');
		const remaining = this._calorieLimit - this._totalCalories;
		caloriesRemainingEl.innerHTML = remaining;

		if (remaining <= 0) {
			caloriesRemainingEl.parentElement.parentElement.classList.remove(
				'bg-light'
			);
			caloriesRemainingEl.parentElement.parentElement.classList.add(
				'bg-danger'
			);
		} else {
			caloriesRemainingEl.parentElement.parentElement.classList.remove(
				'bg-danger'
			);
			caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
		}
	}

	_displayCaloriesProgress(remaining) {
		const progressEl = document.getElementById('calorie-progress');
		const progress = (this._totalCalories / this._calorieLimit) * 100;
		const width = Math.min(progress, 100);
		progressEl.style.width = `${progress}%`;
		if (width === 100) {
			progressEl.classList.add('bg-danger');
		} else {
			progressEl.classList.remove('bg-danger');
		}
	}

	_displayNewMeal(meal) {
		const mealItemsEl = document.getElementById('meal-items');
		const mealItemEl = document.createElement('div');
		mealItemEl.classList.add('card', 'my-2');
		mealItemEl.setAttribute('data-id', meal.id);

		mealItemEl.innerHTML = `
		<div class="card-body">
			<div class="d-flex align-items-center justify-content-between">
				<h4 class="mx-1">${meal.name}</h4>
				<div
					class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
				>
					${meal.calories}
				</div>
				<button class="delete btn btn-danger btn-sm mx-2">
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>
		</div>
	</div>`;

		mealItemsEl.appendChild(mealItemEl);
	}

	_displayNewWorkout(workout) {
		const workoutItemsEl = document.getElementById('workout-items');
		const workoutItemEl = document.createElement('div');
		workoutItemEl.classList.add('card', 'my-2');
		workoutItemEl.setAttribute('data-id', workout.id);

		workoutItemEl.innerHTML = `
		<div class="card-body">
			<div class="d-flex align-items-center justify-content-between">
				<h4 class="mx-1">${workout.name}</h4>
				<div
					class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
				>
					${workout.calories}
				</div>
				<button class="delete btn btn-danger btn-sm mx-2">
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>
		</div>
	</div>`;

		workoutItemsEl.appendChild(workoutItemEl);
	}

	_render() {
		this._displayCaloriesTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayCaloriesRemiaining();
		this._displayCaloriesProgress();
	}
}

export default CalorieTracker;
