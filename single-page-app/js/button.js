function getId(btn){
	const questionid = btn.id.replace('rb','')
		
	const deleted = document.getElementById(questionid)
	const title = deleted.querySelector('h2').innerText
	const dscr = deleted.querySelector('section').innerHTML
	console.log("DELETING")
	
	const tIdx = window.myGlobalVariable.questions.indexOf(title)
	window.myGlobalVariable.questions.splice(tIdx, 1)
	
	const dIdx = window.myGlobalVariable.descriptions.indexOf(dscr)
        window.myGlobalVariable.descriptions.splice(dIdx, 1)
	
	deleted.parentNode.removeChild(deleted)
	window.myGlobalVariable.counter --
	
	console.log(window.myGlobalVariable)
}