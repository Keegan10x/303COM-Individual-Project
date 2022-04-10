/* home.js */

import { customiseNavbar } from "../util.js";

export async function setup(node) {
  console.log("HOME: setup");
  try {
    let admin = await addSurvey(node)
    console.log("ADMIN IS", admin) 
    console.log(node);
    document.querySelector("header p").innerText = "Home";
    customiseNavbar(["home", "newsurvey", "logout", "surveyQuestions", "mySurveys"]); // navbar if logged in
    const token = localStorage.getItem("authorization");
    console.log(token);
    if (token === null) customiseNavbar(["home", "register", "login"]); //navbar if logged out

    //if (!admin && token) customiseNavbar(["home", "logout", "surveyQuestions"]); //if not admin
	  
    //call functions here
    console.log('SURVEYS')
    //await addContent(node)
    //await addSurvey(node)
  } catch (err) {
    console.error(err);
  }
}

async function addSurvey(node){
	console.log('SHOWING SURVEYS')
	const uri = "https://42559ljglh.execute-api.us-east-1.amazonaws.com/surveys"
	
	//IF AUTHORIZED
	if(localStorage.getItem("authorization")){
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
		popSurveyFrags(node, surveyObj)
	}
	
	//IF UNAUTHORIZED
	if(!localStorage.getItem("authorization")){
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/vnd.api+json",
			},
		}
		const rsp = await fetch(uri, options)
		const surveyObj = await rsp.json()
		console.log(surveyObj)
		popSurveyFrags(node, surveyObj)
	}
}

function popSurveyFrags(node, obj){
	const template = document.querySelector('template#surveys')
	for(const survey of obj){
		const fragment = template.content.cloneNode(true)
		
		const section = document.createElement('section')
		const h2 = document.createElement('h2')
		const time = document.createElement('time')
		const descPara = document.createElement('p')
		
		h2.innerText = survey.name
		time.innerText = `Date Created: ${survey.created}`
		descPara.innerHTML = survey.description
		
		section.appendChild(h2)
		section.appendChild(time)
		section.appendChild(descPara)
		
		
		if(survey.href){
			const link = document.createElement('a')
			link.innerText = 'TAKE SURVEY'
			link.href = `/surveyQuestions?survey=${survey.id}`
			section.appendChild(link)
		}else{
			const score = document.createElement('p')
			score.innerText = `Survey Completed`
			section.appendChild(score)
		}
		
		fragment.appendChild(section)
		node.appendChild(fragment)
	}
}