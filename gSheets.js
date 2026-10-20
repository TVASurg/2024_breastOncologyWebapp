//Globals
let selectedTumorLocation = "";
let selectedVolumeRemoved = "";
let selectedDensity = 0;

let highRiskFactors = false;

// Google Sheets API endpoint and API key
const API_ENDPOINT = `https://sheets.googleapis.com/v4/spreadsheets/1UyCYHC8JIr_O-4xzDRgTyP37gcr7dytKc69SF6oK17Q/values/Sheet1`;

// Function to fetch data from Google Sheets
async function fetchData() {
    try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();

        // Extract values from the response
        const values = data.values;

        // Display data in the HTML element with id "data"
        const dataContainer = document.getElementById('data');
        
        dataContainer.innerHTML = "";
        
        // Filter for no high risk
        // Filter for column F, BIRAD score (keyword 'dense')
        const filteredRowsForDensity = values.filter(row => {

                // Check if column F contains 'dense' keyword
                const condition1 = row[5] && row[5].toLowerCase().includes('dense');
                // Check if column B isn't 'central'
                const condition2 = !(row[1] && row[1].toLowerCase().includes('central'));
                // Return true if both conditions are met
                return condition1 && condition2;
                //return row[5] && row[5].toLowerCase().includes('dense');

            });
        
        // Filter for high risk
        // Filter for column F, BIRAD score (keyword 'dense')
        const filteredRowsForHighRisk = values.filter(row => {

                // Check if these are level 1 techniques
                const condition1 = row[3] && row[3].toLowerCase().includes('1');
                
                // Check if these are NOT undermining techniques
                const condition2 = !(row[0] && row[0].toLowerCase().includes('undermining'));
                
                // Check if column B isn't 'central'
                const condition3 = !(row[1] && row[1].toLowerCase().includes('central'));
                // Return true if both conditions are met
                return condition1 && condition2 && condition3;
                //return row[5] && row[5].toLowerCase().includes('dense');

            });

        // Filter for lv 2 techniques
        const filteredRowsForLV2tech = values.filter(row => {

                // Check if these are level 2 techniques
                const condition1 = row[3] && row[3].toLowerCase().includes('2');
                
                // Check if column B isn't 'central'
                const condition2 = !(row[1] && row[1].toLowerCase().includes('central'));
            
                // Check if column B is 'anywhere'
                const condition3 = row[1] && row[1].toLowerCase().includes('anywhere');
            
                // Return true if both conditions are met
                return condition1 && condition2 && condition3;

            });

        //filtered row for round block
        const filteredRowforRoundBlock = values.filter(row => {

                // pick up row for round block
                const condition1 = row[0] && row[0].toLowerCase().includes('round');
                
                // Return true if both conditions are met
                return condition1;

            });

        //filtered row for WISE
        const filteredRowforWISE = values.filter(row => {

                // pick up row for round block
                const condition1 = row[0] && row[0].toLowerCase().includes('wise');
                
                // Return true if both conditions are met
                return condition1;

            });
        
    
        // Filter rows for column B, tumor locations
        const filteredRowsForLocations = values.filter(row => {
            
             return row[1] && row[1].toLowerCase().includes(selectedTumorLocation.toLowerCase());
            
        });

        // Extract values from column A in filtered rows
        const columnAValuesForLocation = filteredRowsForLocations.map(row => row[0]);
        const columnAValuesForLevel = filteredRowsForLocations.map(row => row[3]);
        
        const mainProceduresBriefDescription = filteredRowsForLocations.map(row => row[8]);
        const mainProceduresImage = filteredRowsForLocations.map(row => row[9]);
        
        const columnAValuesForDensity = filteredRowsForDensity.map(row => row[0]);
        
        const densityTechniquesBriefDescription = filteredRowsForDensity.map(row => row[8]);
        const densityTechniquesImage = filteredRowsForDensity.map(row => row[9]);
        
        const columnAValuesForHighRisk = filteredRowsForHighRisk.map(row => row[0]);
        
        const highRiskTechniquesBriefDescription = filteredRowsForHighRisk.map(row => row[8]);
        const highRiskTechniquesImage = filteredRowsForHighRisk.map(row => row[9]);
        
        const columnAValuesForLV2tech = filteredRowsForLV2tech.map(row => row[0]);
        
        const lv2TechBriefDescription = filteredRowsForLV2tech.map(row => row[8]);
        const lv2TechImage = filteredRowsForLV2tech.map(row => row[9]);
        
        // Display filtered data in the HTML element with id "data"

        if (columnAValuesForLocation && columnAValuesForLocation.length > 0) {

            
/*            columnAValuesForLocation.forEach(value => {
                dataContainer.innerHTML += `<li>${value}`;
            });    
            columnAValuesForLevel.forEach(value => {
                dataContainer.innerHTML += `(Level ) + ${value} + procedure</li>`;
            });*/
            
            for(i=0; i<columnAValuesForLocation.length; i++)
            {

                var dataContainerString = "";
            
                //generalizing WISE case to all procedures...
                if(columnAValuesForLocation[i].toLowerCase().includes('wise')==false)
                {
                dataContainerString += `<div class="shadow-sm row mx-xs-1 mx-sm-5 my-3 border"><div class="col-12 py-2 bg-secondary rounded-top"> <h5 class="text-light my-2">`;
                dataContainerString += columnAValuesForLocation[i] + " (Level ";
                dataContainerString += columnAValuesForLevel[i] + " procedure) ";
                dataContainerString +=`</h5></div>`;
                
                if (!mainProceduresImage[i].includes(".mp4"))
                    {
                    dataContainerString += `<div class="col-12 col-lg-6 px-0"><img class='img-fluid' src='`;
                    dataContainerString += mainProceduresImage[i];
                    dataContainerString += `'></div>`;
                    }
                else if (mainProceduresImage[i].includes(".mp4"))
                    {
                        
                    dataContainerString += `<div class="col-12 col-lg-6 px-0"><div class="ratio ratio-16x9"><video src="`;
                    dataContainerString += mainProceduresImage[i];
                    dataContainerString += `" loop autoplay></video></div></div>`;
                    }
                
                dataContainerString += `<div class="col-12 col-lg-6 my-auto py-2"><p>`;
                dataContainerString += mainProceduresBriefDescription[i];
                dataContainerString += `</p>`
                
                //dataContainerString += `<button type="button" class=" d-grid btn btn-primary mx-auto">`;
                //dataContainerString += `<a href='#'>`;
                //dataContainerString += `</a>Watch Video</button>`;
                
                dataContainerString += `</div></div>`;
                
                dataContainer.innerHTML += dataContainerString;
                }
                
                /*<div class="shadow-sm row mx-5 my-3 border">
                                
                                <div class="col-12 py-2 bg-secondary rounded-top"> <h5 class="text-light my-2">Wise pattern reduction + pedicled reconstruction (Level 3 procedure)</h5></div>
                                
                                <div class="col-12 col-lg-6 px-0"> 
                                    <a href='https://pie.med.utoronto.ca/TVASurg/project/oncoplastic-lumpectomy-with-inferior-pedicle-wise-pattern-reduction/' target='_blank'><img class='img-fluid' src='https://pie.med.utoronto.ca/TVASurg/wp-content/uploads/2023/03/feature-image-1000-500-800x500.png'></a>
                                </div>
                                
                                <div class="col-12 col-lg-6 my-auto py-2">
                                
                                    <p>The Wise pattern skin closure was performed along the vertical and horizontal lines creating the new IMF. The wise pattern skin closure was continued along the vertical line of the wise pattern leaving space for the nipple keyhole and NAC. </p>
                                
                                    <button type="button" class=" d-grid btn btn-primary mx-auto">Watch video</button>
                                </div>
                </div>`*/
                
        
            }
            
            //extra requirements for WISE pattern
            //show upper pole pedicle if tumor location is upper inner
            //show lower pole pedicle if tumor location is 6 o clock

            if (selectedTumorLocation== "upper inner" ||
                selectedTumorLocation== "six o clock" )
                {
                    var wisePatternString = "";

                    wisePatternString += `<div class="shadow-sm row mx-xs-1 mx-sm-5 my-3 border"><div class="col-12 py-2 bg-secondary rounded-top"> <h5 class="text-light my-2">`;
                    wisePatternString += filteredRowforWISE[0][0] + " (Level ";
                    wisePatternString += filteredRowforWISE[0][3] + " procedure) ";
                    wisePatternString +=`</h5></div>`;
                    
                    
                    wisePatternString += `<div class="col-12 col-lg-6 px-0"><div class="ratio ratio-16x9"><video src="`;
                    if (selectedTumorLocation== "upper inner")
                    {
                        wisePatternString += filteredRowforWISE[0][10];
                    }else if(selectedTumorLocation== "six o clock")
                    {
                        wisePatternString += filteredRowforWISE[0][9];
                    }
                    wisePatternString += `" loop autoplay></video></div></div>`;
                    
                    wisePatternString += `<div class="col-12 col-lg-6 my-auto py-2"><p>`;
                    wisePatternString += filteredRowforWISE[0][8];
                    wisePatternString += `</p>`;

                    wisePatternString += `<a href='https://pie.med.utoronto.ca/TVASurg/project/oncoplastic-lumpectomy-with-inferior-pedicle-wise-pattern-reduction/' target='_blank'><button type="button" class=" d-grid btn btn-primary mx-auto">`;
                    wisePatternString += `Watch Video</button></a>`;

                    wisePatternString += `</div></div>`;
                    
                    dataContainer.innerHTML += wisePatternString;
                }
            

            //selection criteria for round block/donut - need clarification
            if (
                highRiskFactors == false &&
                selectedVolumeRemoved == "lt20" &&
                selectedDensity > 2
               )
                {
                    //console.log(filteredRowforRoundBlock[0][8]);

                    var roundBlockString = "";

                    roundBlockString += `<div class="shadow-sm row mx-xs-1 mx-sm-5 my-3 border"><div class="col-12 py-2 bg-secondary rounded-top"> <h5 class="text-light my-2">`;
                    roundBlockString += filteredRowforRoundBlock[0][0] + " (Level ";
                    roundBlockString += filteredRowforRoundBlock[0][3] + " procedure) ";
                    roundBlockString +=`</h5></div>`;
                    
                    roundBlockString += `<div class="col-12 col-lg-6 px-0"><div class="ratio ratio-16x9"><video src="`;
                    roundBlockString += filteredRowforRoundBlock[0][9];
                    roundBlockString += `" loop autoplay></video></div></div>`;

                    roundBlockString += `<div class="col-12 col-lg-6 my-auto py-2"><p>`;
                    roundBlockString += filteredRowforRoundBlock[0][8];
                    roundBlockString += `</p>`;

                    //roundBlockString += `<button type="button" class=" d-grid btn btn-primary mx-auto">`;
                    //roundBlockString += `<a href='#'>`;
                    //roundBlockString += `</a>Watch Video</button>`;

                    roundBlockString += `</div></div>`;
                    
                    dataContainer.innerHTML += roundBlockString;
                }
            
        
            
            //here we insert the optional level 1 techniques...
            if (
                highRiskFactors == false &&
                
                selectedVolumeRemoved == "lt20" &&
                
                selectedTumorLocation !="central" && //otherwise only the parallelogram incision is applicable
                
                selectedDensity !=0 && //density is selected
                selectedDensity > 2) //and therefore is not fatty
                {
/*                    dataContainer.innerHTML += `<br/><p>Level 1 techniques recommended in conjuction:</p>`;
                    
                      dataContainer.innerHTML += "<ul>";
            
                        columnAValuesForDensity.forEach(value => {
                        dataContainer.innerHTML += `<li>${value}</li>`;
                        });
                      dataContainer.innerHTML += "</ul>";
*/
                    
                    if (columnAValuesForDensity && columnAValuesForDensity.length > 0)
                    {
                    
                        dataContainer.innerHTML += `<hr class="my-5"/><h5 class="card-title">Level 1 techniques recommended in conjuction:</h5>`;
                        
                        for(i=0; i<columnAValuesForDensity.length; i++)
                        {
                            var lvl1techString = "";

                            lvl1techString += `<div class="shadow-sm row mx-xs-1 mx-sm-5 my-3 border"><div class="col-12 py-2 bg-secondary rounded-top"> <h5 class="text-light my-2">`;
                            lvl1techString += columnAValuesForDensity[i] + " (Level 1 technique) ";
                            lvl1techString +=`</h5></div>`;

                            /*lvl1techString += `<div class="col-12 col-lg-6 px-0"><img class='img-fluid' src='`;
                            lvl1techString += densityTechniquesImage[i];
                            lvl1techString += `'></div>`;*/
                            
                            if (!densityTechniquesImage[i].includes(".mp4"))
                            {
                                lvl1techString += `<div class="col-12 col-lg-6 px-0"><img class='img-fluid' src='`;
                                lvl1techString += densityTechniquesImage[i];
                                lvl1techString += `'></div>`;
                            }
                            else if (densityTechniquesImage[i].includes(".mp4"))
                            {

                                lvl1techString += `<div class="col-12 col-lg-6 px-0"><div class="ratio ratio-16x9"><video src="`;
                                lvl1techString += densityTechniquesImage[i];
                                lvl1techString += `" loop autoplay></video></div></div>`;
                            }

                            lvl1techString += `<div class="col-12 col-lg-6 my-auto py-2"><p>`;
                            lvl1techString += densityTechniquesBriefDescription[i];
                            lvl1techString += `</p>`

                            //lvl1techString += `<button type="button" class=" d-grid btn btn-primary mx-auto">`;
                            //lvl1techString += `<a href='#'>`;
                            //lvl1techString += `</a>Watch Video</button>`;

                            lvl1techString += `</div></div>`;

                            dataContainer.innerHTML += lvl1techString;
                        }
                    
                    
                    }

                }
            
            //here we insert the optional level 1 techniques for high risk
            else if (
                highRiskFactors == true &&
                
                selectedVolumeRemoved == "lt20" &&
                     
                selectedTumorLocation !="central" && //otherwise only the parallelogram incision is applicable
                     
                selectedDensity !=0 && //density is selected
                selectedDensity > 2) //and therefore is not fatty
                {
/*                    dataContainer.innerHTML += `<br/><p>Level 1 techniques recommended in conjuction:</p>`;
                    
                    dataContainer.innerHTML += "<ul>";
            
                        columnAValuesForHighRisk.forEach(value => {
                        dataContainer.innerHTML += `<li>${value}</li>`;
                        });
                    dataContainer.innerHTML += "</ul>";*/
                    

                    if (columnAValuesForHighRisk && columnAValuesForHighRisk.length > 0)
                    {
                    
                        dataContainer.innerHTML += `<hr class="my-5"/><h5 class="card-title">Level 1 techniques recommended in conjuction:</h5>`;
                        
                        for(i=0; i<columnAValuesForHighRisk.length; i++)
                        {
                            var lvl1hiRisktechString = "";

                            lvl1hiRisktechString += `<div class="shadow-sm row mx-xs-1 mx-sm-5 my-3 border"><div class="col-12 py-2 bg-secondary rounded-top"> <h5 class="text-light my-2">`;
                            lvl1hiRisktechString += columnAValuesForHighRisk[i] + " (Level 1 technique) ";
                            lvl1hiRisktechString +=`</h5></div>`;

/*                            lvl1hiRisktechString += `<div class="col-12 col-lg-6 px-0"><img class='img-fluid' src='`;
                            lvl1hiRisktechString += highRiskTechniquesImage[i];
                            lvl1hiRisktechString += `'></div>`;*/
                            
                            if (!highRiskTechniquesImage[i].includes(".mp4"))
                            {
                                lvl1hiRisktechString += `<div class="col-12 col-lg-6 px-0"><img class='img-fluid' src='`;
                                lvl1hiRisktechString += highRiskTechniquesImage[i];
                                lvl1hiRisktechString += `'></div>`;
                            }
                            else if (highRiskTechniquesImage[i].includes(".mp4"))
                            {

                                lvl1hiRisktechString += `<div class="col-12 col-lg-6 px-0"><div class="ratio ratio-16x9"><video src="`;
                                lvl1hiRisktechString += highRiskTechniquesImage[i];
                                lvl1hiRisktechString += `" loop autoplay></video></div></div>`;
                            }

                            lvl1hiRisktechString += `<div class="col-12 col-lg-6 my-auto py-2"><p>`;
                            lvl1hiRisktechString += highRiskTechniquesBriefDescription[i];
                            lvl1hiRisktechString += `</p>`

                            //lvl1hiRisktechString += `<button type="button" class=" d-grid btn btn-primary mx-auto">`;
                            //lvl1hiRisktechString += `<a href='#'>`;
                            //lvl1hiRisktechString += `</a>Watch Video</button>`;

                            lvl1hiRisktechString += `</div></div>`;

                            dataContainer.innerHTML += lvl1hiRisktechString;
                        }
                    
                    
                    }
                }
            
            //here we insert the optional level 2 techniques if volume removed is 20-50%
            //selecting for techniques based on the 'anywhere' tag with lv2 - lets look at roundblock later
            //going to presume that density doesn't matter in these techniques
            if (
                selectedVolumeRemoved == "20to50"
            
                )
                {
                    
/*                    dataContainer.innerHTML += `<br/><p>Level 2 techniques recommended in conjuction:</p>`;
                    
                    dataContainer.innerHTML += "<ul>";
            
                        columnAValuesForLV2tech.forEach(value => {
                        dataContainer.innerHTML += `<li>${value}</li>`;
                        });
                    dataContainer.innerHTML += "</ul>";*/

                    if (columnAValuesForLV2tech && columnAValuesForLV2tech.length > 0)
                    {
                    
                        dataContainer.innerHTML += `<hr class="my-5"/><h5 class="card-title">Level 2 techniques recommended in conjuction:</h5>`;
                        
                        for(i=0; i<columnAValuesForLV2tech.length; i++)
                        {
                            var lvl2techString = "";

                            lvl2techString += `<div class="shadow-sm row mx-xs-1 mx-sm-5 my-3 border"><div class="col-12 py-2 bg-secondary rounded-top"> <h5 class="text-light my-2">`;
                            lvl2techString += columnAValuesForLV2tech[i] + " (Level 2 technique) ";
                            lvl2techString +=`</h5></div>`;

/*                            lvl2techString += `<div class="col-12 col-lg-6 px-0"><img class='img-fluid' src='`;
                            lvl2techString += lv2TechImage[i];
                            lvl2techString += `'></div>`;*/
                            
                            if (!lv2TechImage[i].includes(".mp4"))
                            {
                                lvl2techString += `<div class="col-12 col-lg-6 px-0"><img class='img-fluid' src='`;
                                lvl2techString += lv2TechImage[i];
                                lvl2techString += `'></div>`;
                            }
                            else if (lv2TechImage[i].includes(".mp4"))
                            {

                                lvl2techString += `<div class="col-12 col-lg-6 px-0"><div class="ratio ratio-16x9"><video src="`;
                                lvl2techString += lv2TechImage[i];
                                lvl2techString += `" loop autoplay></video></div></div>`;
                            }

                            lvl2techString += `<div class="col-12 col-lg-6 my-auto py-2"><p>`;
                            lvl2techString += lv2TechBriefDescription[i];
                            lvl2techString += `</p>`

                            //lvl2techString += `<button type="button" class=" d-grid btn btn-primary mx-auto">`;
                            //lvl2techString += `<a href='#'>`;
                            //lvl2techString += `</a>Watch Video</button>`;

                            lvl2techString += `</div></div>`;

                            dataContainer.innerHTML += lvl2techString;
                        }
                    
                    
                    }
                }
            
            
        } else {
            dataContainer.innerHTML = "No data found.";
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchAllData() {
    try {
        const response = await fetch(API_ENDPOINT);
        const dataAll = await response.json();

        // Extract values from the response
        const values = dataAll.values;

        // Display data in the HTML element with id "data"
        const modalPContainer = document.getElementById('modalPbody');
        const modalTContainer = document.getElementById('modalTbody');
        
        const procedureNameFilter = values.map(row => row[0]);
        const procedureLocationFilter = values.map(row => row[1]);
        const procedureLevelFilter = values.map(row => row[3]);
        const natureFilter = values.map(row => row[7]);
        
        modalPContainer.innerHTML = "";
        modalTContainer.innerHTML = "";
        
        for(i=1; i<procedureNameFilter.length; i++)
            {
                var modalRowString = "";
                
                if(natureFilter[i] == "Procedure")
                {
                modalRowString += "<tr>";
                modalRowString += "<td>" + procedureNameFilter[i]  +"</td>";
                modalRowString += "<td>" + procedureLevelFilter[i]  +"</td>";
                modalRowString += "<td>" + procedureLocationFilter[i]  +"</td></tr>";
                    
                modalPContainer.innerHTML += modalRowString;
                    }
                else if (natureFilter[i] == "Technique")
                {
                modalRowString += "<tr>";
                modalRowString += "<td>" + procedureNameFilter[i]  +"</td>";
                modalRowString += "<td>" + procedureLevelFilter[i]  +"</td>";
                modalRowString += "<td>" + procedureLocationFilter[i]  +"</td></tr>";
                    
                modalTContainer.innerHTML += modalRowString;
                    }
                         
                
                
            }
        
        
                    
            
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function submitInquiry()
{
    //for tumor location
    for(i=1; i<8; i++)
    {
        var locationRadioButtonId = 'tumorLocation0' + i;
        
        if (document.getElementById(locationRadioButtonId).checked)
            {
                selectedTumorLocation = document.getElementById(locationRadioButtonId).value;
            }
    }
    
    //for volume removed 
    for(i=1; i<4; i++)
    {
        var volumeRadioButtonId = 'volumeRemoved0' + i;
        
        if (document.getElementById(volumeRadioButtonId).checked)
            {
                selectedVolumeRemoved = document.getElementById(volumeRadioButtonId).value;
            }
    }
    
    
    //for density
    for(i=2; i<4; i++)
    {
        var densityRadioButtonId = 'breastDensity0' + i;
        
        if (document.getElementById(densityRadioButtonId).checked)
            {
                selectedDensity = document.getElementById(densityRadioButtonId).value;
            }
    }
    
    //for smoking/diabetes
    highRiskFactors = false;//reset every time
    if (document.getElementById('smoking').checked || document.getElementById('diabetic').checked)
    {
        highRiskFactors = true;
    }


    fetchData();
}

// Call the fetchData function when the page is loaded
//window.onload = fetchData;