const { cp } = require("fs")
const { get } = require("http")
const puppeteer = require( "puppeteer" )

const codeObj =  require('./code')

const loginLink = "https://www.hackerrank.com/auth/login"



/*
  loging to hackerrank home page
  puppeteer initiated and browser instance created  headless false to make browser visible 
  '--start-maximized' makes the chromium browser to be opened in full screen  
*/

const email = 'gebetab423@kuruapp.com'
const password = '123456'

let browserOpen = puppeteer.launch({
   headless : false,

   args :["--start-maximized"],

   defaultViewport:null
    

})
let page = 

browserOpen.then( function( browserObj ){
    let browserOpenPromise = browserObj.newPage()
    /* browser opens new page or new tab */
    return browserOpenPromise;
}).then(function(newTab){

    page = newTab
    let hackerRankOpenPromise = newTab.goto( loginLink )
    return hackerRankOpenPromise;
    /* opening hackerRank signUp page in a new Tab */

}).then(function(){

    let emailIsEntered = page.type("input[id='input-1']" , email,{delay : 50})
    return emailIsEntered;
    /* targetting email field and inputting */

}).then(function(){

    let passwordIsEntered = page.type("input[type='password']" , password,{delay : 50})
    return passwordIsEntered;
     /* targetting passWord field and inputting */

}).then(function(){
    let loginButtonClicked = page.click('button[data-analytics="LoginPassword"]',{delay:50})
    return loginButtonClicked;
    /* targetting LoginButton field and Clicking */

}).then(function(){
    /*targetting algorithm section */
    let clickOnAlgoPromise = waitAndClick('.topic-card a[data-attr1="algorithms"]' , page)
    return clickOnAlgoPromise;
}).then(function(){
    /* clicking on warm up section checklist in right side of page */

    let getToWarmUp = waitAndClick('input[value="warmup"]', page)
    return getToWarmUp;

}).then(function(){

    /* waiting for 3 sec to get number of questions */
    let waitFor3Seconds = page.waitFor(3000)
    return waitFor3Seconds;
}).then(function(){
    /* double doller not Jquerry its document.query select short form */
    let allChallengesPromise = page.$$('.ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled',{delay:50})
    return allChallengesPromise;
}).then(function(questionArray){
 
    console.log("number of questions ",questionArray.length)
    let questionWillBeSolved = questionSolver(page, questionArray[0] , codeObj.answers[0])
    return questionWillBeSolved;
})

/* Waiting till the proper attributes or elements are available
sometimes pages will take more time to load till than the page will wait.
*/
function waitAndClick(selector , cPage){
/**
 * selector which tobe identified .
 * Cpage means the current Page which we are in .
 */

  return new Promise(function(resolve , reject ){
      
    let waitForModelPromise = cPage.waitForSelector(selector)
    waitForModelPromise.then(function(){
        /**
         * waiting till selector found when selector returned click
         */
        let clickModal = cPage.click(selector)
        return clickModal;
    }).then(function(){

        resolve()

    }).catch(function(err){

        reject()

    })

  })
}

/* question solver function takes question page , question number and answer code*/
function questionSolver( page ,question ,answer ) {
    return new Promise(function(resolve , reject){

        let questionWillBeClicked = question.click()
        questionWillBeClicked.then(function(){
            /**now going to text area to type code */
            let EditorInFocusPromise = waitAndClick('.monaco-editor.no-user-select.vs' , page)
            return EditorInFocusPromise;

        }).then(function(){

            return waitAndClick('.checkbox-input' , page)

        }).then(function(){
            /* selecting check box we cant directly type in editor
            because of auto filling . so we are typing in custom input 
            section .
            */
            return page.waitForSelector('textarea.custominput', page)
        }).then(function(){
            
            return page.type('textarea.custominput' , answer , {delay : 20})

 
        }).then(function(){

            /* selecting like ctrl all and cut and pasting in code edtior */
            let ctrlIsPressed = page.keyboard.down('Control');
            return ctrlIsPressed;
        }).then(function(){
            let Aispressed = page.keyboard.press('A' , {delay : 100})
            return Aispressed;
        }).then(function(){
            let Xispressed = page.keyboard.press('X' , { delay : 100})
            return Xispressed;
        }).then(function(){

            let ctrlIsUnpressed = page.keyboard.up('Control')
            return ctrlIsUnpressed;

        }).then(function(){
            let mainEditorInFocus = waitAndClick('.monaco-editor.no-user-select.vs' , page)
            return mainEditorInFocus;
            /* selecting editor to paste answer */

        }).then(function(){
            let ctrlIsPressed = page.keyboard.down('Control');
            return ctrlIsPressed;
            
        }).then(function(){

            let Aispressed = page.keyboard.press('A' , {delay : 100})
            return Aispressed;

        }).then(function(){
            let Vispressed = page.keyboard.press('V' , {delay : 100})
            return Vispressed;
        }).then(function(){
            let ctrlIsUnpressed = page.keyboard.up('Control')
            return ctrlIsUnpressed;
            /* ctrl V and ctrl released */
        }).then(function(){
            return page.click('.hr-monaco__run-code' , {delay : 50})
        }).then(function(){
            resolve()
        }).catch(function(err){
             reject();
        })

    })
}