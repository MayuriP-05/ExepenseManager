
const username=document.querySelector(".user-name");
username.innerHTML=localStorage.getItem("name");
// console.log(username.innerHTML);
// console.log(localStorage.getItem("name"));

function logOut(){
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    window.location.href="index.html"
}
document.addEventListener("DOMContentLoaded",() =>{
const form = document.querySelector('form');
const incomeList = document.getElementById("income-list");
const totalIncomeElement = document.getElementById("total-incomee");
const incomeChartElement = document.getElementById('incomeChart');

let incomes = JSON.parse(localStorage.getItem('incomes')) || [];

// Function to get the icon class based on the category
function getIconClass(category) {
    switch (category.toLowerCase()) {
        case 'salary':
            return 'fa-briefcase';
        case 'freelancing':
            return 'fa-laptop-code';
        case 'investments':
            return 'fa-chart-line';
        case 'stocks':
            return 'fa-chart-pie';
        case 'bitcoin':
            return 'fa-bitcoin';
        case 'bank':
            return 'fa-university';
        case 'youtube':
            return 'fa-youtube';
        case 'other':
            return 'fa-ellipsis-h';
        default:
            return 'fa-money-bill-wave';
    }
}

// Function to add income to the UI
function addIncome() {
    incomeList.innerHTML = ""; // Clear the current list to avoid duplications

    incomes.forEach(income => {
        const li = document.createElement('li');
        li.className = 'income-card';
        li.dataset.id = income.id;  // Set a custom data attribute for the ID

        const iconClass = getIconClass(income.salaryCategory);  // Get the appropriate icon class

        li.innerHTML = `
            <div class="income-logo">
                <i class="fa-solid ${iconClass}"></i>
            </div>
            <div class="income-info">
                <div class="income-source">
                    <p><i class="fa-solid fa-circle fa-2xs" style="color:#2d9c2b;"></i>${income.salaryCategory}</p>
                </div>
                <div class="income-detail">
                    <p>₹${income.salaryAmount}</p>
                    <p><span><i class="fa-solid fa-calendar" styele="color:#213b50;"></i></span>${income.salaryDate}</p>
                    <p><i class="fa-light fa-comment"></i>${income.salaryDescription}</p>
                </div>
            </div>
            <div class="income-bin">
                <i class="fa-solid fa-trash" onclick="deleteIncome(${income.id})"></i>
            </div>
        `;
    

        incomeList.appendChild(li);
    });

    calculateTotalIncome(); // Call the function to calculate and display total income
}

// Initial call to display existing incomes
addIncome();



// Function to calculate total income
function calculateTotalIncome() {
    const totalIncome = incomes.reduce((total, income) => {
        return total + parseFloat(income.salaryAmount);
    }, 0);

    // Update the UI to display the total income
    totalIncomeElement.textContent = `Total Income: ₹${totalIncome.toFixed(2)}`;
}
function deleteIncome(id) {
    // Filter out the income to be deleted
    incomes = incomes.filter(income => income.id !== id);
    // Update localStorage
    localStorage.setItem('incomes', JSON.stringify(incomes));
    // Refresh the UI
    addIncome();
    updateIncomeChart();
}
window.deleteIncome = deleteIncome;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Capture form data
    const salaryTitle = document.getElementById("salary-title").value;
    const salaryAmount = document.getElementById("salary-amount").value;
    const salaryDate = document.getElementById("salary-date").value;
    const salaryCategory = document.getElementById("category").value;
    const salaryDescription = document.getElementById("description").value;

    // Create an income object
    const income = {
        id: Date.now(),
        salaryTitle,
        salaryAmount,
        salaryDate,
        salaryCategory,
        salaryDescription
    };

    // Optional: Handle future dates (e.g., log a warning, show an alert)
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    if (salaryDate.split('T')[0] > today) {
        window.alert("income date can't be of future")
        document.getElementById("salary-date").value = ''; // Reset the date field
        return; // Prevent further processing
        // console.log('This income date is in the future.');
        // You can add more handling code here, such as an alert or a warning message
    }

    incomes.push(income);
    localStorage.setItem("incomes", JSON.stringify(incomes));

    // Refresh the income list in the UI
    addIncome();
    updateIncomeChart();
    // Clear the form fields after submission
    form.reset();
});
let incomeChart;

function updateIncomeChart() {
    // Aggregate income by category
    const categories = [...new Set(incomes.map(income => income.salaryCategory))];
    const data = categories.map(category => {
        return incomes
            .filter(income => income.salaryCategory === category)
            .reduce((total, inc) => total + parseFloat(inc.salaryAmount), 0);
    });

    const ctx = incomeChartElement.getContext('2d');
    
    if (incomeChart) {
        incomeChart.destroy(); // Ensure old chart is removed
    }

    incomeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Income',
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#C9CBCF', '#36A2EB'
                ],
                borderColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#C9CBCF', '#36A2EB'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Add initial calls to update charts
addIncome();
// updateExpenseChart();
updateIncomeChart();
});