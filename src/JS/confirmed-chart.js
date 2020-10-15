

var URL = "https://api.covid19india.org/data.json"

axios.all([axios.get(URL)])
    .then(axios.spread((res1) => {
       var confirmedCase = []
       var recoveredCase = []
       var decreasedCase = []
       var dates = []
       
       const testStates = res1.data.cases_time_series
        // console.log(testStates);

        for (var i in testStates) {

            var confirmed = testStates[i].dailyconfirmed
            confirmedCase.push(confirmed)
            
            var recovered = testStates[i].dailyrecovered
            recoveredCase.push(recovered)

            var deceased = testStates[i].dailydeceased
            decreasedCase.push(deceased)

            var myDates = testStates[i].date
            dates.push(myDates)

            Chart.defaults.global.legend.display = false;
            var ctx = document.getElementById('confirmed-chart').getContext('2d');
            var chart = new Chart(ctx,
                 {
                type: 'line',
               
                data: {
                    labels: dates.slice(-7),
                    datasets: [{
                        fill: false,
                        fillColor: "rgba(220,220,220,0.2)",
                        borderColor: 'rgb(0,0,205)',
                        data: confirmedCase.slice(-5) }
                    

                ],fill: false
                },
                options: {

                    scales: {
                        yAxes: [{
                            display : false,
                            ticks: {
                                beginAtZero: true,
                                color: 'rgba(220,220,220,0.2)'
                            }
                        }],
                        xAxes: [{
                            display: false,
                        }]
                    }
                    
                }
            });
        }
    }))


