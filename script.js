
let usersArr = [];
let queriedUsersArr = [];
let activePage = 1;   

window.onload = () => {

    fetchAllUSers('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');

};

const fetchAllUSers = async (url) => {

    const data = await fetch(url);

    const parsedData = await data.json();
    
    usersArr = parsedData.map((userObj) => userObj);

    appendUsers(usersArr,0,9);

};

const appendUsers = (usersArr,startIdx,endIdx) => {

    const adminsDataRows = document.getElementsByClassName('admins-data-rows')[0];
    
    adminsDataRows.innerHTML = "";

    const adminsDataHeadings = `<li class="admins-data-row-heading flex items-center border-b-2 py-3">
                                    <div class="checkbox grow shrink basis-1/5 px-2 flex items-center"><input onclick="checkUncheckAll(this)" type="checkbox" name="" id="" class="w-4 h-4"></div>
                                    
                                    <span id="name" class="grow shrink basis-1/5 font-bold">Name</span>
                                    <span id="email" class="grow shrink basis-1/5 font-bold">Email</span>
                                    <span id="role" class="grow shrink basis-1/5 font-bold">Role</span>
                                    <span id="actions" class="grow shrink basis-1/5 font-bold">Actions</span>
                                </li>`;

    adminsDataRows.insertAdjacentHTML('beforeend', adminsDataHeadings);

    for (let i = startIdx; i <= endIdx; i++) {
        const id = usersArr[i].id;
        const name = usersArr[i].name;
        const email = usersArr[i].email;
        const role = usersArr[i].role;

        const adminsDataRow = `<li data-id=${id} class="admins-data-row flex items-center border-b-2 py-3 gap-4">
                                    <div class="checkbox grow shrink basis-1/5 px-2"><input onclick="checkboxEvent(event)" type="checkbox" name="" id="" class="data-row w-4 h-4"></div>
                                    <p class="name grow shrink basis-1/5">${name}</p>
                                    <p class="email grow shrink basis-1/5">${email}</p>
                                    <p class="role grow shrink basis-1/5">${role}</p>
                                    <div class="actions grow shrink basis-1/5 flex items-center gap-8">
                                        <button onclick=handleEditRow(event)><i class="fa-solid fa-pen-to-square"></i></button>
                                        <button onclick=handleDoneEditRow(event) hidden><i class="fa-solid fa-circle-check"></i></button>
                                        <button onclick=handleDeleteRow(event)><i class="fa-sharp fa-solid fa-trash text-red-500"></i></button>
                                    </div>
                               </li>`;
        adminsDataRows.insertAdjacentHTML('beforeend', adminsDataRow);     
    }

    appendPagesButtons(usersArr);

};

const appendPagesButtons = (usersArr) => {

    const pagesButtons = document.getElementById('pages-buttons');
    pagesButtons.innerHTML = "";
    let pageNo = 1;

    for (let i = 1; i <= usersArr.length; i += 10) {
        const pageBtn = `<button class="page-button border border-solid border-black flex justify-center items-center px-3 py-1 rounded-full">${pageNo++}</button>`;
        pagesButtons.insertAdjacentHTML('beforeend', pageBtn);
    }

    addClassActivePage();

};

const handlePageNavigation = (e) => {

    if (e.target.tagName === 'I') {
        const btn = e.target.closest('button');
        
        handlePageNavigationSpecial(btn);

    } 
    
    else if (e.target.tagName === 'BUTTON') {

        const btn = e.target;

        if (!Boolean(btn.id)) {
            const pageNo = e.target.innerText;
            activePage = pageNo;
            
            const arr = queriedUsersArr.length > 0 ? queriedUsersArr : usersArr;

            const startIdx = Number(String(pageNo-1) + "0");
            const endIdx = (arr.length >= startIdx+10) ? startIdx + 9 : arr.length-1;

            appendUsers(arr,startIdx,endIdx);
        } 
        
        else {
            handlePageNavigationSpecial(btn);
        }

    }

};

