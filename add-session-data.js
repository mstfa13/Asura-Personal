// Script to add session data to gym store
// Run this in the browser console when on the gym page

// Session data from user
const sessionData = {
  push: [
    { name: "Flat db press", weight: 25, reps: 8, note: "2nd set 5r" },
    { name: "Flat B-Press machine", weight: 50, reps: 9 },
    { name: "Incline db press", weight: 25, reps: 8 },
    { name: "Incline B-Press machine", weight: 55, reps: 10 },
    { name: "High to low cable fly", weight: 25, reps: 9 },
    { name: "Tri rope pushdown", weight: 45, reps: 9 },
    { name: "Overhead cable bar extensions", weight: 40, reps: 9 },
    { name: "Db lateral raises", weight: 10, reps: 10 },
    { name: "Cable lateral raises", weight: 10, reps: 8 },
    { name: "Shoulder press machine", weight: 25, reps: 8 }
  ],
  pull: [
    { name: "Wide Lat pulldown", weight: 54, reps: 10 },
    { name: "Narrow seated rows", weight: 60, reps: 7 },
    { name: "Wide seated rows", weight: 80, reps: 7 },
    { name: "Rope face pulls", weight: 60, reps: 8 },
    { name: "SA Cable Rear Delt Fly", weight: null, reps: null, note: "no entry" },
    { name: "Bar Curls", weight: 20, reps: 9 },
    { name: "Db Preacher curl", weight: 10, reps: 7 },
    { name: "Behind back cable curls", weight: 50, reps: 10 },
    { name: "Rope Bicep curl", weight: 25, reps: 10 },
    { name: "Cable bar shrugs", weight: 50, reps: 10 }
  ],
  legs: [
    { name: "Romanian Deadlift", weight: null, reps: null, note: "no entry" },
    { name: "Bar squat", weight: 100, reps: 9 },
    { name: "Hack squat", weight: 70, reps: 10 },
    { name: "Single Leg press", weight: 40, reps: 10 },
    { name: "Leg extensions", weight: 75, reps: 10 },
    { name: "Seated leg curls", weight: 35, reps: 10 },
    { name: "Bar hip thrust", weight: 35, reps: 12 },
    { name: "Seated Adduction machine", weight: 100, reps: 10 }
  ]
};

// Function to add exercises to store
function addSessionToGym() {
  const store = useActivityStore.getState();
  
  Object.entries(sessionData).forEach(([category, exercises]) => {
    exercises.forEach(exercise => {
      if (exercise.weight && exercise.reps) {
        // Create exercise ID from name
        const exerciseId = store.addGymExercise(exercise.name, category);
        // Add the weight/reps data
        store.addGymExerciseWeight(exerciseId, exercise.weight, exercise.reps, '9/26');
      }
    });
  });
  
  console.log('Added all session exercises to gym store!');
}

// Run it
addSessionToGym();
