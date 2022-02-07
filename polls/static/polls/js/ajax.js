let csr = $("input[name=csrfmiddlewaretoken").val();
let base64Image;
$("#image-selector").change(function() {
    let reader = new FileReader();
    reader.onload = function(e) {
        let dataURL = reader.result;
        $('#selected-image').attr("src", dataURL).height(250).width(300);
       
        base64Image = dataURL.replace("data:image/png;base64,","");
        //console.log(base64Image);

    }
    reader.readAsDataURL($("#image-selector")[0].files[0]);
    var temp = $("#image-selector")[0].files[0];
 
    $("#noFile").text(temp.name);

});

$("#predict-button").click(function(){
    let message = {
        image: base64Image
    }
    //console.log(message);

    $.ajax({
        cache : false,
        url: "predict",
        method: "POST",
        headers: {'X-CSRFToken': csr},
        data: message,
        dataType : "json",
        success: function(list){
            let cat = list['cat'];
            let perc = list['perc'];
        
            $("#table-maker").empty();
            var tbl = document.createElement("table");
            var tblBody = document.createElement("tbody");

            var row = document.createElement("tr");
            var x = document.createElement("th");
            x.appendChild(document.createTextNode("Prediction Category"));
            row.appendChild(x);
            var x = document.createElement("th");                  
            x.appendChild(document.createTextNode("Perchantage"));
            row.appendChild(x);
            tblBody.appendChild(row);

            for( var i=0 ; i< cat.length ;i++){
                var row = document.createElement("tr");
                var cell = document.createElement("td");
                var cellText = document.createTextNode(cat[i]);
                cell.appendChild(cellText);
                row.appendChild(cell);
                var cell = document.createElement("td");
                var cellText = document.createTextNode(Number(perc[i]).toFixed(2));
                cell.appendChild(cellText);
                row.appendChild(cell);
                tblBody.appendChild(row);
            }
            // put the <tbody> in the <table>
            tbl.appendChild(tblBody);
            // appends <table> into <body>
          
            $("#table-maker").append(tbl);
            
            
        },
    }); 

});  