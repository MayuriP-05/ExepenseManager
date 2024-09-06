document.addEventListener("DOMContentLoaded", () => {
  const username = document.querySelector(".user-name");
  username.innerHTML = localStorage.getItem("name");
  // console.log(username.innerHTML);
  // console.log(localStorage.getItem("name"));

  function logOut() {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    window.location.href = "index.html";
  }
  
  const dailyExpenseChartElement = document.getElementById("dailyExpenseChart");

  // Fetch expenses from local storage
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // Aggregate expenses by date
  const aggregateByDate = expenses.reduce((acc, expense) => {
    const date = expense.expenseDate.split("T")[0]; // Extract the date part
    const amount = parseFloat(expense.expenseAmount);

    if (acc[date]) {
      acc[date] += amount;
    } else {
      acc[date] = amount;
    }

    return acc;
  }, {});
  const dates = Object.keys(aggregateByDate).sort();
  const amounts = dates.map((date) => aggregateByDate[date]);
  new Chart(dailyExpenseChartElement, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Daily Expenses",
          data: amounts,
          backgroundColor: "#C7253E",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Total Expenses Per Day",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
          },
          ticks: {
            autoSkip: true,
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          title: {
            display: true,
            text: "Amount (₹)",
          },
          beginAtZero: true,
        },
      },
    },
  });
});

const dailyIncomeChartElement = document.getElementById("dailyIncomeChart");
const incomes = JSON.parse(localStorage.getItem("incomes")) || [];
const aggregateByDate = incomes.reduce((acc, income) => {
  const date = income.salaryDate.split("T")[0]; // Extract the date part
  const amount = parseFloat(income.salaryAmount);

  if (acc[date]) {
    acc[date] += amount;
  } else {
    acc[date] = amount;
  }

  return acc;
}, {});

// Prepare data for the chart
const dates = Object.keys(aggregateByDate).sort(); // Sort dates in ascending order
const amounts = dates.map((date) => aggregateByDate[date]);

// Create the chart
new Chart(dailyIncomeChartElement, {
  type: "line",
  data: {
    labels: dates,
    datasets: [
      {
        label: "Daily Income",
        data: amounts,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Income Per Day",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount ($)",
        },
        beginAtZero: true,
      },
    },
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const totalExpenseIncomeChartElement = document.getElementById(
    "totalExpenseIncomeChart"
  );
  const tExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const tIncomes = JSON.parse(localStorage.getItem("incomes")) || [];
  const totalExpenses = tExpenses.reduce((acc, expense) => {
    return acc + parseFloat(expense.expenseAmount);
  }, 0);
  const totalIncome = tIncomes.reduce((acc, income) => {
    return acc + parseFloat(income.salaryAmount);
  }, 0);

  const data = {
    labels: ["Total Expenses", "Total Income"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [totalExpenses, totalIncome],
        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(75, 192, 192, 0.5)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
        
      },
    ],
  };
  new Chart(totalExpenseIncomeChartElement, {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false, // No need for a legend with only one dataset
        },
        title: {
          display: true,
          text: "Total Expenses vs. Total Income",
        },
      },
    },
  });
  const tInc = document.querySelector(".t-income");
  tInc.textContent = `Income: ₹${totalIncome.toFixed(2)}`;

  const tExp = document.querySelector(".t-expense");
  tExp.textContent = `Expense: ₹${totalExpenses.toFixed(2)}`;

  const totalBalance = totalIncome - totalExpenses;
  const tbal = document.querySelector(".t-balance");
  if (totalBalance > 0) {
    tbal.textContent = `₹${totalBalance.toFixed(2)}`;
    tbal.style.color = "green";
  } else {
    tbal.textContent = `₹${totalBalance.toFixed(2)}`;
    tbal.style.color = "red";
  }
  const aiAdvice = document.querySelector(".ai-advice");
  //  aiAdvice.textContent="";
  if (totalBalance >= 15000) {
    aiAdvice.textContent = "your account is in good state 🥳 ";
  } else if (totalBalance > 0) {
    aiAdvice.innerHTML = `Your account is stable 😊, but work hard to get more income based on your expenses.<br><br>
<strong>Seek Promotions:</strong> Look for opportunities to advance in your current job by taking on additional responsibilities or pursuing a promotion.<br>
<strong>Tax Efficiency:</strong> Maximize deductions and credits to reduce taxable income.<br>
<strong>Set Goals:</strong> Define clear financial goals and create a plan to achieve them.`;

   }
   else if (totalBalance ==0){
aiAdvice.innerHTML="";
   }   
   else {
    aiAdvice.innerHTML = `<b>your account in poor health 😔.</b> <br><br>Steps to help you manage debt:<br><b>1.Set Up a Budget:</b> Create a budget that includes all your essential expenses and allocates a portion of your income to debt repayment.<br><b>2.Set Up a Budget:</b> Create a budget that includes all your essential expenses and allocates a portion of your income to debt repayment.<br><b>3.By Side Jobs:</b> Explore additional income opportunities such as freelancing or part-time work.`;
  }
});
