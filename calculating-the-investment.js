var chart;

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
            totals(amountArray, contributionConvered, interestArray);
            chartData(amountArray, labelArray);
            logData(interestRate, contributionConvered, amountArray, interestArray);
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
function totals(amountArray, contributionConvered, interestArray) {
    var length = amountArray.length - 1;
    var yearString = (length) === 1 ? 'Year' : 'Years';
    var totalDiv = document.getElementById('totalsDiv');
    var totalInterest = 0;
    var skipFirstNumber = false;

    interestArray.forEach(num => {if (skipFirstNumber){totalInterest += parseFloat(num);} else {skipFirstNumber = true;}});
    var  html = '<table id="tableOfTotals">'; 
        html += '<tr>';
            html += `<th>${yearString}: ${addCommas(length)}</th>`
            html += `<th>Earn Interest: $${addCommas(Math.round(totalInterest * 100) / 100)}</th>`
            html += `<th>Total Contributed: $${addCommas((length) * contributionConvered)}</th>`
            html += `<th>End Amount: $${addCommas(amountArray[length])}</th>`
        html += '</tr>';
    html += '</table>';
    totalDiv.innerHTML = html;
}

//puts data into the bar chart
function chartData(amountArray, labelArray){
    var ctx = document.getElementById('barChart').getContext('2d');
    if(chart != undefined) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
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
                    case 2: html += `<th>${addCommas(interestRate)}% Interest</th>`; break;
                    case 3: html += "<th>Contribution</th>"; break;
                    case 4: html += "<th>End Amount</th>"; break;
                }
            }
            //table body
            else {
                switch(p) {
                    case 0: html +=  `<td>${addCommas(i)}</td>`; break; //year
                    case 1: html += `<td>$${addCommas(amountArray[i - 1])}</td>`; break; //start amount
                    case 2: html += `<td>$${addCommas(interestArray[i])}</td>`; break; //interest in dollars
                    case 3: html += `<td>$${addCommas(contribution)}</td>`; break; //contribution
                    case 4: html += `<td>$${addCommas(amountArray[i])}</td>`; break; //end amount
                }
            }
        }
        html += '</tr>';
    }
    html += '</table>';
    var tableDiv = document.getElementById('tableDiv');
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