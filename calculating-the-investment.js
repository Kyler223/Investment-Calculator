function calculateInvestment() {
    //get all inputs from user
    var startAmount = document.getElementById('startAmount').value;
    var contributionAmount = document.getElementById('contribution').value;
    var contributionDateSelect = document.getElementById('date-select').value;
    var interestRate = document.getElementById('interest-rate').value;
    var yearsOfGrowth = document.getElementById('years-of-growth').value;
    //make sure data is a number and is greater than -1
    if(!isNaN(startAmount) && !isNaN(interestRate) && !isNaN(yearsOfGrowth)){
        if(startAmount >= 0 && interestRate >= 0 && yearsOfGrowth > 0){
            var contributionConvered = 0;
            //calculate contribution for the year
            if(!isNaN(contributionAmount) && contributionAmount > 0){
                switch(contributionDateSelect){
                    case 'day': contributionConvered = contributionAmount * 365; break;
                    case 'week': contributionConvered = contributionAmount * 52; break;
                    case 'month': contributionConvered = contributionAmount * 12; break;
                    case 'year': contributionConvered = contributionAmount * 1; break;  //need to x1 bc it doesn't work otherwise
                }
            }
            else if (isNaN(contributionAmount)) {alert(`'${contributionAmount}' is not a number. Contribution was ignored.`)}
            else if (contributionAmount < 0) {alert(`'${contributionAmount}' is not greater than 0. Contribution was ignored.`)}

            var amountArray = [startAmount];
            var labelArray = [`Year 0`];
            var contributionArray = [];
            var interestArray = [];

            //get the data into an array
            for(var i = 0; i < yearsOfGrowth; i++) {
                var percentIncrease = (interestRate / 100) + 1;
                var totalForYear = (amountArray[i] * percentIncrease) + contributionConvered;
                amountArray.push(Math.round(totalForYear * 100) / 100);
                labelArray.push(`Year ${i + 1}`);
            }
            //chart/log all the other data in other functions
            chartData(amountArray, labelArray)
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

//puts data into the bar chart
function chartData(amountArray, labelArray){
    var ctx = document.getElementById('barChart').getContext('2d');

    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelArray,
            datasets: [{
                label: '$',
                data: amountArray,
                backgroundColor: [
                    'rgba(146, 255, 170, 1)'
                ],
                borderColor: [
                    'rgba(146, 255, 170, 1)'
                ],
                borderWidth: 1,
                hoverBorderWidth: 2,
                hoverBorderColor: 'rgba(131, 226, 152, 1)'
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
}

function logData() {

}