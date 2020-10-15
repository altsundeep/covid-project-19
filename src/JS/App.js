var mUrl1 = "https://api.covid19india.org/data.json";
var mUrl2 = "https://api.covid19india.org/v2/state_district_wise.json";
var mUrl3 = "https://api.covid19india.org/zones.json";

axios
  .all([
    axios.get(mUrl1),
    axios.get(mUrl2),
    axios.get(mUrl3),
  ])
  .then(
    axios.spread((res1, res3, res5) => {
      let col = document.getElementById("myTable");

    /**

  /**Table Data[Start] */

      const { data: { statewise } } = res1

    for (let i = 1; i < statewise.length; i++) {
        let row = `
    <tr>
    <td> ${statewise[i].state} </td>
    <td> ${statewise[i].active}             </td>
    <td> ${statewise[i].confirmed}<span id="deltaconfirmed">+${statewise[i].deltaconfirmed}</span></td>
    <td> ${statewise[i].recovered}<span id="deltarecovered">+${statewise[i].deltarecovered} </span>      </td>
    <td> ${statewise[i].deaths}<span id="deltadeceased">+${statewise[i].deltadeaths} </span>      </td> 
    </tr>`;



    let mActive = statewise[0].active;
    let mConfirmed = statewise[0].confirmed
    let mRecovered = statewise[0].recovered
    let mDeaths = statewise[0].deaths
    let mTotal  = parseInt(mActive)  + parseInt(mConfirmed) +  parseInt(mRecovered) + parseInt(mDeaths) ;

    console.log(mTotal)

    let activeCasesPercentage = (mActive / mTotal) * 100;

    let mActiveCasesPercentage = activeCasesPercentage.toFixed(2);
    
    let confirmedCasesPercentage = (mConfirmed / mTotal) * 100;

    let mConfirmedCasesPercentage = confirmedCasesPercentage.toFixed(2);


    let recoveredCasesPercentage = (mRecovered / mTotal) * 100;

    let mRecoveredCasesPercentage = recoveredCasesPercentage.toFixed(2);


    let deathCasesPercentage = (mDeaths / mTotal) * 100;

    let mDeathCasesPercentage = deathCasesPercentage.toFixed(2);







    document.getElementById("active-percentage").innerHTML = mActiveCasesPercentage ;
    document.getElementById("confirmed-percentage").innerHTML = mConfirmedCasesPercentage;
    document.getElementById("recovered-percentage").innerHTML = mRecoveredCasesPercentage;
    document.getElementById("deaths-percentage").innerHTML = mDeathCasesPercentage;



    document.getElementById("Active").innerHTML = mActive;
    document.getElementById("confirmed").innerHTML = mConfirmed;
    document.getElementById("recovered").innerHTML = mRecovered;
    document.getElementById("deaths").innerHTML = mDeaths;
    




    //    let mTab1 = `
    // <tr>
    // <td> ${statewise[0].active}             </td>
    // <td> ${statewise[0].confirmed}<span id="deltaconfirmed">+${statewise[0].deltaconfirmed}</span></td>
    // <td> ${statewise[0].recovered}<span id="deltarecovered">+${statewise[0].deltarecovered} </span>      </td>
    // <td> ${statewise[0].deaths}<span id="deltadeceased">+${statewise[0].deltadeaths} </span>      </td> 
    // </tr>`;

      col.innerHTML += row;
      // vol.innerHTML = mTab1

      }
      /***
       * Table Data[Ends]
       */
      
      // / Date format[Start]
      //   * /

      let mDate = statewise.map(el => {
        return el.lastupdatedtime;
      }

      )
      let dd = mDate.shift();
      let f = dd.replace(/\//g, "-")
      // let t = f.replace(/ /g, "T")
      let fPart = f.split('-')
      let ddd = fPart[0]
      let mmm = fPart[1]
      let lpart = fPart[2].split(' ')
      let yyyy = lpart[0]
      let tt = lpart[1]

      let date = `${yyyy}-${mmm}-${ddd}:${tt}`
      let gg = moment(date).format('LLL')
      let ago = moment(date).fromNow(true)
      document.getElementById("lastUpdated").innerHTML = gg
      document.getElementById("ago").innerHTML = ago + ' ago'
    
      // let mLastModified = document.lastModified
    /**Date format[Ends] */


      /***
       * search block[start]
       */
      search.addEventListener("input", () => {
        let mStatesList = statewise.map(el => {
          return `<p><span id='search-list'>  <span id='search-list-tot'> State: </span> ${el.state} </span><br/>
                <span id='search-list'> <span id='search-list-tot'> Total: </span> ${el.active}  </span> <br/>
              <span id='search-list'> <span id='search-list-dis'> Discharged:  ${el.recovered} </span><br/>
              <span id='search-list'> <span id='search-list-dea'> Deaths: </span> ${el.deaths}</span><br/>
        <span id='search-list'> <span id='search-list-hidden'> ..... </span> </span><br/>
        <span id='search-list'> <span id='search-list-hidden'>.....  </span> </span> </p>`;
        })
        
        if (search.value === "") {
          mStatesList = []
          
        }
        

        let mDataInUI = mStatesList.filter(el => {
          return el.toLowerCase().includes(search.value)
        })
        document.getElementById("show-data-list").innerHTML = mDataInUI;
      })

      /***
       * search block[End]
       */

      /** District_Wise_Data_with_zones[Start]
       */
      search.addEventListener("input", () => {
        array1 = [];
        array2 = [];
        const { data: stateWise } = res3;
        const { data: { zones } } = res5;

        zones.forEach((element) => {
          array2.push(element);
        });

        for (const i in stateWise) {
          const districtWise = stateWise[i].districtData;
          districtWise.map((el) => {
            array1.push(el);
          });
        }



        const mDistrictWiseData = array2.map((el) => {
          let d = array1.find((item) => item.district === el.district);
          return { ...el, ...d };
        });

        let mJoinedData = mDistrictWiseData.map((el) => {
          return `<p id="show-zones"><span id='search-list'>  <span id='search-list-tot'> State: </span> ${el.state} </span><br />
            <span id='search-list'> <span id='search-list-tot'> District: </span> ${el.district}  </span> <br />
            <span id='search-list'> <span id='search-list-dis'> Active:  ${el.active} </span><br />
              <span id='search-list'> <span id='search-list-dea'> Recoverd: </span> ${el.recovered}</span><br/>
              <span id='search-list'> <span id='search-list-dea'> Deaths: </span> ${el.deceased}</span><br/> 
              <span id='search-list'> <span id='search-list-dea'> Zone: </span> ${el.zone}</span></p>`;
        });


        let mFilteredData = mJoinedData
          .filter((el) => {
            return el.toLowerCase().includes(search.value) || el.includes(search.value);
          })
          .join("");


        if (search.value === "") {
          mJoinedData = [];
          document.getElementById("show-data-list").style.visibility = "hidden"
        }
        else {
          document.getElementById("show-data-list").style.visibility = "visible"
          document.getElementById("show-data-list").innerHTML += mFilteredData;
        }
      });

      /***
       * District_Wise_Data_with_zones[Ends]
       */

      const { data: { cases_time_series: mTestingData } } = res1
      const { data: { tested: totalTested } } = res1
      for (let i in mTestingData) {
        let dailyConfirmed = mTestingData[i].dailyconfirmed;
        let dailyDeaths = mTestingData[i].dailydeceased;
        let dailyRecovered = mTestingData[i].dailyrecovered;
        let date = mTestingData[i].date;
        document.getElementById("Rs1").innerHTML = dailyConfirmed;
        document.getElementById("Rs2").innerHTML = dailyRecovered;
        document.getElementById("Rs3").innerHTML = dailyDeaths;
        document.getElementById("date").innerHTML = date;
      }
      for (let i in mTestingData) {
        let dailyConfirmed = mTestingData[i].dailyconfirmed;
        let dailyDeaths = mTestingData[i].dailydeceased;
        let dailyRecovered = mTestingData[i].dailyrecovered;
        let tc = mTestingData[i].totalconfirmed;
        let tr = mTestingData[i].totalrecovered;
        let td = mTestingData[i].totaldeceased;
        let date = mTestingData[i].date;
        
        document.getElementById("Rs1").innerHTML = dailyConfirmed;
        document.getElementById("Rs2").innerHTML = dailyRecovered;
        document.getElementById("Rs3").innerHTML = dailyDeaths;
      }
      for (let i in totalTested) {
        let mSource = totalTested[i].source;
        let mTotalSampled = totalTested[i].totalsamplestested;
        let updateTime = totalTested[i].updatetimestamp;
        let mylink = document.getElementById("link");
        mylink.setAttribute("href", mSource);
        document.getElementById("smp2").innerHTML = mTotalSampled;
        document.getElementById("smp3").innerHTML = updateTime;
      }
    })
  );

/**
 *
 *
 *
 *
 *


 *
 *
 */