const handlePageNavigationSpecial = (btn) => {
    switch (btn.id) {

        case "first-page": {
            if (activePage != null) {
                if (queriedUsersArr.length != 0) {
                    const endIdx = (queriedUsersArr.length >= 10) ? 9 : queriedUsersArr.length-1;
                    appendUsers(queriedUsersArr,0,endIdx);
                } else {
                    appendUsers(usersArr,0,9)
                }
                activePage = 1;
                addClassActivePage();
            }
            break;
        }

        case "previous-page": {
            if (activePage != null && activePage != 1) {
                const hasQueryArray = Boolean(queriedUsersArr.length); 

                const startIdx = Number(String(activePage-2) + "0");
                const endIdx = startIdx + 9;
                const arr = hasQueryArray ? queriedUsersArr : usersArr;
                appendUsers(arr,startIdx,endIdx);                    

                if (activePage != 1) {
                    activePage--;
                    addClassActivePage();
                }
            }
            break;
        }

        case "next-page": {
            if (activePage != null && activePage != 5) {
                const hasQueryArray = Boolean(queriedUsersArr.length);
                const hasQueryArrayLength = queriedUsersArr.length > Number(String(activePage) + "0");

                if (hasQueryArray && !hasQueryArrayLength) break;

                const startIdx = Number(String(activePage) + "0");
                const endIdx = hasQueryArrayLength ? (queriedUsersArr.length < Number(String(Number(activePage) + 1) + "0") ? queriedUsersArr.length-1 : startIdx + 9) : (usersArr.length < Number(String(Number(activePage) + 1) + "0")) ? usersArr.length-1 : (startIdx + 9);
                const arr = hasQueryArrayLength ? queriedUsersArr : usersArr;
                appendUsers(arr,startIdx,endIdx);                    

                if (activePage != 5) {
                    activePage++;
                    addClassActivePage();
                }
            }
            break;
        }

        case "last-page": {
            if (activePage != null && activePage != 5) {

                const hasQueryArray = Boolean(queriedUsersArr.length);

                const arr = hasQueryArray ? queriedUsersArr : usersArr;

                const startIdx = ((arr.length / 10) % 1 !== 0) ? Number(String(Math.floor(arr.length / 10)) + "0") : Number(String((arr.length / 10) - 1) + "0") ;
                const endIdx = arr.length-1;
                appendUsers(arr,startIdx,endIdx);
                
                activePage = ((arr.length / 10) % 1 !== 0) ? Math.floor(arr.length / 10) + 1 : (arr.length / 10);
                addClassActivePage();
                
            }
            break;
        }

    }
};

const preventFormDefault = (e) => {
    e.preventDefault();
}

const handleQuery = (e) => {

    if (e.key == 'Enter' || e.target.classList.contains('search')) {
        console.log('clicked');
    
        const input = document.getElementsByTagName('input')[0];
        const query = input.value;

        queriedUsersArr = usersArr.filter((user) => {
            if (user.name.startsWith(query) || user.email.startsWith(query) || user.role.startsWith(query)) {
                return user;
            }
        })

        activePage = (queriedUsersArr.length == 0) ? null : 1; 

        const startIdx = (queriedUsersArr.length != 0) ? 0 : false;
        const endIdx = (queriedUsersArr.length >= 10) ? 9 : queriedUsersArr.length-1; 

        appendUsers(queriedUsersArr,startIdx,endIdx);

    }
    
};

const handleDeleteRow = (e) => {

    const adminsDataRow = e.currentTarget.closest('li');
    const userId = adminsDataRow.getAttribute('data-id');

    const hasQueryArray = Boolean(queriedUsersArr.length);

    const arr = hasQueryArray ? queriedUsersArr : usersArr;

    findUserToDelete(arr,userId,hasQueryArray);

    const startIdx = Number((activePage-1).toString() + "0");
    const endIdx = (arr.length >= startIdx+10) ? startIdx+9 : arr.length-1;

    appendUsers(arr,startIdx,endIdx);

};

