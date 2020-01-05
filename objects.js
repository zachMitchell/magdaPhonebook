//Made by Zachary Mitchell in 2019!
//Per-normal, things got large so I'm moving object definitions over here

/*The following static objects are used to store contacts and categories, as well as backtrace via the dom. The objects are dependant on their respective section.
Due to complexities of indexing and arrays generally being slower to iterate, the static objects use an associative array-like approach.
*/

/*These are sorted to be relocated through the DOM. they are independent from categories.
Syntax: Zachary Mitchell = "zm0". If there's another contact with the same first and last name letters, the number will be incremented (e.g zm1)
There will also be an integer system to keep track of instances of names, for example, let's say there'vs a key of zm. 
    this will be an integer that will say what the next index for that combination will be.
*/
var contactObjects = {

}

var categories = {

}

//Both of these objects have DOM elements tied to them:
//Contact object - contains basic information including name and phone.
function contact(fname='',lname='',number=''){
    //Initialize dom elements:
    this.inDom = document.createElement('div');
    this.inDom.className = 'contactDiv';
    this.inDom.innerHTML='<input type="checkbox" class="conCheck"/><input placeholder="First Name" class="fname"><input placeholder="Last Name" class="lname"><input placeholder="Phone Number" class="number"> <button class="conDelBtn">X</button> <br>';
    this.outDom = document.createElement('div');
    this.outDom.innerHTML = '<h2><span class="ofname"></span> <span class="olname"></span></h2><h3 class="onumber"></h3><br>';

    //Set one of the primary avaiable variables: first name, last name, and number
    this.setAttribute = function (target,value){
        //If value is something else, convert to string:
        value = ''+value;
        var allowedAttributes = ['fname','lname','number'];
        if(allowedAttributes.indexOf(target) > -1){
            var finalVal = '';
            //Since there's allot of things to filter out, parsing will be manual here:
            for(var i = 0;i<value.length;i++){
                //If this is a phone number, take out anything that's not a number
                if(target!='number' || target == 'number' && !isNaN(value[i]) && value[i]!== ' ')
                    if( (i>0 && value[i]!=',') || (i == 0 && '|),'.indexOf(value[i]) ==-1)) //Remove custom file-type syntax if that slips in.
                        finalVal+=value[i];
            }

            //set internal value and dom elements:
            this[target] = finalVal;
            this.inDom.getElementsByClassName(target)[0].value = finalVal;
            if(target == 'number'){
                //Numbers will work differently then other values. In the element, the value will be stored alongside a formatted one.
                var outSpan = this.outDom.getElementsByClassName('o'+target)[0]

                if(finalVal.length > 10)
                    outSpan.innerHTML = "("+finalVal.substring(0,3)+ ") " + finalVal.substring(3);
                else if(finalVal.length == 10)
                    outSpan.innerHTML = "("+finalVal.substring(0,3)+ ") " + finalVal.substring(3,6) + " - " + finalVal.substring(6);
                else if (finalVal.length == 7)
                    outSpan.innerHTML = finalVal.substring(0,3) + " - " + finalVal.substring(3);
                else outSpan.innerHTML = finalVal;

                outSpan.dataset.value = finalVal;
            }
            else this.outDom.getElementsByClassName('o'+target)[0].innerHTML = finalVal;

            return finalVal;
        }
        else console.error('The function can only accept the following: '+allowedAttributes.join(', ')+'.');
    }

    //Core Attributes (Please do not set directly)
    this.setAttribute('fname',fname);
    this.setAttribute('lname',lname);
    this.setAttribute('number',number);

    // console.log(fname,lname,number);
    //Permanent ID of this contact. Will not change unless the page is refreshed / contact is deleted.
    this.contactObjId = this.fname[0] + '' + this.lname[0];
    // console.log(this.contactObjId)
    //Define integer index if it doesn't exist:
    if(contactObjects[this.contactObjId] === undefined) contactObjects[this.contactObjId] = 0;
    //Increment integer index by one:
    contactObjects[this.contactObjId]++;
    this.contactObjId+=contactObjects[this.contactObjId]-1;
    //From here on out we're not referencing the integer index, we're referencing this object.
    contactObjects[this.contactObjId] = this;

    //(inDom) Add event listeners and contact object ID:
    this.inDom.dataset.contactObjId = this.contactObjId;
    for(var i of this.inDom.getElementsByTagName('input')){
        if(i.type!='checkbox') i.onchange = function(){
            contactObjects[this.parentElement.dataset.contactObjId].setAttribute(this.className,this.value);
        }
    }

    //Event listener for the delete button:
    var conDelBtn = this.inDom.getElementsByClassName('conDelBtn')[0];
    conDelBtn.dataset.contactObjId = this.contactObjId;
    conDelBtn.onclick = function(){
        var contactObj = contactObjects[this.parentElement.dataset.contactObjId];
        if(confirm('Delete this contact? '+contactObj.fname+' will miss you :(')){
            //Delete this object, along with any references there might be:
            contactObj.dereference();
        }
    }
                
    //Get rid of all contact connections
    this.dereference = function(){
        //Category dereference:
        var targetCategory = categories[this.inDom.parentElement.parentElement.dataset.catId];
        //Remove from category array:
        delete targetCategory.contacts[targetCategory.contacts.indexOf(this)];

        targetCategory.refreshContacts();
        /*Finally, remove from "contactObjects".
        NOTE: the id associated to this object stays if you keep the object referenced. To have this object work again, manual assignment to this "contactObjects" is required.*/
        delete contactObjects[this.contactObjId];

        //Just in case there was something else you wanted to do with it:
        return this;
    }
}

