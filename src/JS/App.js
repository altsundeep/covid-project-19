var URL1 = "https://api.rootnet.in/covid19-in/stats/latest";
var URL2 = "https://api.rootnet.in/covid19-in/stats/latest";
var URL3 = "https://api.covid19india.org/v2/state_district_wise.json";
var URL4 = "https://api.covid19india.org/data.json";
var URL5 = "https://api.covid19india.org/zones.json";

axios
  .all([
    axios.get(URL1),
    axios.get(URL2),
    axios.get(URL3),
    axios.get(URL4),
    axios.get(URL5),
  ])
  .then(
    axios.spread((res1, res2, res3, res4, res5) => {
      var col = document.getElementById("myTable");

      /**
 Date format [Start] 
 */
      var mDate = res2.data.lastOriginUpdate;
      var date = new Date(mDate);
      var myDate = date.getDate();
      var myMonth = date.getMonth();
      var myYear = date.getFullYear();
      var myDay = date.getDay();

      var mDayByName = [
        "Sunday",
        "Monday",
        "Tueday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      var month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      var m = month[myMonth];

      var let = mDayByName[myDay];

      var fullDate = ` ${let} , ${myDate}  ${m}  ${myYear}`;

      document.getElementById("lastUpdated").innerHTML = fullDate;

      /**Date format[Ends] */

      /**Table Data[Start] */

      for (var i in res1.data.data.regional) {
        var row = `
    <tr>
    <td> ${res1.data.data.regional[i].loc}                </td>
    <td> ${res1.data.data.regional[i].totalConfirmed}   </td>
    <td> ${res1.data.data.regional[i].discharged}         </td>
    <td> ${res1.data.data.regional[i].deaths}             </td> 
    </tr>`;

        col.innerHTML += row;
      }

      /***
       * Table Data[Ends]
       */

      /***
       * Summary [Sarts]
       *
       */

      // let summaryData = res2.data.data.summary;
      // document.getElementById("ps1").innerHTML =
      // summaryData.confirmedCasesIndian;
      // document.getElementById("ps2").innerHTML = summaryData.discharged;
      // document.getElementById("ps3").innerHTML = summaryData.deaths;
      // document.getElementById("ps4").innerHTML = summaryData.total;
      /**
       * Summary[Ends]
       */



      /***
       * search block[start]
       */

      let search = document.getElementById("search");

      search.addEventListener("input", () => {
        searchStatesByNames();
      });

      searchStatesByNames = () => {
        const statesList = res2.data.data.regional;
        const data = search.value.toLowerCase();
        let state = statesList.filter((el) => {
        return el.loc.toLowerCase().includes(data);
        });

        if (data.length === 0) {
          state = [];
        } 

        const htmlString = state
          .map((state) => {
            return ` 
                <p><span id='search-list'>  <span id='search-list-tot'> State: </span> ${state.loc} </span><br/>
                <span id='search-list'> <span id='search-list-tot'> Total: </span> ${state.totalConfirmed}  </span> <br/>
                <span id='search-list'> <span id='search-list-dis'> Discharged:  ${state.discharged} </span><br/>
                <span id='search-list'> <span id='search-list-dea'> Deaths: </span> ${state.deaths}</span><br/>
                 <span id='search-list'> <span id='search-list-hidden'> ..... </span> </span><br/>
                  <span id='search-list'> <span id='search-list-hidden'>.....  </span> </span> </p>`;
          }).join("");
      document.getElementById("show-data-list").innerHTML = htmlString;
      };

      /***
       * search block[End]
       */

      /** District_Wise_Data[Start]v1
       */
      search.addEventListener("input", () => {
        array1 = [];
        array2 = [];
        const { data: stateWise } = res3;
        const {
          data: { zones },
        } = res5;

        zones.forEach((element) => {
          array2.push(element);
        });

        for (const i in stateWise) {
          const districtWise = stateWise[i].districtData;
          districtWise.map((el) => {
            array1.push(el);
          });
        }



        const jData = array2.map((el) => {
          let d = array1.find((item) => item.district === el.district);
          return { ...el, ...d };
        });

        let alld = jData.map((el) => {
          return `<p id="show-zones"><span id='search-list'>  <span id='search-list-tot'> State: </span> ${el.state} </span><br />
            <span id='search-list'> <span id='search-list-tot'> District: </span> ${el.district}  </span> <br />
            <span id='search-list'> <span id='search-list-dis'> Active:  ${el.active} </span><br />
              <span id='search-list'> <span id='search-list-dea'> Recoverd: </span> ${el.recovered}</span><br/>
              <span id='search-list'> <span id='search-list-dea'> Deaths: </span> ${el.deceased}</span><br/> 
              <span id='search-list'> <span id='search-list-dea'> Zone: </span> ${el.zone}</span></p>`;
        });
        

        let f = alld
          .filter((el) => {
            return el.toLowerCase().includes(search.value) || el.includes(search.value);
          })
          .join("");


        if (search.value === "") {
          alld = [];
          document.getElementById("show-data-list").style.visibility = "hidden"
        }
        else{
          document.getElementById("show-data-list").style.visibility = "visible"
          document.getElementById("show-data-list").innerHTML += f;

        }


      });

      /***
       * Zones[start]
       */

      /***
       * Zones[Ends]
       */

      var testStates = res4.data.cases_time_series;

      for (let i in testStates) {
        let dailyConfirmed = testStates[i].dailyconfirmed;
        let dailyDeaths = testStates[i].dailydeceased;
        let dailyRecovered = testStates[i].dailyrecovered;
        let date = testStates[i].date;

        document.getElementById("Rs1").innerHTML = dailyConfirmed;
        document.getElementById("Rs2").innerHTML = dailyRecovered;
        document.getElementById("Rs3").innerHTML = dailyDeaths;
        document.getElementById("date").innerHTML = date;
      }

      var testStates = res4.data.cases_time_series;
      var totalTested = res4.data.tested;

      for (let i in testStates) {
        let dailyConfirmed = testStates[i].dailyconfirmed;
        let dailyDeaths = testStates[i].dailydeceased;
        let dailyRecovered = testStates[i].dailyrecovered;
        let tc = testStates[i].totalconfirmed;
        let tr = testStates[i].totalrecovered;
        let td = testStates[i].totaldeceased;


        let date = testStates[i].date;

        document.getElementById("Rs1").innerHTML = dailyConfirmed;
        document.getElementById("Rs2").innerHTML = dailyRecovered;
        document.getElementById("Rs3").innerHTML = dailyDeaths;
        document.getElementById("date").innerHTML = date;
        document.getElementById("ps1").innerHTML = tc-tr
        document.getElementById("ps2").innerHTML = tr;
      document.getElementById("ps3").innerHTML = td;
      document.getElementById("ps4").innerHTML = tc;

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
