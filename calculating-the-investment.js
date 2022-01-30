//all divs and charts saved to varibles
var pieChart;
var barChart;
var totalDiv = document.getElementById('totalsDiv');
var pieDiv = document.getElementById('pieChartDiv');
var barDiv = document.getElementById('barChartDiv');
var tableDiv = document.getElementById('tableDiv');

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
                var y = 0;
                switch(contributionDateSelect){
                    case 'day': y = 365; break;
                    case 'week': y = 52; break;
                    case 'month': y = 12; break;
                    case 'year': y = 1; break;
                }
                contributionConvered = contributionAmount * y;
            }
                //if the user puts a non number or number that's not greater than 0 gives an alert
                else if (isNaN(contributionAmount)) {alert(`'${contributionAmount}' is not a number. Contribution was ignored.`);}
                else if (contributionAmount < 0) {alert(`'${contributionAmount}' is not greater than 0. Contribution was ignored.`);}
                
                //arrays
                var amountArray = [startAmount];
                var labelArray = [`Year 0`];
                var interestArray = [interestRate];
                
                //get the data into an array
                for(var i = 0; i < yearsOfGrowth; i++) {
                var percentIncrease = (interestRate / 100) + 1;
                var totalForYear = (amountArray[i] * percentIncrease) + (contributionConvered * percentIncrease);

                amountArray.push(Math.round(totalForYear * 100) / 100);
                labelArray.push(`Year ${i + 1}`);
                interestArray.push(Math.round(((amountArray[i] * (interestRate / 100) + (contributionConvered * (interestRate / 100))) * 100)) / 100);
            }

            //needed for total table + pie chart
            var totalInterest = 0;
            var skipFirstNumber = false;
            interestArray.forEach(num => {if (skipFirstNumber){totalInterest += parseFloat(num);} else {skipFirstNumber = true;}});

            //chart/log all the other data in other functions
            totals(amountArray, contributionConvered, totalInterest);  //totals table
            pieChartFunction(amountArray, contributionConvered, totalInterest);
            barChartFunction(amountArray, labelArray);  //bar chart
            logData(interestRate, contributionConvered, amountArray, interestArray);  //log table
            
            //animation
            totalDiv.setAttribute('class', 'submitAnimation');
            pieDiv.setAttribute('class', 'submitAnimation');
            barDiv.setAttribute('class', 'submitAnimation');
            tableDiv.setAttribute('class', 'submitAnimation');
        } 
    }
    else {
        var combination = [];
        if(isNaN(startAmount)) {combination.push(startAmount);}
        if(isNaN(contributionAmount)) {combination.push(contributionAmount);}
        if(isNaN(interestRate)) {combination.push(interestRate);}
        if(isNaN(yearsOfGrowth)) {combination.push(yearsOfGrowth);}
        if(combination.length > 1){alert(`'${combination.join(' ')}' are not a numbers`);}
        else {alert(`'${combination}' is not a number`);}
    }
}

//sums and give ths total amount by the end of the investment
function totals(amountArray, contributionConvered, totalInterest) {
    var length = amountArray.length - 1;
    var yearString = (length) === 1 ? 'Year' : 'Years';

    //creates the totals table with inner html in the totalDiv
    var html = '<table id="tableOfTotals">'; 
        html += '<tr>';
            html += `<th>${yearString}: ${addCommas(length)}</th>`
            html += `<th>Total Contributed: $${addCommas((length) * contributionConvered)}</th>`
            html += `<th>Earned Interest: $${addCommas(Math.round(totalInterest * 100) / 100)}</th>`
            html += `<th>End Amount: $${addCommas(amountArray[length])}</th>`
        html += '</tr>';
    html += '</table>';
    totalDiv.innerHTML = html;
}


