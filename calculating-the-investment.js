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
            var interestArray = [interestRate];

            //get the data into an array
            for(var i = 0; i < yearsOfGrowth; i++) {
                var percentIncrease = (interestRate / 100) + 1;
                var totalForYear = (amountArray[i] * percentIncrease) + contributionConvered;
                amountArray.push(Math.round(totalForYear * 100) / 100);
                labelArray.push(`Year ${i + 1}`);
                interestArray.push(Math.round((amountArray[i] * (interestRate / 100) * 100)) / 100);
            }
            //chart/log all the other data in other functions
            chartData(amountArray, labelArray);
            logData(interestRate, contributionConvered, amountArray, interestArray);
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

function logData(interestRate, contribution, amountArray, interestArray) {
    var table = document.getElementById('tableOfData');
    var html = '';
    var headStart = false;
    var headEnd = false;
    //cycle through rows
    for(var i = 0; i < amountArray.length; i++) {

        //cycle through cells in the row
        for(var p = 0; p < table.rows[i].cells.length; p++) {
            //table head
            if(i === 0) {
                if(headStart === false) {
                    html += '<tr>'
                    headStart = true;
                }
                // table.insertRow(5);
                switch(p) {
                    case 0: table.rows[i].cells[p].innerHTML = "Year"; break;
                    case 1: table.rows[i].cells[p].innerHTML = "Start Amount"; break;
                    case 2: table.rows[i].cells[p].innerHTML = `${interestRate}% Interest`; break;
                    case 3: table.rows[i].cells[p].innerHTML = "Contribution"; break;
                    case 4: table.rows[i].cells[p].innerHTML = "End Amount"; break;
                }
            }
            //table body
            else {
                if(headEnd === false) {
                    html += '</tr>'
                    headEnd = true;
                }
                // table.insertRow(5);
                switch(p) {
                    case 0: table.rows[i].cells[p].innerHTML = i - 1; break; //year
                    case 1: table.rows[i].cells[p].innerHTML = `$${amountArray[i - 1]}`; break; //start amount
                    case 2: table.rows[i].cells[p].innerHTML = `$${interestArray[i]}`; break; //interest in dollars
                    case 3: table.rows[i].cells[p].innerHTML = `$${contribution}`; break; //contribution
                    case 4: table.rows[i].cells[p].innerHTML = `$${amountArray[i]}`; break; //end amount
                }
            }
            //maybe table footer for totals?
        }
        
    }
}