//Category - contains information such as section color, font, and current contacts.
function category(name='',font='',color='#000000'){
    this.inDom = document.createElement('div');
    this.inDom.className = 'categoryDiv';
    //the div tag on the end of this next variable is where the list of contacts will go (or at least their associated DOM element.)
    this.inDom.innerHTML = '<span class="catContainer"><input class="catName" placeholder="Category name"><input placeholder="Font" class="catFont" readonly></input><input type="color" class="catColor" placeholder="Text color"></span><button class="delCatBtn">X</button><div class="catContacts"></div><button class="newContactBtn" onclick="this.parentElement.getElementsByClassName(\'addContactInterface\')[0].style.display=\'\'">Add new contact</button>';
    this.outDom = document.createElement('div');
    this.outDom.innerHTML = '<h1 class="catHeader"></h1><div class="outCatContacts"></div>';
    this.outDom.className = 'oCategoryDiv';
    this.setAttribute = function(target,value){
        if(['name','color','font'].indexOf(target) > -1 && value!==undefined){
            value = ''+value;
            //ommit anything that could trip the custom file format:
            var finalVal = '';
            for(var i = 0;i<value.length;i++)
                //Go through the parse dance again
                if( (i>0 && value[i]!=',') || (i == 0 && '|),'.indexOf(value[i]) ==-1))
                    finalVal+=value[i];

            this[target] = finalVal;
            this.inDom.getElementsByClassName('cat'+target[0].toUpperCase()+target.substring(1))[0].value=finalVal;
            //Output:
            switch(target){
                case 'name': this.outDom.getElementsByClassName('catHeader')[0].innerHTML = finalVal;
                break;
                case 'color': this.outDom.style.color = finalVal;
                break;
                case 'font': this.outDom.style.fontFamily = finalVal;
            }
        }
        else if(value !== undefined) console.error('The function only accepts the following: name, color, font.');
    }
    //Sort contacts by first name or last name, then re-insert elements into the system:
    //If there's a huge amount of contacts in the list, you can optionally not sort at all and just add ones not in the DOM yet.
    this.refreshContacts = function(sort = true,firstLast = true){
        var resultInElement = this.inDom.getElementsByClassName('catContacts')[0];
        var resultOutElement = this.outDom.getElementsByClassName('outCatContacts')[0];
        if(sort){
            resultInElement.innerHTML = "";
            resultOutElement.innerHTML = "";
            //sort by first name or last name:
            var sortBy = (firstLast?'f':'l')+'name';
            //Rid the array of anything other then objects (basically make a new array):
            var popIndex = 0;
            this.contacts = this.contacts.filter(e=>typeof e == 'object').sort((e,f)=>e[sortBy] > f[sortBy]?1:-1);

            //print elements to the respective dom elements:
            for(var i of this.contacts){
                //Input dom
                resultInElement.appendChild(i.inDom);
                //Output dom
                resultOutElement.appendChild(i.outDom);
            }    
    
        }
        else{
            //Simply compare the size differences and add the most recent elements to the dom:
            if(this.contacts.length > resultInElement.children.length){
                var lengthCount = 0;
                for(var i = 0;resultInElement.children.length < this.contacts.length;i++)
                    resultInElement.appendChild(this.contacts[resultInElement.children.length+i].inDom);                                
            }
        }
}

    this.setAttribute('name',name);
    this.setAttribute('font',font);
    this.setAttribute('color',color);
    this.contacts = [];
    //The id system of categories will be a little different. (This needs to be set before name is set...)
    this.catId = this.name.length? this.name[0]:'';
    if(categories[this.catId] == undefined) categories[this.catId] = 0;
    //Indcrement the base id
    categories[this.catId]++;
    this.catId+=categories[this.catId]-1;
    //Referencing this object now (...yes it's confusing XP):
    categories[this.catId] = this;

    //Insert this new id into the required elements (Also add event listeners):
    var catContainer = this.inDom.getElementsByClassName('catContainer')[0];
    this.inDom.dataset.catId = this.catId;
    for(var i of catContainer.children){
        i.onchange = function(){
            categories[this.parentElement.parentElement.dataset.catId].setAttribute(this.className.substring(3).toLowerCase(),this.value);
        }
    }

    //"Add new contact" system. When this section is filled out, it hides, then a function is run here to create the contact.
    var addNewContact = document.createElement('div');
    addNewContact.className='addContactInterface';
    addNewContact.innerHTML = '<input class="newCFName" placeholder="First Name"/><input class="newCLName" placeholder="Last Name"/><input class="newCNumber" placeholder="Phone Number"/><button onclick="categories[\''+this.catId+'\'].appendNewContact(this.parentElement)">Add!</button><button onclick="categories[\''+this.catId+'\'].clearAndHideAddInterface(this.parentElement)">Cancel</button>';
    addNewContact.style.display = 'none';
    this.inDom.appendChild(addNewContact);

    this.clearAndHideAddInterface = function(iSrc){
        var interface = iSrc?iSrc:this.inDom.getElementsByClassName('addContactInterface')[0];
        for(var i of interface.getElementsByTagName('input')) i.value = '';
        interface.style.display = 'none';
    }

    this.appendNewContact = function(iSrc){
        var contactArgs = [];
        var everythingValid = true;
        for(var i of iSrc.getElementsByTagName('input')){
            if(i.value == ''){
                alert('Sorry, all the information should be filled in first :/');
                everythingValid = false;
                break;  
            }
            contactArgs.push(i.value);
        }
        if(everythingValid){
            this.contacts.push(new contact(...contactArgs));
            this.refreshContacts();
            this.clearAndHideAddInterface(iSrc);
        }
    }

    this.inDom.getElementsByClassName('delCatBtn')[0].onclick = function(){
        var targetCat = categories[this.parentElement.dataset.catId];
        if(confirm('Delete '+targetCat.name + '?')){
            var keepContacts = confirm('Move contacts to the blank category?');
            if(keepContacts){
                //Find the blank category; if it doesn't exist make it:
                var existingCat = catQuery('');
                if(!existingCat) existingCat = domInterface.addNewCategory();
                for(var i of targetCat.contacts) existingCat.contacts.push(i);
                existingCat.refreshContacts();
            }
            //Obliterate EVERYTHING
            else for(var i of targetCat.contacts) i.dereference();

            editorField.removeChild(targetCat.inDom);
            previewField.removeChild(targetCat.outDom);
            //Remove from internal addressing:
            delete categories[targetCat.catId];
        }
    }

    //Font event listener:
    this.inDom.getElementsByClassName('catFont')[0].onclick=function(){
        fontUI.resetUI();
        fontUI.categoryToChange=categories[this.parentElement.parentElement.dataset.catId];
        fontSettings.style.display='';
    }

}