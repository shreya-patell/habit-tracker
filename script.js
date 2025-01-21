const habitForm = document.getElementById('habitForm');
const habitNameInput = document.getElementById('habitName');
const habitList = document.querySelector('#habitList ul');
const chartCanvas = document.getElementById('chart');

let habits = [];
let chart;

habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const habitName = habitNameInput.value.trim();
  if (habitName === '') return;

  const habit = {
    name: habitName,
    progress: Array(7).fill(0), // Progress for each day of the week
  };
  
  habits.push(habit);
  habitNameInput.value = '';
  renderHabits();
  updateChart();
});

function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${habit.name}</span>
      <div class="habit-actions">
        <button class="done" onclick="markHabit(${index})">Done</button>
        <button class="reset" onclick="resetHabit(${index})">Reset</button>
      </div>
    `;
    habitList.appendChild(li);
  });
}

function markHabit(index) {
  const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  habits[index].progress[today] = 1;
  updateChart();
}

function resetHabit(index) {
  habits[index].progress.fill(0);
  updateChart();
}

function updateChart() {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const datasets = habits.map((habit) => ({
    label: habit.name,
    data: habit.progress,
    backgroundColor: createGradient(chartCanvas, habit.name),
    borderRadius: 8,
  }));

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: 'Poppins',
              size: 14,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: {
            stepSize: 1,
            callback: (value) => (value === 1 ? 'Done' : ''),
          },
        },
      },
    },
  });
}

function createGradient(canvas, name) {
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, `hsl(${Math.random() * 360}, 70%, 80%)`);
  gradient.addColorStop(1, `hsl(${Math.random() * 360}, 50%, 60%)`);
  return gradient;
}

renderHabits();
updateChart();