//puts data into the bar chart
function barChartFunction(amountArray, labelArray){
    barDiv.innerHTML = '<canvas id="barChart"></canvas>';
    
    var ctxBar = document.getElementById('barChart').getContext('2d');
    if(barChart != undefined) {
        barChart.destroy();
    }
    barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labelArray,
            datasets: [{
                label: '$',  //should get rid of the ':' in the label
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

function pieChartFunction(amountArray, contribution, totalInterest) {
    pieDiv.innerHTML = '<canvas id="pieChart"></canvas>';

    var ctxPie = document.getElementById('pieChart');
    if(pieChart != undefined) {
        pieChart.destroy();
    }
    pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Start Amount','Total Contributed', 'Earned Interest'],
            datasets: [{
                label: '$',  //should get rid of the ':' in the label
                data: [amountArray[0], (amountArray.length - 1) * contribution, totalInterest],
                backgroundColor: [
                    'rgba(201, 93, 99, 1)',
                    'rgba(49, 73, 59, 1)',
                    'rgba(51, 92, 215, 1)'
                ],
                borderColor: [
                    'rgba(0, 0, 0, .1)'
                ],
                borderWidth: 1,
                hoverBorderWidth: 2,
                hoverBorderColor: 'rgba(255, 255, 255, .3)'
            }]
        },
        options: {
            responsive: true
        }
    });
}

//table at the bottom of the website which shows the calulations for every year
function logData(interestRate, contribution, amountArray, interestArray) {
    var html = '<table id="tableOfData">';
    //cycle through rows
    for(var i = 0; i < amountArray.length; i++) {
        html += '<tr>';
        //cycle through cells in the row
        for(var p = 0; p < 5; p++) {
            //table head
            if(i === 0) {
                switch(p) {
                    case 0: html += "<th>Year</th>"; break;
                    case 1: html += "<th>Start Amount</th>"; break;
                    case 2: html += "<th>Contribution</th>"; break;
                    case 3: html += `<th>${addCommas(interestRate)}% Interest</th>`; break;
                    case 4: html += "<th>End Amount</th>"; break;
                }
            }
            //table body
            else {
                switch(p) {
                    case 0: html +=  `<td>${addCommas(i)}</td>`; break; //year
                    case 1: html += `<td>$${addCommas(amountArray[i - 1])}</td>`; break; //start amount
                    case 2: html += `<td>$${addCommas(contribution)}</td>`; break; //contribution
                    case 3: html += `<td>$${addCommas(interestArray[i])}</td>`; break; //interest in dollars
                    case 4: html += `<td>$${addCommas(amountArray[i])}</td>`; break; //end amount
                }
            }
        }
        html += '</tr>';
    }
    html += '</table>';
    tableDiv.innerHTML = html;
}

//adds commas to +4 digit numbers so it's easier to read
function addCommas(number) {
    if (parseFloat(number) >= 1000) {
        var newNumber = '';
        var decimal;
        var digits = 0;
        var numberStr = number.toString();

        if (numberStr.includes('.')) {      //checks if it has cents/a decimal and adds it on the end later
            decimal = numberStr.split('.');
            digits = decimal[0].length;
            numberStr = decimal[0];
        }
        else {
            digits = numberStr.length;
        }

        var reverse = numberStr.split('').reverse().join('');  //reverses the string to add the commas from the start of the number

        //for loop checks if it has 4 more digits to add another comma
        for (var i = 3; i + 1 <= digits; i = i + 3) {
            newNumber += `${reverse[i - 3]}${reverse[i - 2]}${reverse[i - 1]},`
            //if it doens't have 4 more digits then, add the rest of the digits
            if(i + 4 > digits) {
                if(reverse[i] != undefined) {newNumber += `${reverse[i]}`;}
                if(reverse[i + 1] != undefined) {newNumber += `${reverse[i + 1]}`;}
                if(reverse[i + 2] != undefined) {newNumber += `${reverse[i + 2]}`;}
            }
        }

        newNumber = newNumber.split('').reverse().join('');  //unreverse so it's the correct way

        if (decimal != undefined) {
            newNumber += `.${decimal[1]}`; //add the decimal/cents back in
        }

        return newNumber;
    }
    return number;
}