const findUserToDelete = (arr,userId,hasQueryArray) => {

    for (let idx = 0; idx < arr.length; idx++) {
        
        const user = arr[idx];

        if (user.id == userId) {
            arr.splice(idx,1);

            if (hasQueryArray) {
                findUserToDelete(usersArr,userId);
            }

            break;
        }

    }

};

const handleEditRow = (e) => {

    const adminsDataRow = e.currentTarget.closest('li');

    const editBtn = adminsDataRow.children[4].children[0];
    editBtn.setAttribute('hidden',true);

    const doneEditBtn = adminsDataRow.children[4].children[1];
    doneEditBtn.removeAttribute('hidden');

    const name = adminsDataRow.children[1];
    const email = adminsDataRow.children[2];
    const role = adminsDataRow.children[3];

    name.setAttribute('contenteditable','true');
    email.setAttribute('contenteditable','true');
    role.setAttribute('contenteditable','true');

    name.classList.add('bg-gray-100')
    email.classList.add('bg-gray-100')
    role.classList.add('bg-gray-100')
    console.log(name,email,role);

};

const handleDoneEditRow = (e) => {

    const adminsDataRow = e.currentTarget.closest('li');
    const userId = adminsDataRow.getAttribute('data-id');

    const editBtn = adminsDataRow.children[4].children[0];
    editBtn.removeAttribute('hidden');

    const doneEditBtn = adminsDataRow.children[4].children[1];
    doneEditBtn.setAttribute('hidden',true);

    const name = adminsDataRow.children[1];
    const email = adminsDataRow.children[2];
    const role = adminsDataRow.children[3];

    name.setAttribute('contenteditable','false');
    email.setAttribute('contenteditable','false');
    role.setAttribute('contenteditable','false');

    name.classList.remove('bg-gray-100')
    email.classList.remove('bg-gray-100')
    role.classList.remove('bg-gray-100')
    
    for (let idx = 0; idx < usersArr.length; idx++) {
        const user = usersArr[idx];
        if (user.id == userId) {
            user.name = name.innerText;
            user.email = email.innerText;
            user.role = role.innerText;
        }
    }

};

const handleDeleteSelectedRows = () => {

    const list = document.querySelector('ul');
    const usersListItems = list.children;

    const hasQueryArray = queriedUsersArr.length;
    const arr = hasQueryArray ? queriedUsersArr : usersArr;
    
    for (let idx = 1; idx < usersListItems.length; idx++) {
        const userListItem = usersListItems[idx];
        const id = userListItem.getAttribute('data-id');
        const checkbox = userListItem.children[0].firstElementChild;
        
        if (checkbox.checked) {
            findUserToDelete(arr,id,hasQueryArray)
        }

    }

    const startIdx = Number((activePage-1).toString() + "0");
    const endIdx = (arr.length >= startIdx+10) ? startIdx+9 : arr.length-1;
    appendUsers(arr,startIdx,endIdx);

};

const checkboxEvent = (e) => {
    const checkbox = e.target;
    const userListItem = checkbox.parentNode.parentNode;
    userListItem.classList.toggle('bg-gray-100');
};

const checkUncheckAll = (mainCheckBox) => {

    const checkboxes = document.getElementsByClassName('data-row');
    
    for (let idx = 0; idx < checkboxes.length; idx++) {
        const checkbox = checkboxes[idx];
        checkbox.checked = mainCheckBox.checked;
        const userListItem = checkbox.parentNode.parentNode;
        userListItem.classList.toggle('bg-gray-100');
    }

};

// this function is called whenever the value of activePage variable changes and onload
const addClassActivePage = () => {

    const pageBtns = document.getElementsByClassName('page-button');
    
    for (let i = 0; i < pageBtns.length; i++) {
        const pageBtn = pageBtns[i];
        const pageNo = pageBtn.innerText;
        if (pageNo == activePage) {
            pageBtn.classList.add('active-page');
        } else {
            pageBtn.classList.remove('active-page');
        }
    }

};
