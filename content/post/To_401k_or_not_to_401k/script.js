  function displayBarChart() {
    // Inputs from the form
    pre_tax_amount = document.getElementById('pre_tax_amount').value;
    expected_cagr = document.getElementById('expected_cagr').value/100;
    contribution_limit = document.getElementById('contribution_limit').value;
    total_income_tax_rate = document.getElementById('total_income_tax_rate').value/100;
    total_capital_gains_rate = document.getElementById('total_capital_gains_rate').value/100;
    early_withdrawal_penalty_rate = document.getElementById('early_withdrawal_penalty_rate').value/100;

    function get_gross_return(principal, cagr, number_of_years) {
        return principal*(Math.pow(1+cagr, number_of_years));
    }

    function get_after_tax_returns(amount, number_of_years){
        var net_investment = amount*number_of_years*(1-total_income_tax_rate);
        var gross_return = get_gross_return(net_investment, expected_cagr, number_of_years); 
        var gross_profit = gross_return-net_investment;
        var capital_gains_tax = gross_profit*total_capital_gains_rate;
        return gross_return-capital_gains_tax;
    }

    function get_tax_advantaged_returns(amount, number_of_years){
        // Because of the 401k contribution limits, the amount is split into 
        // 1) 401k contribution upto limit
        // 2) After tax investment

        // After tax portion
        var after_tax_amount = amount>contribution_limit?(amount-contribution_limit):0;
        var net_after_tax_return = get_after_tax_returns(after_tax_amount, number_of_years);

        // 401k portion
        var tax_advantaged_amount = amount>contribution_limit?contribution_limit:amount;
        var net_investment = tax_advantaged_amount*number_of_years;
        var gross_return = get_gross_return(net_investment, expected_cagr, number_of_years); 
        // Need to pay early withdrawal penalty if withdrawing under the age of 65
        var net_tax_rate = total_income_tax_rate+early_withdrawal_penalty_rate;
        var net_tax = gross_return*net_tax_rate;
        var net_tax_advantaged_return = gross_return-net_tax;
        
        return net_after_tax_return+net_tax_advantaged_return;
    }

    var years_to_calculate = Array(30).fill().map((x,i)=>i+1)

    var ctx = document.getElementById("barChart").getContext("2d");
    var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years_to_calculate,
            datasets: [
                {
                    label: "Tax advantaged returns",
                    backgroundColor: "#d9ffb3",
                    data: years_to_calculate.map((number_of_years) => get_tax_advantaged_returns(pre_tax_amount, number_of_years))
                },
                {
                    label: "After tax returns",
                    backgroundColor: "#99ccff",
                    data: years_to_calculate.map((number_of_years) => get_after_tax_returns(pre_tax_amount, number_of_years))
                }
            ]
        },
        options: {
            scales: {
              yAxes: [{
                ticks: {
                  callback: function(value, index, values) {
                    return value.toLocaleString("en-US",{style:"currency", currency:"USD"});
                  }
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'No. of years invested'
                }
              }]
            }
          }
      });
  }