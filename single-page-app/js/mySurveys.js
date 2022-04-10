/* mySurveys.js */

import {
  customiseNavbar,
  file2DataURI,
  loadPage,
  secureGet,
  showMessage,
} from "../util.js";


export async function setup(node) {
  console.log("mySurveys: setup");
  try {
    console.log(node);
    document.querySelector("header p").innerText = "My Surveys";
    customiseNavbar(["home", "logout", "newsurvey", "mySurveys"]);
    if (localStorage.getItem("authorization") === null) loadPage("login");
    // there is a token in localstorage
    
    //get my surveys <-----
    await getMySurveys(node)
  } catch (err) {
    console.error(err);
  }
}


async function getMySurveys(node){
	console.log("GETTING MY SURVEYS")
	const uri = "https://42559ljglh.execute-api.us-east-1.amazonaws.com/mysurveys"
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/vnd.api+json",
			"Authorization": localStorage.getItem("authorization"),
		},
	}
	const rsp = await fetch(uri, options)
	const surveyObj = await rsp.json()
	console.log(surveyObj)
	
	
	
	//create dom
	const template = document.querySelector('template#mySurveys')
	const fragment = template.content.cloneNode(true)
	for(const survey of surveyObj){
		const section = document.createElement('section')
		
		const name = document.createElement('h2')
		const created = document.createElement('time')
		const space = document.createElement('p')
		const link = document.createElement('a')
		link.innerText = 'ADD QUESTIONS'
		
		name.innerText = survey.name
		created.innerText = `Date Created: ${survey.created}`
		space.innerText = ' '
		link.href = `/addQuestions?mysurvey=${survey.id}`
		
		section.appendChild(document.createElement('hr'))
		section.appendChild(name)
		section.appendChild(created)
		section.appendChild(space)
		section.appendChild(link)
		
		fragment.appendChild(section)
		//fragment.appendChild(document.createElement('hr'))
	}
	node.appendChild(fragment)
}