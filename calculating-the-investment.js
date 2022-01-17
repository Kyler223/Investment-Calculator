function calculateInvestment() {
    var startAmount = document.getElementById('startAmount').value;
    var contributionAmount = document.getElementById('contribution').value;
    var contributionDateSelect = document.getElementById('date-select').value;
    var interestRate = document.getElementById('interest-rate').value;
    var yearsOfGrowth = document.getElementById('years-of-growth').value;

    if(!isNaN(startAmount) && !isNaN(interestRate) && !isNaN(yearsOfGrowth)){
        if(startAmount >= 0 && interestRate >= 0 && yearsOfGrowth > 0){
            var contributionConvered = 0;

            if(!isNaN(contributionAmount) && contributionAmount > 0){
                switch(contributionDateSelect){
                    case 'day': contributionConvered = contributionAmount * 365; break;
                    case 'week': contributionConvered = contributionAmount * 52; break;
                    case 'month': contributionConvered = contributionAmount * 12; break;
                    case 'year': contributionConvered = contributionAmount; break;
                } 
            }
            else if (isNaN(contributionAmount)) {alert(`'${contributionAmount}' is not a number. Contribution was ignored.`)}
            else if (contributionAmount < 0) {alert(`'${contributionAmount}' is not greater than 0. Contribution was ignored.`)}

            var amountArray = [startAmount];
            var labelArray = [`Year 0`];
            var contributionArray = [];
            var interestArray = [];

            for(var i = 0; i < yearsOfGrowth; i++) {
                var percentIncrease = (interestRate / 100) + 1;
                var totalForYear = (amountArray[i] * percentIncrease) + contributionConvered;
                amountArray.push(Math.round(totalForYear * 100) / 100);
                labelArray.push(`Year ${i + 1}`);
            }

            var ctx = document.getElementById('barChart').getContext('2d');

            var chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labelArray,
                    datasets: [{
                        label: '$',
                        data: amountArray,
                        backgroundColor: [
                            'rgba(153, 255, 153, 1)'
                        ],
                        borderColor: [
                            'rgba(153, 255, 153, 1)'
                        ],
                        borderWidth: 1,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'rgba(153, 255, 153, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // updateChart(amountArray);
        } 
    }
    else {
        var combination = [];
        if(isNaN(startAmount)) {combination.push(startAmount);}
        if(isNaN(interestRate)) {combination.push(interestRate);}
        if(isNaN(yearsOfGrowth)) {combination.push(yearsOfGrowth);}
        if(combination.length > 1){alert(`'${combination}' are not a numbers`);}
        else {alert(`'${combination}' is not a number`);}
    }
}

// function updateChart(amountArray){
//     chart.data.datasets[0].data = amountArray;
//     chart.update();
// }