
document.addEventListener("DOMContentLoaded",() =>{
    
const form = document.querySelector('form');
const expenseList = document.getElementById("expense-list");
const totalExpenseElement = document.getElementById("total-expense");
const expenseChartElement = document.getElementById('expenseChart');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
function getIconClass(category) {
    switch (category.toLowerCase()) {
        case 'education':
            return 'fa-book';
        case 'groceries':
            return 'fa-shopping-cart';
        case 'health':
            return 'fa-heartbeat';
        case 'subscriptions':
            return 'fa-newspaper';
        case 'takeaways':
            return 'fa-utensils';
        case 'clothing':
            return 'fa-tshirt';
        case 'travelling':
            return 'fa-plane';
        case 'other':
            return 'fa-ellipsis-h';
        default:
            return 'fa-money-bill-wave';
    }
}

function addExpense() {
    expenseList.innerHTML = ""; // Clear the current list to avoid duplications

    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.className = 'income-card';
        li.dataset.id = expense.id;  // Set a custom data attribute for the ID

        const iconClass = getIconClass(expense.expenseCategory);  

        li.innerHTML = `
            <div class="income-logo">
                <i class="fa-solid ${iconClass}"></i>
            </div>
            <div class="income-info">
                <div class="expense-source">
                    <p><i class="fa-solid fa-circle fa-2xs" style="color:  #972b2b;"></i>${expense.expenseCategory}</p>
                </div>
                <div class="income-detail">
                    <p>₹${expense.expenseAmount}</p>
                    <p><i class="fa-light fa-calendar"></i>${expense.expenseDate}</p>
                    <p><i class="fa-light fa-comment"></i>${expense.expenseDescription}</p>
                </div>
            </div>
            <div class="income-bin">
                <i class="fa-solid fa-trash" onclick="deleteExpense(${expense.id})"></i>
            </div>
        `;
    
        expenseList.appendChild(li);
    });

    calculateTotalExpense(); // Call the function to calculate and display total expense
}

// Initial call to display existing expenses
addExpense();

function calculateTotalExpense() {
    const totalExpense = expenses.reduce((total, expense) => {
        return total + parseFloat(expense.expenseAmount);
    }, 0);
    totalExpenseElement.textContent = `Total Expense: ₹${totalExpense.toFixed(2)}`;
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    // Update localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));
    console.log("delete butn");
    
    addExpense();
    updateExpenseChart();
}
window.deleteExpense = deleteExpense;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Capture form data
    const expenseTitle = document.getElementById("expense-title").value;
    const expenseAmount = document.getElementById("expense-amount").value;
    const expenseDate = document.getElementById("expense-date").value;
    const expenseCategory = document.getElementById("exp-category").value;
    const expenseDescription = document.getElementById("description").value;

    // Create an expense object
    const expense = {
        id: Date.now(),
        expenseTitle,
        expenseAmount,
        expenseDate,
        expenseCategory,
        expenseDescription
    };

    // Optional: Handle future dates (e.g., log a warning, show an alert)
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    if (expenseDate.split('T')[0] > today) {
        window.alert("Expense date can't be in the future");
        document.getElementById("expense-date").value = ''; // Reset the date field
        return; // Prevent further processing
    }

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    addExpense();
    updateExpenseChart();
    form.reset();
});


let expenseChart;

function updateExpenseChart() {
    const categories = [...new Set(expenses.map(expense => expense.expenseCategory))];
    const data = categories.map(category => {
        return expenses
            .filter(expense => expense.expenseCategory === category)
            .reduce((total, exp) => total + parseFloat(exp.expenseAmount), 0);
    });

    const ctx = expenseChartElement.getContext('2d');
    
    if (expenseChart) {
        expenseChart.destroy(); // Ensure old chart is removed
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses',
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

addExpense();
updateExpenseChart();


});
