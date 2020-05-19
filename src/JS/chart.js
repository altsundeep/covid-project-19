

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


            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',

                data: {
                    labels: dates.slice(-7),
                    datasets: [{
                        label: 'Confirmed',
                        fillColor: "rgba(220,220,220,0.2)",
                        borderColor: 'rgb(0,0,205)',
                        data: confirmedCase.slice(-7)

                    }, {
                            label: 'Recoverd',
                            fillColor: "rgba(220,220,220,0.2)",
                            borderColor: 'rgb(0,128,0)',
                            data: recoveredCase.slice(-7)
                        }, {
                            label: 'Deaths',
                            fillColor: "rgba(220,220,220,0.2)",
                            borderColor: 'rgb(255,0,0)',
                            data: decreasedCase.slice(-7)
                        },

                ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio:false,
                }
            });
        }
    }))
