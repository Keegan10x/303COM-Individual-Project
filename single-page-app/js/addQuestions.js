window.myGlobalVariable = {
	questions:[],
	descriptions:[],
	counter: 0
}



import {
  customiseNavbar,
  file2DataURI,
  loadPage,
  secureGet,
  showMessage,
} from "../util.js";



export async function setup(node) {
  console.log("surveyQuetions: setup");
  try {
    console.log(node);
    document.querySelector("header p").innerText = "Add Questions";
    customiseNavbar(["home", "logout", "newsurvey"]);
    if (localStorage.getItem("authorization") === null) loadPage("login");
    // there is a token in localstorage
	
    createForm(node)
   
    //ADD TITLE & DESCRIPTION
    node.querySelector('button[name="add"]').addEventListener('click', (event)=>{
	if(!document.querySelector('textarea').value && !document.querySelector('input[name="title"]').value){
		console.warn('Missing Fields')
	}else if(document.querySelector('textarea').value && document.querySelector('input[name="title"]').value){
		window.myGlobalVariable.counter ++
		
		//this is the db.js button script
		//had trouble trying to reference its local location. Saved it to discord to generate a URL
		//file contents exactly the same as ./button.js 
		const btnscr = "https://cdn.discordapp.com/attachments/814265938832654357/915002023462727750/button.js"
		
		const scrp =  document.createElement('script')
		scrp.setAttribute('src', btnscr)
		
		const removebutton =  document.createElement('button')
		removebutton.setAttribute('name', 'remove')
		removebutton.setAttribute('id', "rb"+window.myGlobalVariable.counter.toString())
		removebutton.setAttribute('onclick', "getId(this)")
		removebutton.innerText = 'REMOVE'
		

		console.log(window.myGlobalVariable.counter)
		const template = document.querySelector('template#surveyQuestions')
		const fragment = template.content.cloneNode(true)
		const article = document.createElement('article')
		article.setAttribute('id', `${window.myGlobalVariable.counter.toString()}`)
		
		const h2 = document.createElement('h2')
	
		let converter
		const section = document.createElement('section')
		const markdown = document.querySelector('textarea').value.replace('\n', '')
		//markdown
		converter = new showdown.Converter({'tables': true, 'tasklists': true, 'strikethrough': true})
		const options = converter.getOptions()
		const html = converter.makeHtml(markdown)
		section.innerHTML = html
		window.myGlobalVariable.descriptions.push(html)
		
		const title = document.querySelector('input[name="title"]').value
		h2.innerText = title
		window.myGlobalVariable.questions.push(title)
		
		document.querySelector('textarea').value = ''    
		document.querySelector('textarea').select()

		document.querySelector('input[name="title"]').value = ''
		document.querySelector('input[name="title"]').select()
		article.appendChild(h2)
		article.appendChild(section)
		article.appendChild(removebutton)
		
		document.getElementById("qcards").appendChild(article)
		document.getElementById("qcards").appendChild(scrp)
		console.log(window.myGlobalVariable.questions)
		console.log(window.myGlobalVariable.descriptions)
		
	}
    })

        
    node.querySelector('button[name="submit"]').addEventListener('click', await send)	  
    //node.querySelector("form").addEventListener("submit", await respond);
  } catch (err) {
    console.error(err);
  }
}

async function send(){
	if(window.myGlobalVariable.questions.length === 0 && window.myGlobalVariable.descriptions.length === 0){
		console.warn("Nothing to submit")
	}else if(window.myGlobalVariable.questions.length > 0 && window.myGlobalVariable.descriptions.length > 0){
	
	console.log("SUBMITTING")
	    
	    const postQuestions = []
		for(const index in window.myGlobalVariable.questions){
		postQuestions.push({ title: window.myGlobalVariable.questions[index], description: window.myGlobalVariable.descriptions[index] })
	    }
	    
	    const uriParams = new URLSearchParams(window.location.search)
	    const surveyid = uriParams.get('mysurvey')
	    const uri = `https://42559ljglh.execute-api.us-east-1.amazonaws.com/mysurveys/${surveyid}`
	    const auth = localStorage.getItem("authorization")
	    
	    const options = {
		    method: "POST",
		    headers: {
			    "Content-Type": "application/json",
			    "Authorization": auth
		    },
		    body: JSON.stringify(postQuestions)
		    
	    }
	    console.log('posting these options')
	    console.log(options)
	    try{
		    const response = await fetch(uri, options)
		    const json = await response.json()
		    console.log(json)
	    }catch(err){
		    console.log(err)
	    }finally{
		 loadPage("home")   
	    }
	}
}




function createForm(node){
	const template = document.querySelector('template#addQuestions')
	const fragment = template.content.cloneNode(true)
	//const form = document.createElement('form')
	const qstLabel = document.createElement('label')
	qstLabel.innerText = 'Question Title'
	qstLabel.htmlFor = 'title'
	const question = document.createElement('input')
	question.setAttribute('name', 'title')
	question.attributes["required"] = "required"
	const dscrLabel = document.createElement('label')
	dscrLabel.innerText = 'Question Description'
	dscrLabel.htmlFor = 'description'
	const description = document.createElement('textarea')
	description.attributes["required"] = "required"
	qstLabel.appendChild(document.createElement('br'))
	
	fragment.appendChild(qstLabel)
	fragment.appendChild(question)
	
	fragment.appendChild(document.createElement('br'))
	dscrLabel.appendChild(document.createElement('br'))
	
	fragment.appendChild(dscrLabel)
	fragment.appendChild(description)
	
	const addbutton =  document.createElement('button')
	addbutton.setAttribute('name', 'add')
	addbutton.innerText = 'ADD'
	
	
	
	
	const submit = document.createElement('button')
	submit.setAttribute('name', 'submit')
	submit.innerText = 'SUBMIT'
	
	node.appendChild(fragment)
	node.appendChild(addbutton)

	node.appendChild(submit)
}



