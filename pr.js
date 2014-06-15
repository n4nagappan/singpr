var casper = require('casper').create();
var fs = require('fs');

var credentials = JSON.parse(fs.read('credentials.json'));

function selectForm()
{
    var targetDocument = document.querySelector('frame[name="bottomFrame"]').contentDocument.querySelector('frame[name="mainFrame"]').contentDocument;
    var e = targetDocument.querySelector('.txtFill_singleLine');
    //console.log(e.getAttribute("name"));
    e.selectedIndex = 7;
    e.onchange();
}

function fillForm(credentials)
{
    var targetDocument = document.querySelector('frame[name="bottomFrame"]').contentDocument.querySelector('frame[name="mainFrame"]').contentDocument;
    var e = targetDocument.querySelector('input[name="apptDetails.identifier1"]');
    //console.log(e.getAttribute("name"));
    e.value = credentials.fin;
    var e = targetDocument.querySelector('input[name="apptDetails.identifier2"]');
    e.value = credentials.peopleCount;
    var e = targetDocument.querySelector('input[name="apptDetails.identifier3"]');
    e.value = credentials.contact;   
    var e = targetDocument.querySelector('input[name="Submit"]');
    e.click();       
}

function countAvailableDates()
{
    var obj = {};
    var e = document.querySelector('#main > form > table:nth-child(81) > tbody > tr:nth-child(6) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td.txtBlk > strong');    
    var txt = e.textContent;
    obj.month = txt.replace(/(?:\r\n|\r|\n|\t)/g,'').trim();    
    var e = document.querySelectorAll('td.cal_AS');    
    obj.available = e.length;
    var arr = [];
    if(e.length > 0)
    {
        for(i=0;i<e.length;++i)
            arr.push(e[i].querySelector('div > table > tbody > tr > td').textContent.trim());
    }
    obj.availableDates = arr;
    
    var e = document.querySelectorAll('td.cal_AF');    
    obj.booked = e.length; 
    var e = document.querySelectorAll('td.cal_PH');    
    obj.holidays = e.length; 

    //console.log(JSON.stringify(obj,null,2));
    
    return obj;
}

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: \n' + msg);
})

casper.start('https://eappointment.ica.gov.sg/ibook/index.do',function(){
    //this.capture('pr.png');
    this.evaluate(selectForm);
});

casper.then(function(){
   this.evaluate(fillForm,credentials);
});

var jsonArr = [];

for(i = 0; i<12; ++i)
{
    //Count the number of 
    casper.withFrame('bottomFrame', function() {
        this.withFrame('mainFrame',function(){
           obj = this.evaluate(countAvailableDates);
           //console.log(JSON.stringify(obj,null,2));
           jsonArr.push(obj);
        });
    });

    casper.withFrame('bottomFrame', function() {
        this.withFrame('mainFrame',function(){
            	casper.click('a[href="javascript:doNextMth(document.forms[0]);"]');
        });
    });
    
    //casper.then(function(){
    //   this.capture('pr.png');  
    //});
}

casper.then(function(){
    console.log(JSON.stringify(jsonArr));
});
casper.run();
