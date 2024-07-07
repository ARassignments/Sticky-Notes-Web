let listData = [];
let inputColor = document.querySelector("#color");
document.querySelector("#addNotesBtn").onclick = () =>{
    if(localStorage.getItem("stickies")){
        let data = JSON.parse(localStorage.getItem("stickies"));
        data.push({
            stickyColor:inputColor.value,
            stickyText:"",
            stickyTopPos:"60px",
            stickyLeftPos:"50px",
            stickyZindex:2
        });
        localStorage.setItem("stickies",JSON.stringify(data));
    } else {
        listData.push({
            stickyColor:inputColor.value,
            stickyText:"",
            stickyTopPos:"60px",
            stickyLeftPos:"50px",
            stickyZindex:2
        });
        localStorage.setItem("stickies",JSON.stringify(listData));
    }
    showData();
}

showData();
function showData(){
    if(localStorage.getItem("stickies")){
        let data = JSON.parse(localStorage.getItem("stickies"));
        document.querySelector("#list").innerHTML = "";
        for(let i = 0; i < data.length; i++){
            document.querySelector("#list").innerHTML += `
                <div class="note note${i}" style="border-color:${data[i].stickyColor};top:${data[i].stickyTopPos};left:${data[i].stickyLeftPos};z-index:${data[i].stickyZindex}" onmousedown="stickyMouseDown(event,'note${i}')" onmousemove="stickyMouseMove(event,'note${i}')" onmouseup="stickyMouseUp(${i})">
                    <span class="close" onclick="stickyRemove(${i})"><i class="bi bi-x-lg"></i></span>
                    <span class="copyBtn" onclick="copyStickyText('note${i}')"><i class="bi bi-clipboard"></i></span>
                    <textarea rows="10" cols="30" placeholder="Write Content..." onblur="stickyUpdate(${i})" onkeyup="stickyUpdate(${i})">${data[i].stickyText}</textarea>
                </div>
            `;
        }
    }
}

// document.addEventListener('click', (event)=>{
//     if(event.target.classList.contains('close')){
//         event.target.parentNode.remove();
//     }
// });

let cursor = {
    x: null,
    y: null
};
let note = {
    dom: null,
    x: null,
    y: null
};
// document.addEventListener('mousedown', (event)=>{
//     if(event.target.classList.contains('note')){
//         cursor = {
//             x: event.clientX,
//             y: event.clientY
//         };
//         note = {
//             dom: event.target,
//             x: event.target.getBoundingClientRect().left,
//             y: event.target.getBoundingClientRect().top
//         };
//     }
// });
// document.addEventListener('mousemove', (event)=>{
//     if(note.dom == null) return;
//     if(event.target.classList.contains('note')){
//         let currentCursor = {
//             x: event.clientX,
//             y: event.clientY
//         };
//         let distance = {
//             x: currentCursor.x - cursor.x,
//             y: currentCursor.y - cursor.y
//         };
//         note.dom.style.left = (note.x + distance.x) + 'px';
//         note.dom.style.top = (note.y + distance.y) + 'px';
//         note.dom.style.cursor = 'grab';
//         console.log(note);
//     }
// });
// document.addEventListener('mouseup', ()=>{
//     note.dom.style.cursor = 'grab';
//     note.dom = null;
// });
function stickyMouseDown(event, elementId){
    if(event.target.classList.contains(`${elementId}`)){
        cursor = {
            x: event.clientX,
            y: event.clientY
        };
        note = {
            dom: event.target,
            x: event.target.getBoundingClientRect().left,
            y: event.target.getBoundingClientRect().top
        };
        document.querySelectorAll(".note").forEach((item)=>{
            item.style.zIndex = "1";
        })
        note.dom.style.zIndex = "2";
    }
}
function stickyMouseMove(event, elementId){
    if(note.dom == null) return;
    if(event.target.classList.contains(`${elementId}`)){
        let currentCursor = {
            x: event.clientX,
            y: event.clientY
        };
        let distance = {
            x: currentCursor.x - cursor.x,
            y: currentCursor.y - cursor.y
        };
        note.dom.style.left = (note.x + distance.x) + 'px';
        note.dom.style.top = (note.y + distance.y) + 'px';
    }
}
function stickyMouseUp(indexNo){
    if(note.dom != null){
        if(localStorage.getItem("stickies")){
            let data = JSON.parse(localStorage.getItem("stickies"));
            for (let i = 0; i < data.length; i++) {
                data[i].stickyZindex = "1";
            }
            data[indexNo].stickyLeftPos = note.dom.style.left;
            data[indexNo].stickyTopPos = note.dom.style.top;
            data[indexNo].stickyZindex = note.dom.style.zIndex;
            localStorage.setItem("stickies",JSON.stringify(data));
        }
    }
    note.dom = null;
}
function stickyUpdate(indexNo){
    if(localStorage.getItem("stickies")){
        let data = JSON.parse(localStorage.getItem("stickies"));
        data[indexNo].stickyText = document.querySelector(`.note${indexNo} textarea`).value.trim();
        localStorage.setItem("stickies",JSON.stringify(data));
    }
}
function stickyRemove(indexNo){
    if(confirm("Are you sure you want to remove?")){
        if(localStorage.getItem("stickies")){
            let data = JSON.parse(localStorage.getItem("stickies"));
            if(indexNo > -1){
                data.splice(indexNo, 1);
            }
            localStorage.setItem("stickies",JSON.stringify(data));
            showData();
        }
    }
}

function copyStickyText(elementId){
    navigator.clipboard.writeText(document.querySelector(`.${elementId} textarea`).value)
    document.querySelector(`.${elementId} .copyBtn i`).classList.remove("bi-clipboard")
    document.querySelector(`.${elementId} .copyBtn i`).classList.add("bi-check-lg")
    setTimeout(() => {
        document.querySelector(`.${elementId} .copyBtn i`).classList.remove("bi-check-lg")
        document.querySelector(`.${elementId} .copyBtn i`).classList.add("bi-clipboard")
    }, 1000)
}