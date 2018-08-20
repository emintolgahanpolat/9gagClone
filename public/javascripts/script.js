function imgViewModal(element) {
    document.getElementById("img01").src = element.src;
    $('#imgViewModal').modal('toggle')

}


function previewFile() {
    var preview = document.getElementById('jsid-profile-avatar');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}

function upVote(id,points) {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            document.getElementById('points'+id).innerHTML=parseInt(points)+1 +' points'
        }
    }

    xmlhttp.open("GET", "/upVote/"+id, true);
    xmlhttp.send();

}


function downVote(id,points) {


    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            document.getElementById('points'+id).innerHTML=parseInt(points)-1 +' points'
        }
    }

    xmlhttp.open("GET", "/downVote/"+id, true);
    xmlhttp.send();
}




function searchHome(str) {

    if (str.length == 0) {
        document.getElementById("searchResults").innerHTML = "";
        document.getElementById("searchResults").style.border = "0px";
        return;
    }
    if(str.length>=2){
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {  // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("searchResults").innerHTML = "";
                for (index in JSON.parse(this.responseText)) {
                    var a = document.createElement("a");
                    a.className="ml-2 mr-2 mt-1 text-black d-flex justify-content-between align-items-center";
                    a.style.cursor="pointer";
                    a.href="/tag/"+JSON.parse(this.responseText)[index]._id;
                    var span1 = document.createElement("span");
                    span1.innerHTML=JSON.parse(this.responseText)[index]._id;
                    a.appendChild(span1);
                    var span2 = document.createElement("span");
                    span2.innerHTML=JSON.parse(this.responseText)[index].count;
                    a.appendChild(span2);
                    document.getElementById("searchResults").appendChild(a);
                }

            }
        }

        xmlhttp.open("GET", "/search/" + str, true);
        xmlhttp.send();
    }

}
